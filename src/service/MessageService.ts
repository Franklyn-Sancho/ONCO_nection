import { IMessageRepository } from "../repository/MessageRepository";

export interface IMessageService {
  createMessage(
    content: string,
    senderId: string,
    recipientId: string,
    chatId: string
  ): any;
}

export class MessageService implements IMessageService {
  private messageRepository: IMessageRepository;

  constructor(messageRepository: IMessageRepository) {
    this.messageRepository = messageRepository;
  }

  async createMessage(
    content: string,
    senderId: string,
    recipientId: string,
    chatId: string
  ) {
    return this.messageRepository.createMessage(
      content,
      senderId,
      recipientId,
      chatId
    );
  }
}
