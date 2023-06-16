import { Comments, PrismaClient } from "@prisma/client";

export interface ICommentRepository {
  createComment(data: {
    content: string;
    meetingId?: string;
    muralId?: string;
    userId: string;
  }): Promise<Comments>;
  getCommentById(id: string): Promise<Comments>
  deleteComment(id: string): Promise<Comments>;
}

export class CommentsRepository implements ICommentRepository {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createComment(data: {
    content: string;
    meetingId?: string | undefined;
    muralId?: string | undefined;
    userId: string;
  }): Promise<Comments> {
    try {
      return await this.prisma.comments.create({
        data,
      });
    } catch (error) {
      throw new Error(`Error creating comment: ${error}`);
    }
  }

  async getCommentById(id: string) {
    try {
      //faz a busca no banco de dados pelo id
      const like = await this.prisma.comments.findUnique({
        where: {
          id,
        },
      });
      console.log(like)
      if (!like) {
        throw new Error("Nenhum comentário com esse id foi encontrado");
      }

      return like;
    } catch (error) {
      throw new Error(`Erro ao retornar o comentário por id: ${error}`);
    }
  }

  async deleteComment(id: string) {
    try {
      return await this.prisma.comments.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Error deleting comment: ${error}`);
    }
  }
}
