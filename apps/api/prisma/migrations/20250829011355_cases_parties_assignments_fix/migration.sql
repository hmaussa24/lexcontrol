-- CreateTable
CREATE TABLE "public"."CaseParty" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "identification" TEXT,
    "opposingLawyer" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CaseAssignment" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "until" TIMESTAMP(3),

    CONSTRAINT "CaseAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CaseParty_caseId_idx" ON "public"."CaseParty"("caseId");

-- CreateIndex
CREATE INDEX "CaseAssignment_caseId_idx" ON "public"."CaseAssignment"("caseId");

-- CreateIndex
CREATE INDEX "CaseAssignment_userId_idx" ON "public"."CaseAssignment"("userId");

-- AddForeignKey
ALTER TABLE "public"."CaseParty" ADD CONSTRAINT "CaseParty_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CaseAssignment" ADD CONSTRAINT "CaseAssignment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CaseAssignment" ADD CONSTRAINT "CaseAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
