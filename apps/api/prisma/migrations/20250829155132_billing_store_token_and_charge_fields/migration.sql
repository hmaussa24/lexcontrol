-- AlterTable
ALTER TABLE "public"."PaymentMethod" ADD COLUMN     "wompiCardToken" TEXT;

-- AlterTable
ALTER TABLE "public"."Subscription" ADD COLUMN     "lastChargeAt" TIMESTAMP(3),
ADD COLUMN     "lastChargeError" TEXT,
ADD COLUMN     "lastChargeStatus" TEXT;
