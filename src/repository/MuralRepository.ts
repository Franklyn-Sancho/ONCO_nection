import { Mural, PrismaClient } from "@prisma/client";
import { CreateMuralData } from "../types/muralTypes";

export interface IMuralRepository {
  createMural(data: CreateMuralData): Promise<Mural>;
  getMuralById(muralId: string): Promise<Mural | null>;
  getMuralsIfFriends(userId: string): Promise<Mural[] | null>;
  updateMural(muralId: string, body: string): Promise<Mural>;
  deleteMural(muralId: string): Promise<Mural>;
}

export class MuralRepository implements IMuralRepository {
  private prisma: PrismaClient;

  //instancia do Prisma Client no constructor
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  //função responsável por criar um novo mural
  async createMural(data: CreateMuralData) {
    return await this.prisma.mural.create({
      data: {
        ...data,
        image: data.image?.toString(), 
      },
    });
  }

  async getMuralById(muralId: string): Promise<Mural | null> {
    return await this.prisma.mural.findUnique({
      where: {
        id: muralId,
      },
    });
  }

  async getMuralsIfFriends(userId: string): Promise<Mural[] | null> {
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
        id: muralId,
      },
      data: {
        body,
      },
    });
  }

  async deleteMural(muralId: string): Promise<Mural> {
    return await this.prisma.mural.delete({
      where: {
        id: muralId,
      },
    });
  }
}
