import { Mural } from "@prisma/client";
import { MuralRepository } from "../repository/MuralRepository";

//In this app everyone can create a wall to share their story


export class MuralService {
  private muralRepository: MuralRepository; //object instance muralRepository

  constructor() {
    this.muralRepository = new MuralRepository();
  }

  async create(mural: Mural): Promise<Mural> {
    //create a new mural by muralRepository.create
    const createMural = this.muralRepository.create(mural);

    return createMural;
  }

  //find a mural by id
  async find(mural: Mural): Promise<Mural | null> {
    return await this.muralRepository.findById(mural.id);
  }
}
