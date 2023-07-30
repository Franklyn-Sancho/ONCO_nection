import { Friendship, PrismaClient, User } from "@prisma/client";

//Friendship system repository

export type FriendshipStatus = "ACCEPTED" | "DENIED";

//interface para descrever os métodos que o repositório deve implementar
export interface IFriendshipRepository {
  getFriendship(requesterId: string, addressedId: string): Promise<Friendship | null>;
  createFriendship(requesterId: string, addressedId: string): Promise<Friendship>;
  acceptFriendship(requesterId: string, addressedId: string, status: string): Promise<void>;
  deleteFriendship(requesterId: string, addressedId: string): Promise<void>;
  getFriends(userId: string): Promise<User[]>;
}

//a classe de repositório implementa a interface com os métodos
export class FriendshipRepository implements IFriendshipRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  //implementa o método getFriendship para recuperar uma solicitação de amizade
  async getFriendship(requesterId: string, addressedId: string) {
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
    requesterId: string,
    addressedId: string,
    status: FriendshipStatus //valores do type FriendshipStatus
  ): Promise<void> {
    const existingFriendship = await this.getFriendship(
      requesterId,
      addressedId
    );
    //estrutura para testar se a solicitação já foi aceita, se sim, retorna erro
    if (existingFriendship && existingFriendship.status === "ACCEPTED") {
      throw new Error("A solicitação de amizade já foi aceita");
    }
    //caso contrário, atualiza o banco de dados
    await this.prisma.friendship.updateMany({
      where: {
        requesterId,
        addressedId,
      },
      data: {
        status,
      },
    });
  }

  //implementa o método deleteFriendship para deletar uma amizade
  async deleteFriendship(
    requesterId: string,
    addressedId: string
  ): Promise<void> {
    await this.prisma.friendship.deleteMany({
      where: {
        OR: [
          { requesterId, addressedId },
          { requesterId: addressedId, addressedId: requesterId },
        ],
        status: "ACCEPTED",
      },
    });
  }

  //implementa o método que retorna a lista de amizades;
  async getFriends(userId: string) {
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
