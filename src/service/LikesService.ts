import { FastifyReply, FastifyRequest } from "fastify";
import { ILikeRepository } from "../repository/LikesRepository";

//interface de métodos da classe LikesService
export interface ILikesService {
  createLike(data: {
    meetingId: string;
    muralId: string;
    author: string;
  }): Promise<void>;
  deleteLike(id: string, userId: string): Promise<void>;
}

//a classe da camada de serviços do sistema de likes implementa a interface de métodos
export class LikesService implements ILikesService {
  constructor(private likeRepository: ILikeRepository) {}

  async createLike(data: {
    meetingId: string;
    muralId: string;
    author: string;
  }): Promise<void> {
    try {
      await this.likeRepository.createLike(data);
    } catch (error) {
      throw new Error(`Error adding like: ${error}`);
    }
  }

  async deleteLike(id: string, userId: string): Promise<void> {
    try {
      /* const like = await this.likeRepository.getLikeById(id);
      if (like.author !== userId) {
        throw new Error("Você não tem permissão");
      } */

      await this.likeRepository.deleteLike(id);
    } catch (error) {
      throw new Error(`Error removing like: ${error}`);
    }
  }
}
