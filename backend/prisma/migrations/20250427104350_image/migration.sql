/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `AdminReply` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Reply` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[moduleId,order]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AdminPost" DROP CONSTRAINT "AdminPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "AdminReply" DROP CONSTRAINT "AdminReply_adminPostId_fkey";

-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_postId_fkey";

-- AlterTable
ALTER TABLE "AdminReply" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "imageUrl";

-- CreateIndex
CREATE UNIQUE INDEX "Video_moduleId_order_key" ON "Video"("moduleId", "order");

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminPost" ADD CONSTRAINT "AdminPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminReply" ADD CONSTRAINT "AdminReply_adminPostId_fkey" FOREIGN KEY ("adminPostId") REFERENCES "AdminPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
