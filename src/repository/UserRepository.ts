import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export interface UserName {
  name: string;
}

export default class UserRepository {
  async create(user: User): Promise<User> {
    return await prisma.user.create({
      data: user,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserByName(
    name: string,
    blockedUserIds: string[]
  ): Promise<UserName[] | null> {
    return await prisma.user.findMany({
      where: {
        name,
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
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async blockUser(blockerId: string, blockedId: string) {
    await prisma.userBlocks.create({
      data: {
        blockerId,
        blockedId,
      },
    });
  }
}
