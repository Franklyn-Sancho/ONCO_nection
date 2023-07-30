import { CreateCommentData, ICommentRepository } from "../repository/CommentsRepository";

export interface ICommentService {
  addComment(data: CreateCommentData): Promise<void>;
  deleteComment(id: string): Promise<void>;
}

export class CommentsService implements ICommentService {
  constructor(private commentsRepository: ICommentRepository) {}

  async addComment(data: CreateCommentData): Promise<void> {
    await this.commentsRepository.createComment(data);
  }

  async deleteComment(id: string): Promise<void> {
    await this.commentsRepository.deleteComment(id);
  }
}
