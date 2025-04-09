/*
  Warnings:

  - You are about to drop the `ExcelCell` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExcelColumnMeta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExcelFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExcelRow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExcelSheet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExcelCell" DROP CONSTRAINT "ExcelCell_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "ExcelColumnMeta" DROP CONSTRAINT "ExcelColumnMeta_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "ExcelFile" DROP CONSTRAINT "ExcelFile_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExcelRow" DROP CONSTRAINT "ExcelRow_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "ExcelSheet" DROP CONSTRAINT "ExcelSheet_fileId_fkey";

-- DropTable
DROP TABLE "ExcelCell";

-- DropTable
DROP TABLE "ExcelColumnMeta";

-- DropTable
DROP TABLE "ExcelFile";

-- DropTable
DROP TABLE "ExcelRow";

-- DropTable
DROP TABLE "ExcelSheet";

-- CreateTable
CREATE TABLE "ExcelData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcelData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExcelData" ADD CONSTRAINT "ExcelData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
