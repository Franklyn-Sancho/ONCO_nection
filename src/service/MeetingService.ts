import { User } from "@prisma/client";
import { MeetingRepository } from "../repository/MeetingRepository";

/**
 * this resource is like a forum
 * the users can create a foruns for to talk, share.
 * The difference between the mural and the forum 
 * is that in the first one there are no comments, only sharing of ideas
 */

//class Meeting Service
export class MeetingService {
  private meetingRepository: MeetingRepository;

  constructor() {
    this.meetingRepository = new MeetingRepository();
  }

  async createMeeting(title: string, body: string, userId: string) {
    /* console.log("service function is working"); */
    return await this.meetingRepository.createMeeting(title, body, userId);
  }
}
