import { Authentication, PrismaClient, User, UserBlocks } from "@prisma/client";
import { processImage } from "../service/FileService";
import { FindUserByIdParams, FindUserByNameParams, UserBodyData, UserProfile } from "../types/usersTypes";
import bcrypt from "bcryptjs";


export interface IUserRepository {
  createUserDatabase(user: UserBodyData): Promise<User>;
  registerUserWithEmail(user: UserBodyData, password: string): Promise<User>;
  findAuthenticationByUserIdAndProvider(userId: string, provider: string): Promise<Authentication | null>
  findByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<FindUserByIdParams | null>;
  findUserByName(name: string, blockedUserIds: string[]): Promise<FindUserByNameParams[] | null>;
  findProfileUser(name: string, blockedUserIds: string[]): Promise<UserProfile[] | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  blockUser(blockerId: string, blockedId: string): Promise<void>;
  findUserBlockRecord(blockerId: string, blockedId: string): Promise<UserBlocks | null>;
}


export default class UserRepository implements IUserRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createUserDatabase(user: UserBodyData): Promise<User> {
    const processedImage = processImage(user.imageProfile);

    return this.prisma.user.create({
      data: {
        ...user,
        imageProfile: processedImage,
      },
    });
  }

  async registerUserWithEmail(user: UserBodyData, hashedPassword: string): Promise<User> {
    const processedImage = processImage(user.imageProfile);
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        imageProfile: processedImage,
      },
    });

    await this.prisma.authentication.create({
      data: {
        userId: newUser.id,
        provider: 'email',
        password: hashedPassword,
      },
    });

    return newUser;
}


  async findAuthenticationByUserIdAndProvider(userId: string, provider: string): Promise<Authentication | null> {
    return this.prisma.authentication.findFirst({
      where: { userId, provider },
    });
  }
  

  findProfileUser(name: string, blockedUserIds: string[]): Promise<UserProfile[] | null> {
    return this.prisma.user.findMany({
      where: {
        name: { contains: name },
        id: { notIn: blockedUserIds },
      },
      select: {
        name: true,
        description: true,
        imageProfile: true,
      },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findUserById(id: string): Promise<FindUserByIdParams | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findUserByName(name: string, blockedUserIds: string[]): Promise<FindUserByNameParams[] | null> {
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