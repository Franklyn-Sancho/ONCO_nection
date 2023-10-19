import { Likes, PrismaClient } from "@prisma/client";

export interface CreateLikeData {
  meetingId?: string;
  muralId?: string;
  author: string;
}

//interface de métodos da classe LikesRepository
export interface ILikeRepository {
  createLike(data: CreateLikeData): Promise<Likes>;
  getLikeById(id: string): Promise<Likes | null>;
  deleteLike(id: string): Promise<Likes>;
  getLikeByUserAndContent(data: CreateLikeData): Promise<Likes | null>;
}

export class LikeRepository implements ILikeRepository {
  protected prisma: PrismaClient;

  //prisma instanciado no constructor
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  //implementação do método de criação de likes no banco de dados
  async createLike(data: CreateLikeData): Promise<Likes> {
    return await this.prisma.likes.create({
      data, //recebe data [o parâmetro do método]
    });
  }

  //implementação do método que recupera o id do like
  async getLikeById(id: string): Promise<Likes | null> {
    return await this.prisma.likes.findUnique({
      where: {
        id,
      },
    });
  }

  async getLikeByUserAndContent(data: CreateLikeData): Promise<Likes | null> {
    return await this.prisma.likes.findFirst({
      where: {
        author: data.author,
        muralId: data.muralId,
        meetingId: data.meetingId,
      },
    });
  }

  //implementa o método de remoção de um like do usuário
  async deleteLike(id: string): Promise<Likes> {
    return await this.prisma.likes.delete({
      where: { id },
    });
  }
}
