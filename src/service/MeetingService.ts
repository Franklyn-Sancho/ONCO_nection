import { CreateMeetingData, IMeetingRepository } from "../repository/MeetingRepository";

export interface IMeetingService {
  createMeeting(data: CreateMeetingData): Promise<any>;
  addLikeMeeting(meetingId: string, authorId: string): Promise<void>;
  removeLikeMeeting(id: string, userId: string): Promise<void>;
  addCommentMeeting(meetingId: string, userId: string, content: string): Promise<void>;
  removeCommentMeeting(id: string): Promise<void>;
}

export class MeetingService implements IMeetingService {
  constructor(private meetingRepository: IMeetingRepository) {}

  async createMeeting(data: CreateMeetingData): Promise<any> {
    return await this.meetingRepository.createMeeting(data);
  }
  //função da camada service para adicionar likes nas meetings
  async addLikeMeeting(meetingId: string, authorId: string) {
    const findMeeting = await this.meetingRepository.getMeetingById(
      meetingId
    );
    //se não, retorna um erro
    if (!findMeeting) {
      throw new Error("Nenhum meeting com esse id foi encontrado");
    }
    //se existir, o like é adicionado no meeting
    await this.meetingRepository.addLikeMeeting(meetingId, authorId);
  }

  async removeLikeMeeting(id: string, userId: string): Promise<void> {
    await this.meetingRepository.deleteLikeMeeting(id, userId);
  }

  async addCommentMeeting(meetingId: string, userId: string, content: string
  ): Promise<void> {
    await this.meetingRepository.addCommentMeeting(
      meetingId,
      userId,
      content
    );
  }

  async removeCommentMeeting(id: string): Promise<void> {
    await this.meetingRepository.deleteCommentMeeting(id);
  }
}
