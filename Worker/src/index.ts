// worker.ts
import { PubSub } from '@google-cloud/pubsub';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp-promise';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

const pubsub = new PubSub();
const prisma = new PrismaClient();

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!, // Replace with your R2 endpoint
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

const SOURCE_BUCKET = process.env.R2_SOURCE_BUCKET!;
const TARGET_BUCKET = process.env.R2_TARGET_BUCKET!;
const DEMO_TARGET_BUCKET = process.env.R2_DEMO_TARGET_BUCKET!;

async function downloadFromR2(key: string, outPath: string) {
  const command = new GetObjectCommand({ Bucket: SOURCE_BUCKET, Key: key });
  const response = await s3.send(command);
  const stream = response.Body as Readable;
  const writeStream = fs.createWriteStream(outPath);
  
  await new Promise<void>((resolve, reject) => {
    stream.pipe(writeStream)
      .on('finish', () => resolve())
      .on('error', (error) => reject(error));
  });
}

async function uploadFolderToR2(folderPath: string, prefix: string, demo: boolean) {
  const files = await fs.readdir(folderPath);
  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    const stat = await fs.stat(fullPath);
    const BUCKET = demo ? DEMO_TARGET_BUCKET: TARGET_BUCKET;
    if (stat.isDirectory()) {
      await uploadFolderToR2(fullPath, `${prefix}/${file}`,demo);
    } else {
      const fileBuffer = await fs.readFile(fullPath);
      const key = `${prefix}/${file}`;
      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: fileBuffer,
      });
      await s3.send(command);
    }
  }
}

// Helper function to get video dimensions
async function getVideoDimensions(inputPath: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) return reject(err);
      
      const stream = metadata.streams.find(s => s.codec_type === 'video');
      if (!stream || !stream.width || !stream.height) {
        return reject(new Error('Unable to determine video dimensions'));
      }
      
      resolve({ width: stream.width, height: stream.height });
    });
  });
}

async function encodeToHLS(inputPath: string, outputDir: string, resolution: string, qualityLabel: string) {
  const [width, height] = resolution.split('x');
  const outPath = path.join(outputDir, qualityLabel);
  await fs.ensureDir(outPath);

  return new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-vf', `scale=w=${width}:h=${height}`,
        '-c:a', 'aac',
        '-ar', '48000',
        '-c:v', 'h264',
        '-profile:v', 'main',
        '-crf', '20',
        '-sc_threshold', '0',
        '-g', '48',
        '-keyint_min', '48',
        '-hls_time', '4',
        '-hls_playlist_type', 'vod',
        '-f', 'hls',
        '-start_number 0',   // added this for hls
        '-hls_flags independent_segments'  // added this for hls
      ])
      .output(path.join(outPath, 'index.m3u8'))
      .on('end', () => resolve())
      .on('error', reject)
      .run();
  });
}

async function handleMessage(videoId: string, rawKey: string, demo: boolean) {
  const temp = await tmp.dir({ unsafeCleanup: true });
  const inputPath = path.join(temp.path, 'input.mp4');
  
  // 1. Download raw video
  await downloadFromR2(rawKey, inputPath);
  
  // 2. Detect video dimensions
  const dimensions = await getVideoDimensions(inputPath);
  
  
  let resolutions: string[];
  let targetLabels: string[];
  
  if (dimensions.height >= 2160) {
    resolutions = ['3840x2160', '1920x1080', '1280x720'];
    targetLabels = ['high', 'mid', 'low'];
  } else if (dimensions.height >= 1080) {
    resolutions = ['1920x1080', '1280x720', '854x480'];
    targetLabels = ['high', 'mid', 'low'];
  } else if (dimensions.height >= 720) {
    resolutions = ['1280x720', '854x480'];
    targetLabels = ['mid', 'low']; 
  } else {
    
    resolutions = ['854x480'];
    targetLabels = ['low'];
  }

  const encodedPaths: Record<string, string> = {};
  
  for (let i = 0; i < resolutions.length; i++) {
    await encodeToHLS(inputPath, temp.path, resolutions[i], targetLabels[i]);
    encodedPaths[targetLabels[i]] = resolutions[i];
  }

  // 3. Upload each encoded folder to R2
  const uploadPrefix = `${videoId}`;
  await uploadFolderToR2(temp.path, uploadPrefix, demo);

  // 4. Update DB with HLS URLs
  const CDN_DOMAIN = demo ? process.env.R2_DEMO_CDN_DOMAIN! : process.env.R2_CDN_DOMAIN!;
  const hlsUrls: Record<string, string> = {};
  
  for (const label of Object.keys(encodedPaths)) {
    hlsUrls[label] = `${CDN_DOMAIN}/${uploadPrefix}/${label}/index.m3u8`;
  }
  
  // For 720p videos, make 'high' point to 'mid' URL
  if (dimensions.height >= 720 && dimensions.height < 1080) {
    hlsUrls['high'] = hlsUrls['mid'];
  } 
  // For 480p videos, make both 'high' and 'mid' point to 'low' URL
  else if (dimensions.height < 720) {
    hlsUrls['high'] = hlsUrls['mid'] = hlsUrls['low'];
  }

  await prisma.video.update({
    where: { id: videoId },
    data: {
      encoded: true,
      hlsUrls,
    },
  });

  await temp.cleanup();
}

// Subscribe to Pub/Sub
const subscription = pubsub.subscription('video-encoding-sub');

subscription.on('message', async (message) => {
  try {
    const data = JSON.parse(message.data.toString());
    const { videoId, rawKey, demo } = data;
    
    // Get retry count from attributes or set to 0
    const retryCount = parseInt(message.attributes.retryCount || '0', 10);
    
    if (retryCount >= 3) {
      // Send to dead letter topic after 3 retries
      // await pubsub.topic('failed-video-encodings').publish(
      //   Buffer.from(JSON.stringify({
      //     videoId,
      //     rawKey,
      //     error: 'Max retries exceeded'
      //   }))
      // );
      
      // Update DB to mark video as failed
      // await prisma.video.update({
      //   where: { id: videoId },
      //   data: { encodingFailed: true }
      // });
      
      message.ack(); 
      return;
    }
    
    // console.log(`🎥 Processing video ${videoId} (Attempt: ${retryCount + 1})`);
    await handleMessage(videoId, rawKey, demo);

    message.ack();
  } catch (err) {
    console.error('❌ Error processing message:', err);
    

    // const data = JSON.parse(message.data.toString());
    const retryCount = parseInt(message.attributes.retryCount || '0', 10);
    
    await pubsub.topic('video-encoding').publishMessage({
      data: Buffer.from(message.data.toString()),
      attributes: { retryCount: (retryCount + 1).toString() }
    });
    
    message.ack(); 
  }
});