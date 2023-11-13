/*
  Warnings:

  - A unique constraint covering the columns `[emailConfirmationToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_emailConfirmationToken_key" ON "User"("emailConfirmationToken");
