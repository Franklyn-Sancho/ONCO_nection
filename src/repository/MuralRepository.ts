import { Mural, PrismaClient } from "@prisma/client";

/* const prisma = new PrismaClient(); */

//Um mural será a publicação entre amigos na linha do tempo

//interface repository mural
export interface IMuralRepository {
  createMural(data: { body: string; userId: string }): Promise<Mural>;
  getMurals(userId: string): Promise<Mural[]>
}

//MeetingRepository class implement interface
export class MuralRepository implements IMuralRepository {
  private prisma: PrismaClient;

  //instancia do Prisma Client no constructor
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  //função responsável por criar um novo mural
  async createMural(data: { body: string; userId: string }) {
    try {
      return await this.prisma.mural.create({
        data, //a estrutura do data está no parâmetro da função
      });
    } catch (error) {
      throw new Error(`Error creating mural: ${error}`);
    }
  }

  //repositório para retornar os murais entre amigos
  async getMurals(userId: string) {
    const friends = await this.prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addressedId: userId }],
        status: "ACCEPTED",
      },
      select: {
        requesterId: true,
        addressedId: true,
      },
    });

    const friendIds = friends.map((friendship) =>
      friendship.requesterId === userId
        ? friendship.addressedId
        : friendship.requesterId
    );

    return this.prisma.mural.findMany({
      where: {
        userId: {
          in: friendIds,
        },
      },
    });
  }
}
