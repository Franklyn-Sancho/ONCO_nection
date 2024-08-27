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

  createMural(data: CreateMuralData): Promise<Mural> {
    return this.muralRepository.createMural(data);
  }
  
  getMuralByIdIfFriends(muralId: string, userId: string): Promise<Mural | null> {
    return this.muralRepository.getMuralByIdIfFriends(muralId, userId);
  }
  
  getMuralsIfFriends(userId: string): Promise<Mural[] | null> {
    return this.muralRepository.getMuralsIfFriends(userId);
  }
  
  getCommentByMural(muralId: string): Promise<Comments[] | null> {
    return this.muralRepository.getCommentByMural(muralId);
  }
  
  getLikeByMural(muralId: string, author: string): Promise<Likes | null> {
    return this.muralRepository.getLikeByMural(muralId, author);
  }
  
  countLikesByMural(muralId: string, author: string): Promise<Number | null> {
    return this.muralRepository.countLikeByMural(muralId, author);
  }
  
  countCommentsByMural(muralId: string, userId: string): Promise<Number | null> {
    return this.muralRepository.countCommentsByMural(muralId, userId);
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
      throw new ForbiddenError("You do not have permission to update this mural");
    }
  
    return this.muralRepository.updateMural(muralId, body);
  }
  
  async deleteMural(muralId: string, userId: string): Promise<Mural> {
    const existingMural = await this.muralRepository.getMuralById(muralId);
  
    if (!existingMural) {
      throw new NotFoundError("No mural with this ID was found");
    }
  
    if (existingMural.userId !== userId) {
      throw new ForbiddenError("You do not have permission to delete this mural");
    }
  
    return this.muralRepository.deleteMural(muralId);
  }
  
  
}
