import { IMeetingRepository } from "../repository/MeetingRepository";

export interface IMeetingService {
  createMeeting(data: {
    type: string;
    title: string;
    body: string;
    userId: string;
  }): Promise<any>;
  addLike(meetingId: string, authorId: string): Promise<void>;
  addComment(meetingId: string, authorId: string, content: string): Promise<void>
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
  //função da camada service para adicionar likes nas meetings
  async addLike(meetingId: string, userId: string) {
    try {
      await this.meetingRepository.addLike(meetingId, userId);
    } catch (error) {
      throw new Error(`Error adding like to meeting ${error}`);
    }
  }

  //função da camada service para adicionar comentários nas meetings
  async addComment(meetingId: string, authorId: string, content: string) {
      
    try {
      await this.meetingRepository.addComment(meetingId, authorId, content)
    }
    catch (error) {
      throw new Error(`Ocorreu um erro na camada de serviço: ${error}`)
    }
  }
}
