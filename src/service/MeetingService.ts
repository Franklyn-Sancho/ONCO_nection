import { IMeetingRepository } from "../repository/MeetingRepository";

export interface IMeetingService {
  createMeeting(data: {
    type: string;
    title: string;
    body: string;
    userId: string;
  }): Promise<any>;
  addLikeMeeting(meetingId: string, authorId: string): Promise<void>;
  removeLikeMeeting(id: string): Promise<void>;
  addComment(meetingId: string, userId: string, content: string): Promise<void>;
  removeCommentMeeting(id: string): Promise<void>;
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
  async addLikeMeeting(meetingId: string, userId: string) {
    try {
      await this.meetingRepository.addLikeMeeting(meetingId, userId);
    } catch (error) {
      throw new Error(`Error adding like to meeting ${error}`);
    }
  }

  async removeLikeMeeting(id: string): Promise<void> {
    try {
      await this.meetingRepository.deleteLikeMeeting(id);
    } catch (error) {
      throw new Error(`Error removind like to meeting ${error}`);
    }
  }

  async addComment(
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
