import { PrismaClient, User, UserBlocks } from "@prisma/client";
import { CreateUserData } from "../types/usersTypes";


export interface UserName {
  name: string;
}

export interface IUserRepository {
  create(user: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  findUserByName(name: string,  userId: string[]): Promise<UserName[] | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>
  blockUser(blockerId: string, blockedId: string): Promise<void>
  findUserBlockRecord(blockerId: string, blockedId: string): Promise<UserBlocks | null>
}

export default class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  //instancia do Prisma Client no constructor
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(user: CreateUserData): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...user,
        imageProfile: user.imageProfile?.toString(),
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findUserByName(
    name: string,
    blockedUserIds: string[]
  ): Promise<UserName[] | null> {
    return await this.prisma.user.findMany({
      where: {
        name: {
          contains: name
        },
        id: {
          notIn: blockedUserIds,
        },
      },
      select: {
        name: true,
      },
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async blockUser(blockerId: string, blockedId: string): Promise<void> {
    await this.prisma.userBlocks.create({
      data: {
        blockerId,
        blockedId,
      },
    });
  }

  async findUserBlockRecord(
    blockerId: string,
    blockedId: string
  ): Promise<UserBlocks | null> {
    return await this.prisma.userBlocks.findFirst({
      where: {
        blockerId,
        blockedId,
      },
    });
  }
}
