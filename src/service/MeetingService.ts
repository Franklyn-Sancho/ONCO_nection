import { User } from "@prisma/client";
import { MeetingRepository } from "../repository/MeetingRepository";

export class MeetingService {
  private meetingRepository: MeetingRepository;

  constructor() {
    this.meetingRepository = new MeetingRepository();
  }

  async createMeeting(title: string, body: string, userId: User) {
    console.log("service function is working");
    return await this.meetingRepository.createMeeting(title, body, userId);
  }
}
