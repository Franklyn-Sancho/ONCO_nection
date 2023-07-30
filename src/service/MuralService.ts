import { Comments, Likes, Mural } from "@prisma/client";
import { IMuralRepository } from "../repository/MuralRepository";

export interface IMuralService {
  createMural(data: {
    body: string;
    userId: string;
    image?: string;
  }): Promise<any>;
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

  async createMural(data: {
    body: string;
    userId: string;
    image?: string;
  }): Promise<any> {
    try {
      return await this.muralRepository.createMural(data);
    } catch (error) {
      throw new Error(`Error creating mural: ${error}`);
    }
  }

  async getMurals(userId: string) {
    return await this.muralRepository.getMuralsIfFriends(userId);
  }

  async addLikeMural(muralId: string, authorId: string): Promise<Likes> {
    try {
      return await this.muralRepository.addLikeInMural(muralId, authorId);
    } catch (error) {
      throw new Error(`error adding like in MuralService: ${error}`);
    }
  }

  async removeLikeMural(id: string, userId: string): Promise<Likes> {
    try {
      return await this.muralRepository.removeLikeInMural(id, userId);
    } catch (error) {
      throw new Error(`error removing like in MuralService: ${error}`);
    }
  }

  async addCommentMural(
    muralId: string,
    userId: string,
    content: string
  ): Promise<Comments> {
    try {
      return await this.muralRepository.addCommentInMural(
        muralId,
        userId,
        content
      );
    } catch (error) {
      throw new Error(`Error add comment in muralService: ${error}`);
    }
  }

  async removeCommentMural(id: string, userId: string): Promise<Comments> {
    try {
      return await this.muralRepository.removeCommentInMural(id, userId);
    } catch (error) {
      throw new Error(`Error removing comment in MuralService: $error`);
    }
  }
}
