import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function createVideo() {
  try {
    // Hash the password
    
    await prisma.module.create({
      data: {
        id: "6d52db7b-a23c-4fd6-b893-07723478d587",
        name: "Example Module", // renamed to keep it clean
        description: "Cleaned up description for the module",
        order: 1,
        createdAt: new Date("2025-04-25T09:23:14.755Z"),
        updatedAt: new Date("2025-04-25T09:23:14.755Z"),
       
      },
    });
    
    // Create the admin user
    const video = await prisma.video.create({
  data: {
    id: "28a53cb1-b021-4521-b9ed-fde9a60f2c0f",
    title: "Video 1",
    description: "Example description",
    order: 1,
    encoded: true,
    hlsUrls: {
        "480p": "https://videos.raghu.fun/28a53cb1-b021-4521-b9ed-fde9a60f2c0f/480p/index.m3u8",
        "720p": "https://videos.raghu.fun/28a53cb1-b021-4521-b9ed-fde9a60f2c0f/720p/index.m3u8",
        "1080p": "https://videos.raghu.fun/28a53cb1-b021-4521-b9ed-fde9a60f2c0f/1080p/index.m3u8",
    },
    createdAt: new Date("2025-04-25T09:34:37.256Z"),
    updatedAt: new Date("2025-04-25T10:09:06.579Z"),
    module: {
      connectOrCreate: {
        where: { id: "6d52db7b-a23c-4fd6-b893-07723478d587" },
        create: {
          id: "6d52db7b-a23c-4fd6-b893-07723478d587",
          name: "Example Module",
          description: "Cleaned up description",
          order: 1,
          createdAt: new Date("2025-04-25T09:23:14.755Z"),
          updatedAt: new Date("2025-04-25T09:23:14.755Z"),
        },
      },
    },
  },
});

    await prisma.video.create({
  data: {
    id: "38e5e6f0-4306-4870-97d2-f595927966e6",
    title: "Video 2",
    description: "Another example description",
    order: 2,
    encoded: true,
    hlsUrls: {
        "480p": "https://videos.raghu.fun/38e5e6f0-4306-4870-97d2-f595927966e6/480p/index.m3u8",
        "720p": "https://videos.raghu.fun/38e5e6f0-4306-4870-97d2-f595927966e6/720p/index.m3u8",
        "1080p": "https://videos.raghu.fun/38e5e6f0-4306-4870-97d2-f595927966e6/1080p/index.m3u8",
    },
    createdAt: new Date("2025-04-25T11:16:41.642Z"),
    updatedAt: new Date("2025-04-25T11:29:26.837Z"),
    module: {
      connect: {
        id: "6d52db7b-a23c-4fd6-b893-07723478d587",
      },
    },
    pdfs: {
      connect: [], // no PDFs for this one
    },
  },
});

prisma.module.update({
    where: { id: "6d52db7b-a23c-4fd6-b893-07723478d587" },
    data: {
        videos: {
        connect: [
            { id: "28a53cb1-b021-4521-b9ed-fde9a60f2c0f" },
            { id: "38e5e6f0-4306-4870-97d2-f595927966e6" },
        ],
        },
    },
    });

await prisma.pDF.create({
  data: {
    id: "963085af-7bde-4623-9496-cb2c52d436da",
    title: "Example PDF Title", // cleaned
    description: "",
    url: "https://pub-e3da7bfe7e25451cbc5a36e2c2d37ca6.r2.dev/963085af-7bde-4623-9496-cb2c52d436da.pdf",
    createdAt: new Date("2025-04-25T09:35:56.296Z"),
    updatedAt: new Date("2025-04-25T09:57:46.456Z"),
    video: {
      connect: {
        id: "28a53cb1-b021-4521-b9ed-fde9a60f2c0f",
      },
    },
  },
});

prisma.video.update({
  where: { id: "28a53cb1-b021-4521-b9ed-fde9a60f2c0f" },
  data: {
    pdfs: {
      connect: [
        { id: "963085af-7bde-4623-9496-cb2c52d436da" }, 
        ],
    },
    },
    });


    // console.log('Admin user created successfully:', video);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createVideo();