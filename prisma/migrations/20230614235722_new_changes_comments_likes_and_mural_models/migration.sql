/*
  Warnings:

  - You are about to drop the column `meetingsId` on the `Likes` table. All the data in the column will be lost.
  - You are about to drop the column `muralsId` on the `Likes` table. All the data in the column will be lost.
  - You are about to drop the column `meetingsId` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `muralsId` on the `Comments` table. All the data in the column will be lost.
  - Added the required column `meetingId` to the `Likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `muralId` to the `Likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meetingId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `muralId` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meetingId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "muralId" TEXT NOT NULL,
    CONSTRAINT "Likes_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meetings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Likes_muralId_fkey" FOREIGN KEY ("muralId") REFERENCES "Mural" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Likes_author_fkey" FOREIGN KEY ("author") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Likes" ("author", "createdAt", "id") SELECT "author", "createdAt", "id" FROM "Likes";
DROP TABLE "Likes";
ALTER TABLE "new_Likes" RENAME TO "Likes";
CREATE TABLE "new_Comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "muralId" TEXT NOT NULL,
    CONSTRAINT "Comments_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meetings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comments_muralId_fkey" FOREIGN KEY ("muralId") REFERENCES "Mural" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comments" ("content", "createdAt", "id", "userId") SELECT "content", "createdAt", "id", "userId" FROM "Comments";
DROP TABLE "Comments";
ALTER TABLE "new_Comments" RENAME TO "Comments";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
