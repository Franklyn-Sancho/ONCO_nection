import { Mural } from "@prisma/client";
import { IMuralRepository } from "../repository/MuralRepository";


export interface IMuralService {
  createMural(data: {
    body: string;
    userId: string;
  }): Promise<any>;
  getMurals(userId: string): Promise<Mural[]>
}

export class MuralService implements IMuralService {
  constructor(private muralRepository: IMuralRepository) {}

  async createMural(data: {
    body: string;
    userId: string;
  }): Promise<any> {
    try {
      return await this.muralRepository.createMural(data);
    } catch (error) {
      throw new Error(`Error creating mural: ${error}`);
    }
  }
  
  async getMurals(userId: string) {
    return await this.muralRepository.getMurals(userId)
  }
}
