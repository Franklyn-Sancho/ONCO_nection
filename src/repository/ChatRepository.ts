import { Chat, PrismaClient } from "@prisma/client";

export interface IChatRepository {
  createChat(initiatorId: string, participantId: string): Promise<Chat>;
  getChatById(id: string): Promise<Chat | null>;
  getChatByUsers(user1Id: string, user2Id: string): Promise<Chat | null>;
}

export class ChatRepository implements IChatRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createChat(initiatorId: string, participantId: string): Promise<Chat> {
    return this.prisma.chat.create({
      data: {
        initiatorId,
        participantId,
      },
    });
  }

  async getChatById(id: string): Promise<Chat | null> {
    return this.prisma.chat.findUnique({
      where: {
        id,
      },
      include: {
        messages: true,
      },
    });
  }

  async getChatByUsers(user1Id: string, user2Id: string): Promise<Chat | null> {
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
