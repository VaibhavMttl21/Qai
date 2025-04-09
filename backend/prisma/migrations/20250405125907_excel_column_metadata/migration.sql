-- CreateTable
CREATE TABLE "ExcelColumnMeta" (
    "id" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "columnName" TEXT NOT NULL,
    "columnIndex" INTEGER NOT NULL,
    "dataType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcelColumnMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExcelColumnMeta_sheetId_columnName_key" ON "ExcelColumnMeta"("sheetId", "columnName");

-- CreateIndex
CREATE UNIQUE INDEX "ExcelColumnMeta_sheetId_columnIndex_key" ON "ExcelColumnMeta"("sheetId", "columnIndex");

-- AddForeignKey
ALTER TABLE "ExcelColumnMeta" ADD CONSTRAINT "ExcelColumnMeta_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "ExcelSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
