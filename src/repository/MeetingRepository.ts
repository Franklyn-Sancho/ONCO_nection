import { Comments, Likes, Meetings, PrismaClient } from "@prisma/client";
import { LikesRepository } from "./LikesRepository";
import { CommentsRepository } from "./CommentsRepository";

//interface repository meeting
export interface IMeetingRepository {
  createMeeting(data: {
    type: string;
    title: string;
    body: string;
    userId: string;
  }): Promise<Meetings>;
  addLikeMeeting(meetingId: string, authorId: string): Promise<Likes>;
  deleteLikeMeeting(id: string): Promise<void>;
  addCommentMeeting(
    meetingId: string,
    userId: string,
    content: string
  ): Promise<Comments>;
  deleteCommentMeeting(id: string): Promise<void>;
}

//MeetingRepository class implement interface
export class MeetingRepository implements IMeetingRepository {
  private prisma: PrismaClient;
  private likesRepository: LikesRepository;
  private commentsRepository: CommentsRepository;

  //instancia do Prisma Client no constructor
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.likesRepository = new LikesRepository(prisma);
    this.commentsRepository = new CommentsRepository(prisma);
  }

  //função responsável por criar um novo meeting
  async createMeeting(data: {
    type: string;
    title: string;
    body: string;
    userId: string;
  }) {
    try {
      return await this.prisma.meetings.create({
        data, //a estrutura do data está no parâmetro
      });
    } catch (error) {
      throw new Error(`Error creating meeting: ${error}`);
    }
  }
  //função da camada repositório para adicionar likes nos meetings
  async addLikeMeeting(meetingId: string, authorId: string) {
    try {
      return await this.likesRepository.createLike({
        meetingId,
        author: authorId,
      });
    } catch (error) {
      throw new Error(`Error adding like to meeting ${error}`);
    }
  }

  async deleteLikeMeeting(id: string) {
    try {
      await this.likesRepository.deleteLike(id);
    } catch (error) {
      throw new Error(`Error removind like from meeting: ${error}`);
    }
  }

  async addCommentMeeting(meetingId: string, userId: string, content: string) {
    try {
      return await this.commentsRepository.createComment({
        meetingId,
        userId,
        content,
      });
    } catch (error) {
      throw new Error(`Error adding comments to meeting ${error}`);
    }
  }

  async deleteCommentMeeting(id: string): Promise<void> {
    try {
      await this.commentsRepository.deleteComment(id);
    } catch (error) {
      throw new Error(`Error removind comment from meeting: ${error}`);
    }
  }
}
