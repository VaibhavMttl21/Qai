/*
  Warnings:

  - You are about to drop the `ExcelData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExcelData" DROP CONSTRAINT "ExcelData_userId_fkey";

-- DropTable
DROP TABLE "ExcelData";
