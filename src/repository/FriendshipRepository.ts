import { Friendship, PrismaClient, User } from "@prisma/client";

export type FriendshipStatus = "ACCEPTED" | "DENIED" | "BLOCKED";

//interface para descrever os métodos que o repositório deve implementar
export interface IFriendshipRepository {
  getFriendshipById(id: string): Promise<Friendship | null>;
  getFriendshipSolicitations(
    requesterId: string,
    addressedId: string
  ): Promise<Friendship | null>;
  createFriendship(
    requesterId: string,
    addressedId: string
  ): Promise<Friendship>;
  acceptFriendship(id: string, status: string): Promise<Friendship>;
  deleteFriendship(id: string): Promise<void>;
  listPendingFriendships(userId: string): Promise<Friendship[]>
  checkPendingFriendship(
    userId1: string,
    userId2: string
  ): Promise<Friendship | null>;
  getFriends(userId: string): Promise<User[] | null>;
}

//a classe de repositório implementa a interface com os métodos
export class FriendshipRepository implements IFriendshipRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async getFriendshipById(id: string): Promise<Friendship | null> {
    return this.prisma.friendship.findUnique({
      where: {
        id,
      },
    });
  }

  //implementa o método getFriendship para recuperar uma solicitação de amizade
  async getFriendshipSolicitations(
    requesterId: string,
    addressedId: string
  ): Promise<Friendship | null> {
    return this.prisma.friendship.findFirst({
      where: {
        requesterId,
        addressedId,
      },
    });
  }

  //implementa o método createFriendship para criar uma solicitação
  async createFriendship(requesterId: string, addressedId: string) {
    return this.prisma.friendship.create({
      data: {
        requesterId,
        addressedId,
        status: "PENDING",
      },
    });
  }

  async acceptFriendship(
    id: string,
    status: FriendshipStatus //valores do type FriendshipStatus
  ): Promise<Friendship> {
    //caso contrário, atualiza o banco de dados
    return await this.prisma.friendship.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  //implementa o método deleteFriendship para deletar uma amizade
  async deleteFriendship(id: string): Promise<void> {
    await this.prisma.friendship.delete({
      where: {
        id: id,
      },
    });
  }

  async listPendingFriendships(userId: string): Promise<Friendship[]> {
    return this.prisma.friendship.findMany({
      where: {
        AND: [
          { addressedId: userId },
          { status: "PENDING" },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            imageProfile: true
          }
        }
      }
    });
  }

  async checkPendingFriendship(
    userId1: string,
    userId2: string
  ): Promise<Friendship | null> {
    return this.prisma.friendship.findFirst({
      where: {
        OR: [
          {
            AND: [
              { requesterId: userId1 },
              { addressedId: userId2 },
              { status: "PENDING" },
            ],
          },
          {
            AND: [
              { requesterId: userId2 },
              { addressedId: userId1 },
              { status: "PENDING" },
            ],
          },
        ],
      },
    });
  }

  //implementa o método que retorna a lista de amizades;
  async getFriends(userId: string): Promise<User[] | null> {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addressedId: userId }],
        status: "ACCEPTED",
      },
      include: {
        requester: true,
        addressed: true,
      },
    });

    return friendships.map((friendship) =>
      friendship.requesterId === userId
        ? friendship.addressed
        : friendship.requester
    );
  }
}
