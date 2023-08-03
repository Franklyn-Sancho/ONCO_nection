import { Meetings } from "@prisma/client";
import {
  CreateMeetingData,
  IMeetingRepository,
  UpdateMeetingData,
} from "../repository/MeetingRepository";

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
      throw new Error("Nenhum meeting com esse ID foi encontrado");
    }

    if (existMeeting.userId !== userId) {
      throw new Error("Você não tem permissão para excluir esse meeting");
    }

    return await this.meetingRepository.updateMeeting(meetingId, data);
  }

  async deleteMeeting(meetingId: string, userId: string): Promise<Meetings> {
    const existMeeting = await this.meetingRepository.getMeetingById(meetingId);

    if (!existMeeting) {
      throw new Error("Nenhum meeting com este ID foi encontrado");
    }

    if (existMeeting.userId !== userId) {
      throw new Error("Você não tem permissão para excluir esse conteúdo");
    }

    return await this.meetingRepository.deleteMeeting(meetingId);
  }
}
