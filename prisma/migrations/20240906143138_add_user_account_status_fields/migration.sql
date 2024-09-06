-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleteScheduledAt" TIMESTAMP(3),
ADD COLUMN     "isDeactivated" BOOLEAN NOT NULL DEFAULT false;
