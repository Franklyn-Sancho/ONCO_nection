import { IChatRepository } from "../repository/ChatRepository";

export interface IChatService {
  createChat(initiatorId: string, participantId: string): any;
  getChat(id: string): any;
}

export class ChatService implements IChatService {
  private chatRepository: IChatRepository;

  constructor(chatRepository: IChatRepository) {
    this.chatRepository = chatRepository;
  }

  async createChat(initiatorId: string, participantId: string) {
    return this.chatRepository.createChat(initiatorId, participantId);
  }

  async getChat(id: string) {
      return this.chatRepository.getChat(id);
  }
}
