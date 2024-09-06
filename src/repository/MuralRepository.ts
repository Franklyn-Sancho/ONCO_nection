import { Comments, Likes, Mural, PrismaClient } from "@prisma/client";
import { CreateMuralData } from "../types/muralTypes";
import { processImage } from "../infrastructure/fileService";

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
  createMural(data: CreateMuralData) {
    return this.prisma.mural.create({
      data: {
        ...data,
        image: processImage(data.image),
      },
    });
  }

  getMuralById(muralId: string): Promise<Mural | null> {
    return this.prisma.mural.findFirst({
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

    return this.prisma.mural.findFirst({
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
          in: friendIds,
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

  getLikeByMural(muralId: string, author: string) {
    return this.prisma.likes.findFirst({
      where: {
        muralId,
        author,
      },
    });
  }

  countLikeByMural(muralId: string, author: string) {
    return this.prisma.likes.count({
      where: {
        muralId,
        author,
      },
    });
  }

  countCommentsByMural(muralId: string, userId: string) {
    return this.prisma.comments.count({
      where: {
        muralId,
        userId,
      },
    });
  }

  getCommentByMural(muralId: string) {
    return this.prisma.comments.findMany({
      where: {
        muralId,
      },
      include: {
        author: {
          select: {
            name: true,
            imageProfile: true,
          },
        },
      },
    });
  }

  updateMural(muralId: string, body: string): Promise<Mural> {
    return this.prisma.mural.update({
      where: {
        id: muralId,
      },
      data: {
        body,
      },
    });
  }

  deleteMural(muralId: string): Promise<Mural> {
    return this.prisma.mural.delete({
      where: {
        id: muralId,
      },
    });
  }
}
