import { Comments, Likes, Meetings, PrismaClient } from "@prisma/client";
import { LikeRepository } from "./LikeRepository";
import { CommentsRepository } from "./CommentsRepository";

//interface repository meeting
export interface IMeetingRepository {
  createMeeting(data: {
    type: string;
    title: string;
    body: string;
    userId: string;
  }): Promise<Meetings>;
  getMeetingById(meetingId: string): Promise<Meetings>;
  addLikeMeeting(meetingId: string, authorId: string): Promise<Likes>;
  deleteLikeMeeting(id: string, userId: string): Promise<void>;
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
  private likeRepository: LikeRepository;
  private commentRepository: CommentsRepository;

  //instancia do Prisma Client no constructor
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.likeRepository = new LikeRepository(prisma);
    this.commentRepository = new CommentsRepository(prisma);
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

  async getMeetingById(meetingId: string): Promise<Meetings> {
    try {
      const meeting = await this.prisma.meetings.findUnique({
        where: {
          id: meetingId,
        },
      });

      if (!meeting) {
        throw new Error("Nenhum meeting com esse Id foi encontrado");
      }

      return meeting;
    } catch (error) {
      throw new Error(`Ocorreu um erro ao retornar o meeting: ${error}`);
    }
  }

  //função da camada repositório para adicionar likes nos meetings
  async addLikeMeeting(meetingId: string, authorId: string) {
    try {
      return await this.likeRepository.createLike({
        meetingId,
        author: authorId,
      });
    } catch (error) {
      throw new Error(`Error adding like to meeting ${error}`);
    }
  }

  async deleteLikeMeeting(id: string, userId: string) {
    try {
      const like = await this.likeRepository.getLikeById(id);

      if (like.author !== userId) {
        throw new Error("Você não tem autorização para remover esse like");
      }
      console.log(like);

      await this.likeRepository.deleteLike(id);
    } catch (error) {
      throw new Error(`Error removing like from meeting: ${error}`);
    }
  }

  async addCommentMeeting(meetingId: string, userId: string, content: string) {
    try {
      return await this.commentRepository.createComment({
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
      await this.commentRepository.deleteComment(id);
    } catch (error) {
      throw new Error(`Error removind comment from meeting: ${error}`);
    }
  }
}
