import { Mural, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
