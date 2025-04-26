/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `Module` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Video_order_key";

-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "order" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isPaid" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Module_order_key" ON "Module"("order");
