import { Mural } from "@prisma/client";

import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { CreateMuralData } from "../types/muralTypes";
import { IMuralRepository } from "../repository/MuralRepository";
import { getBlockedUsers } from "../utils/getBlockedUsers";

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

    /* const onlyNonBlockingUsers = await getBlockedUsers(userId); */

    return await this.muralRepository.getMuralsIfFriends(userId);
  }

  async updateMural(
    muralId: string,
    body: string,
    userId: string
  ): Promise<Mural> {
    const existingMural = await this.muralRepository.getMuralById(muralId);

    if (!existingMural) {
      throw new NotFoundError("Nenhum mural com este ID foi encontrado");
    }

    if (existingMural.userId !== userId) {
      throw new ForbiddenError(
        "Você não tem permissão para atualizar este mural"
      );
    }

    return await this.muralRepository.updateMural(muralId, body);
  }

  async deleteMural(muralId: string, userId: string): Promise<Mural> {
    const existingMural = await this.muralRepository.getMuralById(muralId);

    if (!existingMural) {
      throw new NotFoundError("Nenhum mural com este ID foi encontrado");
    }

    if (existingMural.userId !== userId) {
      throw new ForbiddenError(
        "Você não tem permissão para excluir este mural"
      );
    }

    return await this.muralRepository.deleteMural(muralId);
  }
}