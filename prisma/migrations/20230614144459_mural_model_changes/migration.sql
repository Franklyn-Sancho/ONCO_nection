/*
  Warnings:

  - You are about to drop the column `title` on the `Mural` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Mural` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mural" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Mural_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Mural" ("body", "createdAt", "id") SELECT "body", "createdAt", "id" FROM "Mural";
DROP TABLE "Mural";
ALTER TABLE "new_Mural" RENAME TO "Mural";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
