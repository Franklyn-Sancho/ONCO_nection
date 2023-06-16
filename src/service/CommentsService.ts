import { ICommentRepository } from "../repository/CommentsRepository";

export interface ICommentService {
  addComment(data: {
    content: string;
    meetingId: string;
    muralId: string;
    userId: string;
  }): Promise<void>;
  deleteComment(id: string): Promise<void>;
}

export class CommentsService implements ICommentService {
  constructor(private commentsRepository: ICommentRepository) {}

  async addComment(data: {
    content: string;
    meetingId: string;
    muralId: string;
    userId: string;
  }): Promise<void> {
    try {
      await this.commentsRepository.createComment(data);
    } catch (error) {
      throw new Error(`Error adding comment: ${error}`);
    }
  }

  async deleteComment(id: string): Promise<void> {
    try {
      await this.commentsRepository.deleteComment(id);
    } catch (error) {
      throw new Error(`Error removind comment: ${error}`);
    }
  }
}
