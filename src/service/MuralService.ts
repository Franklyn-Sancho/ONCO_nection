import { Mural } from "@prisma/client";

import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { CreateMuralData } from "../types/muralTypes";
import { IMuralRepository } from "../repository/MuralRepository";

export interface IMuralService {
  createMural(data: CreateMuralData): Promise<Mural>;
  getMurals(userId: string): Promise<Mural[] | null>;
  updateMural(muralId: string, body: string, userId: string): Promise<Mural>;
  deleteMural(muralId: string, userId: string): Promise<Mural>;
}

export class MuralService implements IMuralService {
  constructor(private muralRepository: IMuralRepository) {}

  async createMural(data: CreateMuralData): Promise<Mural> {
    return await this.muralRepository.createMural(data);
  }

  async getMurals(userId: string): Promise<Mural[] | null> {
    return await this.muralRepository.getMuralsIfFriends(userId);
  }

  async updateMural(
    muralId: string,
    body: string,
    userId: string
  ): Promise<Mural> {
    const existingMural = await this.muralRepository.getMuralById(muralId);

    if (!existingMural) {
      throw new NotFoundError("No mural with this ID was found");
    }

    if (existingMural.userId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to update this mural"
      );
    }

    return await this.muralRepository.updateMural(muralId, body);
  }

  async deleteMural(muralId: string, userId: string): Promise<Mural> {
    const existingMural = await this.muralRepository.getMuralById(muralId);

    if (!existingMural) {
      throw new NotFoundError("No mural with this ID was found");
    }

    if (existingMural.userId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to delete this mural"
      );
    }

    return await this.muralRepository.deleteMural(muralId);
  }
}
