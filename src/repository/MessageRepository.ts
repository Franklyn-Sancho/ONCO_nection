import { PrismaClient } from "@prisma/client";


export interface IMessageRepository {
  createMessage(
    content: string,
    senderId: string,
    recipientId: string,
    chatId: string
  ): any;
}

export class MessageRepository implements IMessageRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async createMessage(content: string, senderId: string, recipientId: string, chatId: string) {
        return this.prisma.message.create({
            data: {
                content,
                senderId,
                recipientId,
                chatId
            }
        })
    }
}