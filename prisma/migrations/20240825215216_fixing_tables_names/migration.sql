/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Friendship` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meetings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mural` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBlocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Visitor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_initiatorId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_participantId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_muralId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_addressedId_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_requesterId_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_author_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_muralId_fkey";

-- DropForeignKey
ALTER TABLE "Meetings" DROP CONSTRAINT "Meetings_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Mural" DROP CONSTRAINT "Mural_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserBlocks" DROP CONSTRAINT "UserBlocks_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "UserBlocks" DROP CONSTRAINT "UserBlocks_blockerId_fkey";

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "Comments";

-- DropTable
DROP TABLE "Friendship";

-- DropTable
DROP TABLE "Likes";

-- DropTable
DROP TABLE "Meetings";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Mural";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserBlocks";

-- DropTable
DROP TABLE "Visitor";

-- CreateTable
CREATE TABLE "meetings" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meetingId" TEXT,
    "userId" TEXT NOT NULL,
    "muralId" TEXT,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meetingId" TEXT,
    "author" TEXT NOT NULL,
    "muralId" TEXT,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mural" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "mural_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "imageProfile" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "password" TEXT NOT NULL,
    "token" TEXT,
    "emailConfirmationToken" TEXT,
    "emailConfirmationExpires" TIMESTAMP(3),
    "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_blocks" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,

    CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendship" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requesterId" TEXT NOT NULL,
    "addressedId" TEXT NOT NULL,

    CONSTRAINT "friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat" (
    "id" TEXT NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_emailConfirmationToken_key" ON "user"("emailConfirmationToken");

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_muralId_fkey" FOREIGN KEY ("muralId") REFERENCES "mural"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_muralId_fkey" FOREIGN KEY ("muralId") REFERENCES "mural"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_author_fkey" FOREIGN KEY ("author") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mural" ADD CONSTRAINT "mural_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_addressedId_fkey" FOREIGN KEY ("addressedId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
