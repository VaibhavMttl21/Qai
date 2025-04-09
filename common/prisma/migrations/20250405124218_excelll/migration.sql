-- CreateTable
CREATE TABLE "ExcelRow" (
    "id" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "sheetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcelRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExcelRow_sheetId_rowNumber_key" ON "ExcelRow"("sheetId", "rowNumber");

-- AddForeignKey
ALTER TABLE "ExcelRow" ADD CONSTRAINT "ExcelRow_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "ExcelSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
