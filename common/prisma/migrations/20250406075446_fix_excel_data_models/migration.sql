/*
  Warnings:

  - You are about to drop the `ExcelData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExcelExtractedData` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dateofBirth` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExcelData" DROP CONSTRAINT "ExcelData_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExcelExtractedData" DROP CONSTRAINT "ExcelExtractedData_excelDataId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateofBirth" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "ExcelData";

-- DropTable
DROP TABLE "ExcelExtractedData";
