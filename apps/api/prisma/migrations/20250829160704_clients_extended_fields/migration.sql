/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,identification]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "addressLine" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phones" TEXT[],
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "responsibleLawyerId" UUID,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "tags" TEXT[];

-- CreateTable
CREATE TABLE "public"."ClientContact" (
    "id" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientContact_clientId_idx" ON "public"."ClientContact"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_organizationId_identification_key" ON "public"."Client"("organizationId", "identification");

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_responsibleLawyerId_fkey" FOREIGN KEY ("responsibleLawyerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClientContact" ADD CONSTRAINT "ClientContact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
