import { Likes } from "@prisma/client";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { ILikeRepository } from "../repository/LikeRepository";
import { LikesTypes } from "../types/likesTypes";
import { IUserService } from "./UserService";

//interface de métodos da classe LikesService
export interface ILikeService {
  createLike(data: LikesTypes): Promise<any>;
  deleteLike(id: string, userId: string): Promise<void>;
}

//a classe da camada de serviços do sistema de likes implementa a interface de métodos
export class LikeService implements ILikeService {
  constructor(private likeRepository: ILikeRepository, private userService: IUserService) {}

  async createLike(data: LikesTypes): Promise<Likes | null> {
    const {author} = data

   const user = await this.userService.findUserById(author)

    if(!user || !user.emailConfirmed) {
      throw new Error("Only users with a confirmed email can like a content");
    }

    const existingLike = await this.likeRepository.getLikeByUserAndContent(data);

    if (existingLike) {
        await this.likeRepository.deleteLike(existingLike.id);
        return null; // Retorne null ou algum outro valor para indicar que um like foi removido
    } else {
        return await this.likeRepository.createLike(data);
    }
}

  async deleteLike(id: string, userId: string): Promise<void> {
    const like = await this.likeRepository.getLikeById(id);

    if (!like) {
      throw new NotFoundError("Like not found");
    }

    if (like.author !== userId) {
      throw new ForbiddenError(
        "you do not have permission to delete this like"
      );
    }

    await this.likeRepository.deleteLike(id);
  }
}
