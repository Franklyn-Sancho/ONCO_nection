import { Comments, PrismaClient } from "@prisma/client";

export interface ICommentRepository {
  createComment(data: {
    content: string;
    meetingId?: string;
    muralId?: string;
    userId: string;
  }): Promise<Comments>;
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
