-- CreateTable
CREATE TABLE "ExcelDocument" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcelDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcelSheet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "excelDocumentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcelSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcelCell" (
    "id" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "value" TEXT,
    "excelSheetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcelCell_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExcelCell_excelSheetId_row_column_key" ON "ExcelCell"("excelSheetId", "row", "column");

-- AddForeignKey
ALTER TABLE "ExcelDocument" ADD CONSTRAINT "ExcelDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcelSheet" ADD CONSTRAINT "ExcelSheet_excelDocumentId_fkey" FOREIGN KEY ("excelDocumentId") REFERENCES "ExcelDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcelCell" ADD CONSTRAINT "ExcelCell_excelSheetId_fkey" FOREIGN KEY ("excelSheetId") REFERENCES "ExcelSheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
