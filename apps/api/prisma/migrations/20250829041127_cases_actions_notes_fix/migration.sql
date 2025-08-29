-- CreateTable
CREATE TABLE "public"."CaseAction" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "documentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CaseNote" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CaseAction_caseId_idx" ON "public"."CaseAction"("caseId");

-- CreateIndex
CREATE INDEX "CaseAction_date_idx" ON "public"."CaseAction"("date");

-- CreateIndex
CREATE INDEX "CaseNote_caseId_idx" ON "public"."CaseNote"("caseId");

-- CreateIndex
CREATE INDEX "CaseNote_createdAt_idx" ON "public"."CaseNote"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."CaseAction" ADD CONSTRAINT "CaseAction_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CaseAction" ADD CONSTRAINT "CaseAction_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "public"."Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CaseNote" ADD CONSTRAINT "CaseNote_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CaseNote" ADD CONSTRAINT "CaseNote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
