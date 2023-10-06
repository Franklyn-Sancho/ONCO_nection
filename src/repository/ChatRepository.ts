import { PrismaClient } from "@prisma/client";

export interface IChatRepository {
  createChat(initiatorId: string, participantId: string): any;
  getChat(id: string): any;
}

export class ChatRepository implements IChatRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createChat(initiatorId: string, participantId: string) {
    return this.prisma.chat.create({
      data: {
        initiatorId,
        participantId,
      },
    });
  }

  async getChat(id: string) {
    return this.prisma.chat.findUnique({
      where: {
        id,
      },
      include: {
        messages: true,
      }
    });
  }
}
