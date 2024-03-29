import { Meetings } from "@prisma/client";
import {
  IMeetingRepository,
  UpdateMeetingData,
} from "../repository/MeetingRepository";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { CreateMeetingData } from "../types/meetingTypes";

export interface IMeetingService {
  createMeeting(data: CreateMeetingData): Promise<Meetings>;
  updateMeeting(
    meetingId: string,
    data: UpdateMeetingData,
    userId: string
  ): Promise<Meetings>;
  deleteMeeting(meetingId: string, userId: string): Promise<Meetings>;
}

export class MeetingService implements IMeetingService {
  constructor(private meetingRepository: IMeetingRepository) {}

  async createMeeting(data: CreateMeetingData): Promise<Meetings> {
    return await this.meetingRepository.createMeeting(data);
  }

  async updateMeeting(
    meetingId: string,
    data: UpdateMeetingData,
    userId: string
  ): Promise<Meetings> {
    const existMeeting = await this.meetingRepository.getMeetingById(meetingId);

    if (!existMeeting) {
      throw new NotFoundError("no meeting with this ID was found");
    }

    if (existMeeting.userId !== userId) {
      throw new ForbiddenError("you do not have permission to update this meeting");
    }

    return await this.meetingRepository.updateMeeting(meetingId, data);
  }

  async deleteMeeting(meetingId: string, userId: string): Promise<Meetings> {
    const existMeeting = await this.meetingRepository.getMeetingById(meetingId);

    if (!existMeeting) {
      throw new NotFoundError("No meeting with this ID was found");
    }

    if (existMeeting.userId !== userId) {
      throw new ForbiddenError("You do not have permission to delete this content");
    }

    return await this.meetingRepository.deleteMeeting(meetingId);
  }
}
