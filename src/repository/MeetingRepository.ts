import { Meetings, PrismaClient, User } from "@prisma/client";



export default class MeetingRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(meetings: Meetings) {
    const createdMeeting = await this.prisma.meetings.create({
      data: meetings /* {
        type: meetings.type,
        title: meetings.title,
        body: meetings.body,
        createdAt: meetings.createdAt,
        userId: ''
      }, */
    });

    return createdMeeting;
  }

  async findById(id: string) {
    return await this.prisma.meetings.findUnique({
      where: {
        id,
      },
    });
  }
}
