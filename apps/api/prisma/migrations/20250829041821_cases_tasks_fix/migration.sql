-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "public"."CaseTask" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" INTEGER,
    "dueAt" TIMESTAMP(3),
    "assigneeId" UUID,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CaseTask_caseId_idx" ON "public"."CaseTask"("caseId");

-- CreateIndex
CREATE INDEX "CaseTask_status_idx" ON "public"."CaseTask"("status");

-- CreateIndex
CREATE INDEX "CaseTask_assigneeId_idx" ON "public"."CaseTask"("assigneeId");

-- AddForeignKey
ALTER TABLE "public"."CaseTask" ADD CONSTRAINT "CaseTask_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CaseTask" ADD CONSTRAINT "CaseTask_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
