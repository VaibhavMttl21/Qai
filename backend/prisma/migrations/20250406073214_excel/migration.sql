-- CreateTable
CREATE TABLE "ExcelExtractedData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "emailId" TEXT NOT NULL,
    "excelDataId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcelExtractedData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExcelExtractedData" ADD CONSTRAINT "ExcelExtractedData_excelDataId_fkey" FOREIGN KEY ("excelDataId") REFERENCES "ExcelData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
