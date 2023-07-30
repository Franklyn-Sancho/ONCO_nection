import { Likes, PrismaClient } from "@prisma/client";

export interface CreateLikeData {
  meetingId?: string;
  muralId?: string;
  author: string;
}

//interface de métodos da classe LikesRepository
export interface ILikeRepository {
  createLike(data: CreateLikeData): Promise<Likes>;
  getLikeById(id: string): Promise<Likes>;
  deleteLike(id: string): Promise<Likes>;
}

export class LikeRepository implements ILikeRepository {
  protected prisma: PrismaClient;

  //prisma instanciado no constructor
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  //implementação do método de criação de likes no banco de dados
  async createLike(data: CreateLikeData) {
    return await this.prisma.likes.create({
      data, //recebe data [o parâmetro do método]
    });
  }

  //implementação do método que recupera o id do like
  async getLikeById(id: string) {
    const like = await this.prisma.likes.findUnique({
      where: {
        id,
      },
    });
    console.log(like);
    if (!like) {
      throw new Error("Nenhum like com esse id foi encontrado");
    }

    return like;
  }

  //implementa o método de remoção de um like do usuário
  async deleteLike(id: string) {
    return await this.prisma.likes.delete({
      where: { id },
    });
  }
}
