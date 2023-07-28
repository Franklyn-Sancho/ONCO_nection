import { ILikeRepository } from "../repository/LikeRepository";

//interface de métodos da classe LikesService
export interface ILikeService {
  createLike(data: {
    meetingId: string;
    muralId: string;
    author: string;
  }): Promise<void>;
  deleteLike(id: string): Promise<void>;
}

//a classe da camada de serviços do sistema de likes implementa a interface de métodos
export class LikeService implements ILikeService {
  constructor(private likeRepository: ILikeRepository) {}

  async createLike(data: {
    meetingId: string;
    muralId: string;
    author: string;
  }): Promise<void> {
    try {
      await this.likeRepository.createLike(data);
    } catch (error) {
      throw new Error(`Error adding like in likeService: ${error}`);
    }
  }

  async deleteLike(id: string): Promise<void> {
    try {
      await this.likeRepository.deleteLike(id);
    } catch (error) {
      throw new Error(`Error removing like in likeService: ${error}`);
    }
  }
}
