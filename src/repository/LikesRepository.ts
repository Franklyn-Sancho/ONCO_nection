import { Likes, PrismaClient } from "@prisma/client";

/**
 * Por este recurso fazer parte de dois sistemas diferentes, adicionei dois campos
 * opcionais para representar o id do meeting ou do mural, bastando apenas extender
 * sua estrutura para a classe requerida
 */

//interface de métodos da classe LikesRepository
export interface ILikeRepository {
  createLike(data: {
    meetingId?: string;
    muralId?: string;
    author: string;
  }): Promise<Likes>;
  getLikeById(id: string): Promise<Likes>;
  deleteLike(id: string): Promise<Likes>;
}

/**
 * a classe da camada de repositório do sistema de likes do sistema implementa a interface de métodos
 * a classe será extendida nas classes Meeting e Mural
 */
export class LikesRepository implements ILikeRepository {
  protected prisma: PrismaClient;

  //prisma instanciado
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  //implementação do método de criação de likes no banco de dados
  async createLike(data: {
    meetingId?: string | undefined;
    muralId?: string | undefined;
    author: string; //será o id do usuário autenticado
  }) {
    try {
      return await this.prisma.likes.create({
        data,
      });
    } catch (error) {
      throw new Error(`Error creating like: ${error}`);
    }
  }

  //immplementação do método que recupera do id do like requerido
  async getLikeById(id: string) {
    try {
      const like = await this.prisma.likes.findUnique({
        where: {
          id,
        },
      });
      if (!like) {
        throw new Error("Nenhum like encontrado");
      }

      return like;
    } catch (error) {
      throw new Error(`Erro ao retornar o like por id: ${error}`);
    }
  }

  //implementa o método de remoção de um like do usuário
  async deleteLike(id: string) {
    try {
      return await this.prisma.likes.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Erro ao deletar o like: ${error}`);
    }
  }
}
