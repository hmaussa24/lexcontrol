-- CreateTable
CREATE TABLE "public"."Document" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "folder" TEXT,
    "access" TEXT NOT NULL DEFAULT 'private',
    "currentVersionId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DocumentVersion" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "storageKey" TEXT NOT NULL,
    "checksum" TEXT,
    "size" INTEGER,
    "mime" TEXT,
    "version" INTEGER NOT NULL,
    "createdById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_currentVersionId_key" ON "public"."Document"("currentVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentVersion_documentId_version_key" ON "public"."DocumentVersion"("documentId", "version");

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "public"."DocumentVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentVersion" ADD CONSTRAINT "DocumentVersion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "public"."Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
