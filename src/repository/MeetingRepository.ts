import { Meetings, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//class meeting repository
export class MeetingRepository {

  //repository layer create a new meeting
  async createMeeting(title: string, body: string, userId: string) {
    const findUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    try {
      if (!findUser) {
        throw new Error("Usuário não encontrado");
      }

      return await prisma.meetings.create({
        data: {
          title,
          body,
          userId: findUser.id,
        },
      });
    } catch (err) {
      throw new Error(`Ocorre um erro no repositório ${err}`);
    }
  }
}
