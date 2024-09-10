import { Chat } from "@prisma/client";
import { BadRequestError } from "../errors/BadRequestError";
import { IChatRepository } from "../repository/ChatRepository";

export interface IChatService {
  createChat(initiatorId: string, participantId: string): Promise<Chat>;
  getChatsByUserId(userId: string): Promise<Chat[] | null>
  getChatById(id: string): Promise<Chat | null>;
}

export class ChatService implements IChatService {
  private chatRepository: IChatRepository;

  constructor(chatRepository: IChatRepository) {
    this.chatRepository = chatRepository;
  }

  async createChat(initiatorId: string, participantId: string): Promise<Chat> {
    const existingChat = await this.chatRepository.getChatByUsers(
      initiatorId,
      participantId
    );

    if (existingChat) {
      throw new BadRequestError("There is already a chat between these users");
    }

    return this.chatRepository.createChat(initiatorId, participantId);
  }

  async getChatsByUserId(userId: string): Promise<Chat[] | null> {
    return this.chatRepository.getChatsByUserId(userId)
  }



  async getChatById(id: string): Promise<Chat | null> {
    return this.chatRepository.getChatById(id);
  }
}
