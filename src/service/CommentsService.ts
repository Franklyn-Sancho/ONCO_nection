import { Comments } from "@prisma/client";
import { ICommentRepository } from "../repository/CommentsRepository";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { CommentTypes } from "../types/commentTypes";

export interface ICommentService {
  addComment(data: CommentTypes): Promise<Comments>;
  deleteComment(id: string, userId: string): Promise<void>;
}

export class CommentsService implements ICommentService {
  constructor(private commentsRepository: ICommentRepository) {}

  async addComment(data: CommentTypes): Promise<Comments> {
    const comment = await this.commentsRepository.createComment(data);

    return comment;
  }

  async deleteComment(id: string, userId: string): Promise<void> {

    const comment = await this.commentsRepository.getCommentById(id);

    if (!comment) {
      throw new NotFoundError("No comments were found");
    }

    if (comment.userId !== userId) {
      throw new ForbiddenError(
        "You don't have permission to delete this comment"
      );
    }

    await this.commentsRepository.deleteComment(id);
  }
}
