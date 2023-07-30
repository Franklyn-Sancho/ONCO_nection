import { Comments, PrismaClient } from "@prisma/client";

export interface CreateCommentData {
  content: string;
  meetingId?: string;
  muralId?: string;
  userId: string;
}

export interface ICommentRepository {
  createComment(data: CreateCommentData): Promise<Comments>;
  getCommentById(id: string): Promise<Comments>;
  deleteComment(id: string): Promise<Comments>;
}

export class CommentsRepository implements ICommentRepository {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createComment(data: CreateCommentData): Promise<Comments> {
    return await this.prisma.comments.create({
      data,
    });
  }

  async getCommentById(id: string) {
    const comment = await this.prisma.comments.findUnique({
      where: {
        id,
      },
    });
    if (!comment) {
      throw new Error("Nenhum comentário com esse id foi encontrado");
    }

    return comment;
  }

  async deleteComment(id: string) {
    return await this.prisma.comments.delete({
      where: { id },
    });
  }
}
