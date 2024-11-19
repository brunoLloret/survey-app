-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('checkbox', 'radio', 'dropdown', 'open', 'matrix');

-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('draft', 'published', 'closed');

-- CreateEnum
CREATE TYPE "SurveyResponseStatus" AS ENUM ('complete', 'partial', 'invalid');

-- CreateTable
CREATE TABLE "survey" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "SurveyStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "type" "QuestionType" NOT NULL,
    "surveyId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "question" TEXT,
    "placeholder" TEXT,
    "maxLength" INTEGER,
    "checked" BOOLEAN,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT,
    "questionId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_response" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "status" "SurveyResponseStatus" NOT NULL DEFAULT 'partial',
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "survey_response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_response" (
    "id" TEXT NOT NULL,
    "surveyResponseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "textValue" TEXT,
    "booleanValue" BOOLEAN,

    CONSTRAINT "question_response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OptionResponses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "question_surveyId_idx" ON "question"("surveyId");

-- CreateIndex
CREATE INDEX "option_questionId_idx" ON "option"("questionId");

-- CreateIndex
CREATE INDEX "survey_response_surveyId_idx" ON "survey_response"("surveyId");

-- CreateIndex
CREATE INDEX "question_response_questionId_idx" ON "question_response"("questionId");

-- CreateIndex
CREATE INDEX "question_response_surveyResponseId_idx" ON "question_response"("surveyResponseId");

-- CreateIndex
CREATE UNIQUE INDEX "_OptionResponses_AB_unique" ON "_OptionResponses"("A", "B");

-- CreateIndex
CREATE INDEX "_OptionResponses_B_index" ON "_OptionResponses"("B");

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "option"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_response" ADD CONSTRAINT "survey_response_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_response" ADD CONSTRAINT "question_response_surveyResponseId_fkey" FOREIGN KEY ("surveyResponseId") REFERENCES "survey_response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_response" ADD CONSTRAINT "question_response_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionResponses" ADD CONSTRAINT "_OptionResponses_A_fkey" FOREIGN KEY ("A") REFERENCES "option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionResponses" ADD CONSTRAINT "_OptionResponses_B_fkey" FOREIGN KEY ("B") REFERENCES "question_response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
