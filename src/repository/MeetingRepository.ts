import { Meetings, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export class MeetingRepository {
  async createMeeting(title: string, body: string, userId: User): Promise<Meetings> {
    console.log(`este é o ${userId} do repositório`);

    try {
      return await prisma.meetings.create({
        data: {
          title,
          body,
          userId: userId.id
        },
      });
    } catch (err) {
      throw new Error(`Ocorre um erro no repositório ${err}`);
    }
  }
}
