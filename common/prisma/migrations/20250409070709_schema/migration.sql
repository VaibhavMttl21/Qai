-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "encoded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hlsUrls" JSONB;
