/*
  Warnings:

  - You are about to drop the `chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `friendship` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meetings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mural` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_blocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visitor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_initiatorId_fkey";

-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_participantId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_muralId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "friendship" DROP CONSTRAINT "friendship_addressedId_fkey";

-- DropForeignKey
ALTER TABLE "friendship" DROP CONSTRAINT "friendship_requesterId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_author_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_muralId_fkey";

-- DropForeignKey
ALTER TABLE "meetings" DROP CONSTRAINT "meetings_userId_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "mural" DROP CONSTRAINT "mural_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_blocks" DROP CONSTRAINT "user_blocks_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "user_blocks" DROP CONSTRAINT "user_blocks_blockerId_fkey";

-- DropTable
DROP TABLE "chat";

-- DropTable
DROP TABLE "comments";

-- DropTable
DROP TABLE "friendship";

-- DropTable
DROP TABLE "likes";

-- DropTable
DROP TABLE "meetings";

-- DropTable
DROP TABLE "message";

-- DropTable
DROP TABLE "mural";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "user_blocks";

-- DropTable
DROP TABLE "visitor";

-- CreateTable
CREATE TABLE "Meetings" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meetingId" TEXT,
    "userId" TEXT NOT NULL,
    "muralId" TEXT,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Likes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meetingId" TEXT,
    "author" TEXT NOT NULL,
    "muralId" TEXT,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mural" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Mural_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBlocks" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,

    CONSTRAINT "UserBlocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requesterId" TEXT NOT NULL,
    "addressedId" TEXT NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailConfirmationToken_key" ON "User"("emailConfirmationToken");

-- AddForeignKey
ALTER TABLE "Meetings" ADD CONSTRAINT "Meetings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_muralId_fkey" FOREIGN KEY ("muralId") REFERENCES "Mural"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_muralId_fkey" FOREIGN KEY ("muralId") REFERENCES "Mural"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mural" ADD CONSTRAINT "Mural_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlocks" ADD CONSTRAINT "UserBlocks_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlocks" ADD CONSTRAINT "UserBlocks_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_addressedId_fkey" FOREIGN KEY ("addressedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
