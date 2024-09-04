/*
  Warnings:

  - A unique constraint covering the columns `[userId,provider]` on the table `Authentication` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Authentication_userId_provider_key" ON "Authentication"("userId", "provider");
