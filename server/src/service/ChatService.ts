import { Chat } from "@prisma/client";
import { BadRequestError } from "../errors/BadRequestError";
import { IChatRepository } from "../repository/ChatRepository";

export interface IChatService {
  createChat(initiatorId: string, participantId: string): Promise<Chat>;
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
      throw new BadRequestError("Já existe um chat entre esses usuários");
    }

    return this.chatRepository.createChat(initiatorId, participantId);
  }

  async getChatById(id: string): Promise<Chat | null> {
    return this.chatRepository.getChatById(id);
  }
}
