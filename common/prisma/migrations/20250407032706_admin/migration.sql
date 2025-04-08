-- CreateTable
CREATE TABLE "AdminPost" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "userId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminReply" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "userId" TEXT NOT NULL,
    "adminPostId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminReply_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdminPost" ADD CONSTRAINT "AdminPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminReply" ADD CONSTRAINT "AdminReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminReply" ADD CONSTRAINT "AdminReply_adminPostId_fkey" FOREIGN KEY ("adminPostId") REFERENCES "AdminPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
