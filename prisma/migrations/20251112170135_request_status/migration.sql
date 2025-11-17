-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."Finca" ADD COLUMN     "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING';
