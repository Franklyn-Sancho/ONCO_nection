import { CreateMeetingData, IMeetingRepository } from "../repository/MeetingRepository";

export interface IMeetingService {
  createMeeting(data: CreateMeetingData): Promise<any>;
}

export class MeetingService implements IMeetingService {
  constructor(private meetingRepository: IMeetingRepository) {}

  async createMeeting(data: CreateMeetingData): Promise<any> {
    return await this.meetingRepository.createMeeting(data);
  }
}
