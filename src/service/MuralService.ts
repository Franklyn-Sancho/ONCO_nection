import { Comments, Likes, Mural } from "@prisma/client";
import { CreateMuralData, IMuralRepository } from "../repository/MuralRepository";

export interface IMuralService {
  createMural(data: CreateMuralData): Promise<any>;
  getMurals(userId: string): Promise<Mural[]>;
  addLikeMural(muralId: string, authorId: string): Promise<Likes>;
  removeLikeMural(id: string, userId: string): Promise<Likes>;
  addCommentMural(
    muralId: string,
    userId: string,
    content: string
  ): Promise<Comments>;
  removeCommentMural(id: string, userId: string): Promise<Comments>;
}

export class MuralService implements IMuralService {
  constructor(private muralRepository: IMuralRepository) {}

  async createMural(data: CreateMuralData): Promise<any> {
    return await this.muralRepository.createMural(data);
  }

  async getMurals(userId: string) {
    return await this.muralRepository.getMuralsIfFriends(userId);
  }

  async addLikeMural(muralId: string, authorId: string): Promise<Likes> {
    return await this.muralRepository.addLikeInMural(muralId, authorId);
  }

  async removeLikeMural(id: string, userId: string): Promise<Likes> {
    return await this.muralRepository.removeLikeInMural(id, userId);
  }

  async addCommentMural(muralId: string, userId: string, content: string
  ): Promise<Comments> {
    return await this.muralRepository.addCommentInMural(
      muralId,
      userId,
      content
    );
  }

  async removeCommentMural(id: string, userId: string): Promise<Comments> {
    return await this.muralRepository.removeCommentInMural(id, userId);
  }
}
