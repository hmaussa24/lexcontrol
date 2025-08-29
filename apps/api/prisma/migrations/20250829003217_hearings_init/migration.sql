-- CreateTable
CREATE TABLE "public"."Hearing" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "location" TEXT,
    "type" TEXT,
    "attendees" JSONB,
    "result" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hearing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Hearing_caseId_idx" ON "public"."Hearing"("caseId");

-- AddForeignKey
ALTER TABLE "public"."Hearing" ADD CONSTRAINT "Hearing_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;
