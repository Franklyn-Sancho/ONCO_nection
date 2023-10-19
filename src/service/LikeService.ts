import { Likes } from "@prisma/client";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { CreateLikeData, ILikeRepository } from "../repository/LikeRepository";

//interface de métodos da classe LikesService
export interface ILikeService {
  createLike(data: CreateLikeData): Promise<Likes>;
  deleteLike(id: string, userId: string): Promise<void>;
}

//a classe da camada de serviços do sistema de likes implementa a interface de métodos
export class LikeService implements ILikeService {
  constructor(private likeRepository: ILikeRepository) {}

  async createLike(data: CreateLikeData): Promise<Likes> {
    const existingLike = await this.likeRepository.getLikeByUserAndContent(
      data
    );

    if (existingLike) {
      throw new Error("Você já deu like nesse conteúdo");
    }

    return await this.likeRepository.createLike(data);
  }

  async deleteLike(id: string, userId: string): Promise<void> {
    const like = await this.likeRepository.getLikeById(id);

    if (!like) {
      throw new NotFoundError("Like não encontrado");
    }

    if (like.author !== userId) {
      throw new ForbiddenError("Você não tem permissão para excluir este like");
    }

    await this.likeRepository.deleteLike(id);
  }
}
