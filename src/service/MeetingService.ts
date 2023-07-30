import { IMeetingRepository } from "../repository/MeetingRepository";

export interface IMeetingService {
  createMeeting(data: {
    type: string;
    title: string;
    body: string;
    userId: string;
    image?: string | undefined;
  }): Promise<any>;
  addLikeMeeting(meetingId: string, authorId: string): Promise<void>;
  removeLikeMeeting(id: string, userId: string): Promise<void>;
  addCommentMeeting(
    meetingId: string,
    userId: string,
    content: string
  ): Promise<void>;
  removeCommentMeeting(id: string): Promise<void>;
}

export class MeetingService implements IMeetingService {
  constructor(private meetingRepository: IMeetingRepository) {}

  async createMeeting(data: {
    type: string;
    title: string;
    body: string;
    userId: string;
    string?: string | undefined;
  }): Promise<any> {
    try {
      return await this.meetingRepository.createMeeting(data);
    } catch (error) {
      throw new Error(`Error creating meeting: ${error}`);
    }
  }
  //função da camada service para adicionar likes nas meetings
  async addLikeMeeting(meetingId: string, authorId: string) {
    try {
      //verifica se o meeting existe no banco de dados
      const findMeeting = await this.meetingRepository.getMeetingById(
        meetingId
      );
      //se não, retorna um erro
      if (!findMeeting) {
        throw new Error("Nenhum meeting com esse id foi encontrado");
      }
      //se existir, o like é adicionado no meeting
      await this.meetingRepository.addLikeMeeting(meetingId, authorId);
    } catch (error) {
      throw new Error(`Error adding like to meeting ${error}`);
    }
  }

  async removeLikeMeeting(id: string, userId: string): Promise<void> {
    try {
      await this.meetingRepository.deleteLikeMeeting(id, userId);
    } catch (error) {
      throw new Error(`Error removing like to meeting ${error}`);
    }
  }

  async addCommentMeeting(
    meetingId: string,
    userId: string,
    content: string
  ): Promise<void> {
    try {
      await this.meetingRepository.addCommentMeeting(
        meetingId,
        userId,
        content
      );
    } catch (error) {
      throw new Error(`Error adding comment to meeting: ${error}`);
    }
  }

  async removeCommentMeeting(id: string): Promise<void> {
    try {
      await this.meetingRepository.deleteCommentMeeting(id);
    } catch (error) {
      throw new Error(`Error removing comment to meeting ${error}`);
    }
  }
}
