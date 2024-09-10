import { Meetings } from "@prisma/client";
import {
  IMeetingRepository,
  UpdateMeetingData,
} from "../repository/MeetingRepository";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { CreateMeetingData } from "../types/meetingTypes";
import { IUserService } from "./UserService";

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
  constructor(private meetingRepository: IMeetingRepository, private userService: IUserService) {}

  async createMeeting(data: CreateMeetingData): Promise<Meetings> {
    const { type, title, body, userId, image } = data;

    // Verifica se o usuário tem e-mail confirmado
    const userInfo = await this.userService.findUserById(userId);

    if (!userInfo || !userInfo.emailConfirmed) {
      throw new Error("Only users with a confirmed email can create a meeting.");
    }

    // Cria o mural após a verificação
    return this.meetingRepository.createMeeting({
      type, title, body, userId, image
    });
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
