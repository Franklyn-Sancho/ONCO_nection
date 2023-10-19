import { Comments, PrismaClient } from "@prisma/client";

export interface CreateCommentData {
  content: string;
  meetingId?: string;
  muralId?: string;
  userId: string;
}

export interface ICommentRepository {
  createComment(data: CreateCommentData): Promise<Comments>;
  getCommentById(id: string): Promise<Comments | null>;
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

  async getCommentById(id: string): Promise<Comments | null> {
    return await this.prisma.comments.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteComment(id: string): Promise<Comments> {
    return await this.prisma.comments.delete({
      where: { id },
    });
  }
}
