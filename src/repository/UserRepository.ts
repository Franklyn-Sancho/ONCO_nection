import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

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

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }
}
