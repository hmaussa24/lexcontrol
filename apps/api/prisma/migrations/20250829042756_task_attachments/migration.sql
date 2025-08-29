-- CreateTable
CREATE TABLE "public"."TaskAttachment" (
    "id" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "size" INTEGER,
    "mime" TEXT,
    "createdById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskAttachment_taskId_idx" ON "public"."TaskAttachment"("taskId");

-- AddForeignKey
ALTER TABLE "public"."TaskAttachment" ADD CONSTRAINT "TaskAttachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."CaseTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
