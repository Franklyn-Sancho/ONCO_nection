import { Comments, Likes, Mural } from "@prisma/client";
import { CreateMuralData, IMuralRepository } from "../repository/MuralRepository";

export interface IMuralService {
  createMural(data: CreateMuralData): Promise<any>;
  getMurals(userId: string): Promise<Mural[]>;
}

export class MuralService implements IMuralService {
  constructor(private muralRepository: IMuralRepository) {}

  async createMural(data: CreateMuralData): Promise<any> {
    return await this.muralRepository.createMural(data);
  }

  async getMurals(userId: string) {
    return await this.muralRepository.getMuralsIfFriends(userId);
  }
}
