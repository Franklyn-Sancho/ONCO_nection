import { Mural, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//class mural repository
export class MuralRepository {

  //repository layer create new mural
  async create(mural: Mural): Promise<Mural> {
    const createMural = await prisma.mural.create({
      data: mural,
    });

    return createMural;
  }

  //repository layer find mural by id
  async findById(id: string): Promise<Mural | null> {
    const dbMural = await prisma.mural.findUnique({
      where: {
        id,
      },
    });

    return dbMural;
  }
}
