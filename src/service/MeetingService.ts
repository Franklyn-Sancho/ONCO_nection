import { PrismaClient} from "@prisma/client";
import { MeetingRepository } from "../repository/MeetingRepository";


/* const prisma = new PrismaClient();

interface Meeting {
  title: string;
  body: string;
  userId: string;
}

export class MeetingService {
  async create(meeting: Meeting) {
    await prisma.meetings.create({
      data: {
        title: meeting.title,
        body: meeting.body,
        userId: meeting.userId
      },
    });
  }
} */

export class MeetingService {
  async execute(meetingRepository: MeetingRepository): Promise<void> {
    console.log('Executando o método execute do MeetingService')
    return await meetingRepository.create();
  }
}
