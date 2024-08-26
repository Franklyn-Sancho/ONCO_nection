import { PrismaClient, User, UserBlocks } from "@prisma/client";
import { processImage } from "../service/FileService";
import { UserBodyData } from "../types/usersTypes";


export interface UserProfile {
  name: string;
}

export interface IUserRepository {
  create(user: UserBodyData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<UserProfile | null>;
  findUserByName(name: string, blockedUserIds: string[]): Promise<UserProfile[] | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  blockUser(blockerId: string, blockedId: string): Promise<void>;
  findUserBlockRecord(blockerId: string, blockedId: string): Promise<UserBlocks | null>;
}

export default class UserRepository implements IUserRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(user: UserBodyData): Promise<User> {
    const processedImage = processImage(user.imageProfile);

    return this.prisma.user.create({
      data: {
        ...user,
        imageProfile: processedImage,
      },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findUserById(id: string): Promise<UserProfile | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
      },
    });
  }
  
  
  findUserByName(name: string, blockedUserIds: string[]): Promise<UserProfile[] | null> {
    return this.prisma.user.findMany({
      where: {
        name: { contains: name },
        id: { notIn: blockedUserIds },
      },
      select: {
        name: true,
      },
    });
  }
  

  updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
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

  findUserBlockRecord(blockerId: string, blockedId: string): Promise<UserBlocks | null> {
    return this.prisma.userBlocks.findFirst({
      where: { blockerId, blockedId },
    });
  }
}

