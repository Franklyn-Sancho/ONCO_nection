import { PrismaClient } from "@prisma/client";

export interface IChatRepository {
  createChat(initiatorId: string, participantId: string): any;
  getChatById(id: string): any;
  getChatByUsers(user1Id: string, user2Id: string): any;
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

  async getChatById(id: string) {
    return this.prisma.chat.findUnique({
      where: {
        id,
      },
      include: {
        messages: true,
      },
    });
  }

  async getChatByUsers(user1Id: string, user2Id: string) {
    return this.prisma.chat.findFirst({
      where: {
        AND: [
          { OR: [{ initiatorId: user1Id }, { initiatorId: user2Id }] },
          { OR: [{ participantId: user1Id }, { participantId: user2Id }] },
        ],
      },
    });
  }
}
