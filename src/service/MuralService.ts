import { Mural } from "@prisma/client";
import { MuralRepository } from "../repository/MuralRepository";

export class MuralService {
  private muralRepository: MuralRepository;

  constructor() {
    this.muralRepository = new MuralRepository();
  }

  async create(mural: Mural): Promise<Mural> {
    const createMural = this.muralRepository.create(mural);

    return createMural;
  }

  async find(mural: Mural): Promise<Mural | null> {
    return await this.muralRepository.findById(mural.id);
  }
}
