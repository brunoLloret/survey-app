/*
  Warnings:

  - You are about to drop the column `surveyId` on the `question` table. All the data in the column will be lost.
  - Added the required column `sectionId` to the `question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "question" DROP CONSTRAINT "question_surveyId_fkey";

-- DropIndex
DROP INDEX "question_surveyId_idx";

-- AlterTable
ALTER TABLE "question" DROP COLUMN "surveyId",
ADD COLUMN     "sectionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "survey" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "section" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "surveyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "section_surveyId_idx" ON "section"("surveyId");

-- CreateIndex
CREATE INDEX "question_sectionId_idx" ON "question"("sectionId");

-- AddForeignKey
ALTER TABLE "section" ADD CONSTRAINT "section_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
