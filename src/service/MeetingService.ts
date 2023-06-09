import { IMeetingRepository } from "../repository/MeetingRepository";

export interface IMeetingService {
  createMeeting(data: {
    type: string;
    title: string;
    body: string;
    userId: string;
  }): Promise<any>;
}

export class MeetingService implements IMeetingService {
  constructor(private meetingRepository: IMeetingRepository) {}

  async createMeeting(data: {
    type: string;
    title: string;
    body: string;
    userId: string;
  }): Promise<any> {
    try {
      return await this.meetingRepository.createMeeting(data);
    } catch (error) {
      throw new Error(`Error creating meeting: ${error}`);
    }
  }
}
