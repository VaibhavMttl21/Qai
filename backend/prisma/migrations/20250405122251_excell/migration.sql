-- CreateTable
CREATE TABLE "ExcelFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcelFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcelSheet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcelSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcelCell" (
    "id" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "sheetId" TEXT NOT NULL,
    "textValue" TEXT,
    "numValue" DOUBLE PRECISION,
    "boolValue" BOOLEAN,
    "dateValue" TIMESTAMP(3),
    "formula" TEXT,
    "style" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcelCell_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExcelSheet_fileId_name_key" ON "ExcelSheet"("fileId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ExcelSheet_fileId_order_key" ON "ExcelSheet"("fileId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ExcelCell_sheetId_row_column_key" ON "ExcelCell"("sheetId", "row", "column");

-- AddForeignKey
ALTER TABLE "ExcelFile" ADD CONSTRAINT "ExcelFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcelSheet" ADD CONSTRAINT "ExcelSheet_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ExcelFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcelCell" ADD CONSTRAINT "ExcelCell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "ExcelSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
