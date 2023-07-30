import { CreateLikeData, ILikeRepository } from "../repository/LikeRepository";

//interface de métodos da classe LikesService
export interface ILikeService {
  createLike(data: CreateLikeData): Promise<void>;
  deleteLike(id: string): Promise<void>;
}

//a classe da camada de serviços do sistema de likes implementa a interface de métodos
export class LikeService implements ILikeService {
  constructor(private likeRepository: ILikeRepository) {}

  async createLike(data: CreateLikeData): Promise<void> {
    await this.likeRepository.createLike(data);
  }

  async deleteLike(id: string): Promise<void> {
    await this.likeRepository.deleteLike(id);
  }
}
