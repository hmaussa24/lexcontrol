-- DropForeignKey
ALTER TABLE "public"."TimeEntry" DROP CONSTRAINT "TimeEntry_userId_fkey";

-- AlterTable
ALTER TABLE "public"."TimeEntry" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."TimeEntry" ADD CONSTRAINT "TimeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
