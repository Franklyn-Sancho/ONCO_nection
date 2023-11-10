/*
  Warnings:

  - Added the required column `content` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meetingsId` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meetingsId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    CONSTRAINT "Likes_meetingsId_fkey" FOREIGN KEY ("meetingsId") REFERENCES "Meetings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Likes_author_fkey" FOREIGN KEY ("author") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meetingsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Comments_meetingsId_fkey" FOREIGN KEY ("meetingsId") REFERENCES "Meetings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comments" ("id", "userId") SELECT "id", "userId" FROM "Comments";
DROP TABLE "Comments";
ALTER TABLE "new_Comments" RENAME TO "Comments";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
