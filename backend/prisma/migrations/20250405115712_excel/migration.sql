/*
  Warnings:

  - You are about to drop the `ExcelCell` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExcelDocument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExcelSheet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExcelCell" DROP CONSTRAINT "ExcelCell_excelSheetId_fkey";

-- DropForeignKey
ALTER TABLE "ExcelDocument" DROP CONSTRAINT "ExcelDocument_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExcelSheet" DROP CONSTRAINT "ExcelSheet_excelDocumentId_fkey";

-- DropTable
DROP TABLE "ExcelCell";

-- DropTable
DROP TABLE "ExcelDocument";

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
