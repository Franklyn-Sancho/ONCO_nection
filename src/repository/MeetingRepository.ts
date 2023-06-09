import { Meetings, PrismaClient } from "@prisma/client";

/* const prisma = new PrismaClient(); */

//interface repository meeting 
export interface IMeetingRepository {
  createMeeting(data: {
    type: string;
    title: string;
    body: string;
    userId: string;
  }): Promise <Meetings>
}

//MeetingRepository class implement interface 
export class MeetingRepository implements IMeetingRepository {
  private prisma: PrismaClient

  //instancia do Prisma Client no constructor 
  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  //função responsável por criar um novo meeting
  async createMeeting(data: {
    type: string, 
    title: string,
    body: string, 
    userId: string
  }) {

    try {
      return await this.prisma.meetings.create({
        data, //a estrutura do data está no parâmetro 
      })
    }
    catch (error) {
      throw new Error(`Error creating meeting: ${error}`)
    }
  }
}
