import { Mural, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IMural {
  id: boolean;
  title: string;
  body: string;
  createdAt: boolean;
}

export class MuralRepository {
  async create(mural: Mural): Promise<Mural> {
    const createMural = await prisma.mural.create({
      data: mural,
    });

    return createMural;
  }

  async findById(id: string): Promise<Mural | null> {
    const dbMural = await prisma.mural.findUnique({
      where: {
        id,
      },
    });

    return dbMural;
  }
}
