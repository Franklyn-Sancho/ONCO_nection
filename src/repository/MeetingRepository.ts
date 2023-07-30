import { Comments, Likes, Meetings, PrismaClient } from "@prisma/client";
import { LikeRepository } from "./LikeRepository";
import { CommentsRepository } from "./CommentsRepository";

export interface CreateMeetingData {
  type: string;
  title: string;
  body: string;
  userId: string;
  image?: string | undefined;
}

//interface repository meeting
export interface IMeetingRepository {
  createMeeting(data: CreateMeetingData): Promise<Meetings>;
  getMeetingById(meetingId: string): Promise<Meetings>;
  addLikeMeeting(meetingId: string, authorId: string): Promise<Likes>;
  deleteLikeMeeting(id: string, userId: string): Promise<void>;
  addCommentMeeting(meetingId: string, userId: string, content: string): Promise<Comments>;
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
  async createMeeting(data: CreateMeetingData) {
    return await this.prisma.meetings.create({
      data, //a estrutura do data está no parâmetro
    });
  }

  async getMeetingById(meetingId: string): Promise<Meetings> {
    const meeting = await this.prisma.meetings.findUnique({
      where: {
        id: meetingId,
      },
    });

    if (!meeting) {
      throw new Error("Nenhum meeting com esse Id foi encontrado");
    }

    return meeting;
  }

  //função da camada repositório para adicionar likes nos meetings
  async addLikeMeeting(meetingId: string, authorId: string) {
    return await this.likeRepository.createLike({
      meetingId,
      author: authorId,
    });
  }

  async deleteLikeMeeting(id: string, userId: string) {
    const like = await this.likeRepository.getLikeById(id);

      if (like.author !== userId) {
        throw new Error("Você não tem autorização para remover esse like");
      }
      console.log(like);

      await this.likeRepository.deleteLike(id);
  }

  async addCommentMeeting(meetingId: string, userId: string, content: string) {
    return await this.commentRepository.createComment({
      meetingId,
      userId,
      content,
    });
  }

  async deleteCommentMeeting(id: string): Promise<void> {
    await this.commentRepository.deleteComment(id);
  }
}
