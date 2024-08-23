import { Meetings, PrismaClient } from "@prisma/client";
import { CreateMeetingData } from "../types/meetingTypes";
import { processImage } from "../service/FileService";

export interface UpdateMeetingData {
  type?: string;
  title?: string;
  body?: string;
}

//interface repository meeting
export interface IMeetingRepository {
  createMeeting(data: CreateMeetingData): Promise<Meetings>;
  getMeetingById(meetingId: string): Promise<Meetings | null>;
  updateMeeting(meetingId: string, data: UpdateMeetingData): Promise<Meetings>;
  deleteMeeting(meetingId: string): Promise<Meetings>;
}

//MeetingRepository class implement interface
export class MeetingRepository implements IMeetingRepository {
  private prisma: PrismaClient;

  //instancia do Prisma Client no constructor
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  //função responsável por criar um novo meeting
  async createMeeting(data: CreateMeetingData): Promise<Meetings> {

    return await this.prisma.meetings.create({
      data: {
        ...data,
        image: processImage(data.image),
      },
    });
  }



  async getMeetingById(meetingId: string): Promise<Meetings | null> {
    return await this.prisma.meetings.findUnique({
      where: {
        id: meetingId,
      },
    });
  }

  async updateMeeting(
    meetingId: string,
    data: UpdateMeetingData
  ): Promise<Meetings> {
    return await this.prisma.meetings.update({
      where: {
        id: meetingId,
      },
      data: {
        type: data.type,
        title: data.title,
        body: data.body,
      },
    });
  }

  async deleteMeeting(meetingId: string): Promise<Meetings> {
    return await this.prisma.meetings.delete({
      where: {
        id: meetingId,
      },
    });
  }
}
