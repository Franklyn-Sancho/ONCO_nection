import { Comments } from "@prisma/client";
import { CreateCommentData, ICommentRepository } from "../repository/CommentsRepository";
import { NotFountError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";

export interface ICommentService {
  addComment(data: CreateCommentData): Promise<Comments>;
  deleteComment(id: string, userId: string): Promise<void>;
}

export class CommentsService implements ICommentService {
  constructor(private commentsRepository: ICommentRepository) {}

  async addComment(data: CreateCommentData): Promise<Comments> {
    const comment = await this.commentsRepository.createComment(data);

    return comment;
  }

  async deleteComment(id: string, userId: string): Promise<void> {

    const comment = await this.commentsRepository.getCommentById(id)

    if(!comment) {
      throw new NotFountError("Nenhum comentário com esse id foi encontrado")
    }

    if(comment.userId !== userId) {
      throw new ForbiddenError("Você não tem permissão para excluir esse comentário")
    }


    await this.commentsRepository.deleteComment(id);
  }
}
