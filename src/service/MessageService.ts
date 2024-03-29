import { Message } from "@prisma/client";
import { IMessageRepository } from "../repository/MessageRepository";
import * as socketIo from "socket.io";

export interface IMessageService {
  createMessage(
    content: string,
    senderId: string,
    recipientId: string,
    chatId: string
  ): Promise<Message>;
}

export interface IMessageService {
  createMessage(
    content: string,
    senderId: string,
    recipientId: string,
    chatId: string
  ): Promise<Message>;
}

export class MessageService implements IMessageService {
  private messageRepository: IMessageRepository;
  private io: socketIo.Server;

  constructor(messageRepository: IMessageRepository, io: socketIo.Server) {
    this.messageRepository = messageRepository;
    this.io = io;
  }

  async createMessage(
    content: string,
    senderId: string,
    recipientId: string,
    chatId: string
  ): Promise<Message> {
    const newMessage = this.messageRepository.createMessage(
      content,
      senderId,
      recipientId,
      chatId
    );

    this.io.emit('message', newMessage);

    return newMessage
  }
}
