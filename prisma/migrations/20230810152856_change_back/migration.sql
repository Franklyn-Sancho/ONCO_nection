-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT,
    "emailConfirmationToken" TEXT,
    "emailConfirmationExpires" DATETIME,
    "emailConfirmed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("email", "emailConfirmationExpires", "emailConfirmationToken", "emailConfirmed", "id", "name", "password", "token") SELECT "email", "emailConfirmationExpires", "emailConfirmationToken", "emailConfirmed", "id", "name", "password", "token" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_emailConfirmationToken_key" ON "User"("emailConfirmationToken");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
