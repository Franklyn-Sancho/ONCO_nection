import { Comments, Likes, Mural, PrismaClient } from "@prisma/client";
import { CreateMuralData } from "../types/muralTypes";

export interface IMuralRepository {
  createMural(data: CreateMuralData): Promise<Mural>;
  getMuralById(muralId: string): Promise<Mural | null>;
  getMuralByIdIfFriends(muralId: string, userId: string): Promise<Mural | null>;
  getLikeByMural(muralId: string, userId: string): Promise<Likes | null>;
  countLikeByMural(muralId: string, author: string): Promise<Number | null>
  countCommentsByMural(muralId: string, userId: string): Promise<Number | null>
  getCommentByMural(muralId: string): Promise<Comments[] | null>
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
    return await this.prisma.mural.findFirst({
      where: {
        id: muralId,
      },
    });
  }

  async getMuralByIdIfFriends(
    muralId: string,
    userId: string
  ): Promise<Mural | null> {
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

    return await this.prisma.mural.findFirst({
      where: {
        id: muralId,
        userId: {
          in: friendIds,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            imageProfile: true,
            name: true,
          },
        },
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
      include: {
        author: {
          select: {
            id: true,
            name: true,
            imageProfile: true,
          },
        },
      },
    });
  }

  async getLikeByMural(muralId: string, author: string) {
    return await this.prisma.likes.findFirst({
      where: {
        muralId,
        author,
      },
    });
  }

  async countLikeByMural(muralId: string, author: string) {
    return await this.prisma.likes.count({
      where: {
        muralId,
        author,
      }
    })
  }

  async countCommentsByMural(muralId: string, userId: string) {
    return await this.prisma.comments.count({
      where: {
        muralId,
        userId,
      }
    })
  }

  async getCommentByMural(muralId: string) {
    return await this.prisma.comments.findMany({
      where: {
        muralId
      },
      include: {
        author: {
          select: {
            name: true,
            imageProfile: true,
          },
        },
      },
    })
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
