import {Mural, PrismaClient } from "@prisma/client";

export interface CreateMuralData {
  body: string;
  userId: string;
  image?: string;
}


//interface repository mural
export interface IMuralRepository {
  createMural(data: CreateMuralData): Promise<Mural>;
  getMuralById(muralId: string): Promise<Mural>;
  getMuralsIfFriends(userId: string): Promise<Mural[]>;
  updateMural(muralId: string, body: string): Promise<Mural>
  deleteMural(muralId: string): Promise<Mural>;
}

//MeetingRepository class implement interface
export class MuralRepository implements IMuralRepository {
  private prisma: PrismaClient;

  //instancia do Prisma Client no constructor
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  //função responsável por criar um novo mural
  async createMural(data: CreateMuralData) {
    return await this.prisma.mural.create({
      data, //a estrutura do data está no parâmetro da função {body, userId}
    });
  }

  async getMuralById(muralId: string): Promise<Mural> {
    const mural = await this.prisma.mural.findUnique({
      where: {
        id: muralId
      },
    });

    if (!mural) {
      throw new Error("Nenhum meeting com esse Id foi encontrado");
    }

    return mural;
  }

  //repositório para retornar os murais entre amigos
  async getMuralsIfFriends(userId: string) {
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
          in: friendIds, //retorna os murais postados pelos amigos do requesterId
        },
      },
    });
  }

  async updateMural(muralId: string, body: string): Promise<Mural> {
    return await this.prisma.mural.update({
      where: {
        id: muralId
      },
      data: {
        body,
      }
    })
  }

  async deleteMural(muralId: string): Promise<Mural> {
      return await this.prisma.mural.delete({
        where: {
          id: muralId,
        }
      })
  }
}
