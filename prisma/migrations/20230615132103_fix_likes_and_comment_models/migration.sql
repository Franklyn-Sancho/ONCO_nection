-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meetingId" TEXT,
    "userId" TEXT NOT NULL,
    "muralId" TEXT,
    CONSTRAINT "Comments_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meetings" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comments_muralId_fkey" FOREIGN KEY ("muralId") REFERENCES "Mural" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comments" ("content", "createdAt", "id", "meetingId", "muralId", "userId") SELECT "content", "createdAt", "id", "meetingId", "muralId", "userId" FROM "Comments";
DROP TABLE "Comments";
ALTER TABLE "new_Comments" RENAME TO "Comments";
CREATE TABLE "new_Likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meetingId" TEXT,
    "author" TEXT NOT NULL,
    "muralId" TEXT,
    CONSTRAINT "Likes_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meetings" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Likes_muralId_fkey" FOREIGN KEY ("muralId") REFERENCES "Mural" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Likes_author_fkey" FOREIGN KEY ("author") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Likes" ("author", "createdAt", "id", "meetingId", "muralId") SELECT "author", "createdAt", "id", "meetingId", "muralId" FROM "Likes";
DROP TABLE "Likes";
ALTER TABLE "new_Likes" RENAME TO "Likes";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
