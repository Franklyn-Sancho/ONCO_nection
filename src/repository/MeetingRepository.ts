import {Meetings, PrismaClient } from "@prisma/client";
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
}

//MeetingRepository class implement interface
export class MeetingRepository implements IMeetingRepository {
  private prisma: PrismaClient;
  private likeRepository: LikeRepository;
  private commentRepository: CommentsRepository;

  //instancia do Prisma Client no constructor
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.likeRepository = new LikeRepository(prisma)
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
}
