import { Likes, PrismaClient } from "@prisma/client";

/**
 * Por este recurso fazer parte de dois sistemas diferentes, adicionei dois campos
 * opcionais para representar o id do meeting ou do mural, bastando apenas extender
 * sua estrutura para a classe desejada.
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
 * A classe da camada de repositório do sistema de likes do sistema
 * implementa a interface de métodos ILikeRepository.
 * A classe será extendida em suas funcionalidades: mural e meeting.
 * Já que teremos duas extensões em ambas as funcionalidades,
 * está não poderá ser abstrata
 */
export class LikeRepository implements ILikeRepository {
  protected prisma: PrismaClient;

  //prisma instanciado no constructor
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  //implementação do método de criação de likes no banco de dados
  async createLike(data: {
    meetingId?: string | undefined;
    muralId?: string | undefined;
    author: string; //o autor do like será o id do usuário autenticado
  }) {
    try {
      return await this.prisma.likes.create({
        data, //recebe data [o parâmetro do método]
      });
    } catch (error) {
      throw new Error(`Erro no createLike do repositório: ${error}`);
    }
  }

  //implementação do método que recupera o id do like
  async getLikeById(id: string) {
    try {
      //faz a busca no banco de dados pelo id
      const like = await this.prisma.likes.findUnique({
        where: {
          id,
        },
      });
      console.log(like)
      if (!like) {
        throw new Error("Nenhum like com esse id foi encontrado");
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
