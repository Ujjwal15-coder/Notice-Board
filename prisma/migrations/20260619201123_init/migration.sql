-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Exam', 'Event', 'General');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('Urgent', 'Normal');

-- CreateTable
CREATE TABLE "Notice" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'General',
    "priority" "Priority" NOT NULL DEFAULT 'Normal',
    "publishDate" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notice_priority_publishDate_idx" ON "Notice"("priority", "publishDate");
