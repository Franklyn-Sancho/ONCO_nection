import { Comments, Likes, Mural } from "@prisma/client";

import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { CreateMuralData } from "../types/muralTypes";
import { IMuralRepository } from "../repository/MuralRepository";

export interface IMuralService {
  createMural(data: CreateMuralData): Promise<Mural>;
  getMuralByIdIfFriends(muralId: string, userId: string): Promise<Mural | null>;
  getMuralsIfFriends(userId: string): Promise<Mural[] | null>;
  getLikeByMural(muralId: string, author: string): Promise<Likes | null>;
  countLikesByMural(muralId: string, author: string): Promise<Number | null>;
  countCommentsByMural(muralId: string, userId: string): Promise<Number | null>;
  getCommentByMural(muralId: string): Promise<Comments[] | null>;
  updateMural(muralId: string, body: string, userId: string): Promise<Mural>;
  deleteMural(muralId: string, userId: string): Promise<Mural>;
}

export class MuralService implements IMuralService {
  constructor(private muralRepository: IMuralRepository) {}

  async createMural(data: CreateMuralData): Promise<Mural> {
    return await this.muralRepository.createMural(data);
  }

  async getMuralByIdIfFriends(
    muralId: string,
    userId: string
  ): Promise<Mural | null> {
    return await this.muralRepository.getMuralByIdIfFriends(muralId, userId);
  }

  async getMuralsIfFriends(userId: string): Promise<Mural[] | null> {
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

  async getCommentByMural(muralId: string): Promise<Comments[] | null> {
    return await this.muralRepository.getCommentByMural(muralId);
  }

  async getLikeByMural(muralId: string, author: string): Promise<Likes | null> {
    return await this.muralRepository.getLikeByMural(muralId, author);
  }

  async countLikesByMural(
    muralId: string,
    author: string
  ): Promise<Number | null> {
    return await this.muralRepository.countLikeByMural(muralId, author);
  }

  async countCommentsByMural(
    muralId: string,
    userId: string
  ): Promise<Number | null> {
    return await this.muralRepository.countCommentsByMural(muralId, userId);
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
