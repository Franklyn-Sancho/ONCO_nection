import { Meetings, PrismaClient } from "@prisma/client";

/* const prisma = new PrismaClient(); */

//interface repository meeting
export interface IMeetingRepository {
  createMeeting(data: {
    type: string;
    title: string;
    body: string;
    userId: string;
  }): Promise<Meetings>;
  addLike(meetingId: string, authorId: string): Promise<void>;
  addComment(meetingId: string, userId: string, content: string): Promise<void>
}

//MeetingRepository class implement interface
export class MeetingRepository implements IMeetingRepository {
  private prisma: PrismaClient;

  //instancia do Prisma Client no constructor
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
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
  async addLike(meetingId: string, userId: string) {
    try {
      await this.prisma.likes.create({
        data: {
          meetingsId: meetingId,
          author: userId,
        },
      });
    } catch (error) {
      throw new Error(`Erro ao adicionar like ${error}`);
    }
  }

  //função da camada repositório para adicionar comentários nas meetings
  async addComment(meetingId: string, authorId: string, content: string) {
      
    try {
      await this.prisma.comments.create({
        data: {
          meetingsId: meetingId,
          userId: authorId,
          content,
        }
      })
    }
    catch (error) {
      throw new Error(`Ocorreu um erro na camada de repositório: ${error}`,)
    }
  }
}
