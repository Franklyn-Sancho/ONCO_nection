import { Likes } from "@prisma/client";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { ILikeRepository } from "../repository/LikeRepository";
import { LikesTypes } from "../types/likesTypes";

//interface de métodos da classe LikesService
export interface ILikeService {
  createLike(data: LikesTypes): Promise<Likes>;
  deleteLike(id: string, userId: string): Promise<void>;
}

//a classe da camada de serviços do sistema de likes implementa a interface de métodos
export class LikeService implements ILikeService {
  constructor(private likeRepository: ILikeRepository) {}

  async createLike(data: LikesTypes): Promise<Likes> {
    const existingLike = await this.likeRepository.getLikeByUserAndContent(
      data
    );

    if (existingLike) {
      throw new Error("You already have a like on this content");
    }

    return await this.likeRepository.createLike(data);
  }

  async deleteLike(id: string, userId: string): Promise<void> {
    const like = await this.likeRepository.getLikeById(id);

    if (!like) {
      throw new NotFoundError("Like not found");
    }

    if (like.author !== userId) {
      throw new ForbiddenError("you do not have permission to delete this like");
    }

    await this.likeRepository.deleteLike(id);
  }
}
