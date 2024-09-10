import { Message } from "@prisma/client";
import { IMessageRepository } from "../repository/MessageRepository";
import { Server as SocketIOServer } from 'socket.io';
import { IChatService } from "./ChatService";

export interface IMessageService {
  createMessage(
    content: string,
    senderId: string,
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
  private chatService: IChatService; // Adiciona o serviço de chat

  constructor(messageRepository: IMessageRepository, chatService: IChatService) {
    this.messageRepository = messageRepository;
    this.chatService = chatService; // Inicializa o serviço de chat
  }

  async createMessage(
    content: string,
    senderId: string,
    chatId: string
  ): Promise<Message> {

     // Validação do conteúdo da mensagem
     if (!content || content.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }
    if (content.length > 1000) {
      throw new Error('Message content is too long');
    }

    // Verifica se o chat existe
    const chat = await this.chatService.getChatById(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    if (chat.initiatorId !== senderId && chat.participantId !== senderId) {
      throw new Error('User is not authorized to send messages in this chat');
    }

    // Determina o ID do destinatário
    const recipientId = chat.initiatorId === senderId ? chat.participantId : chat.initiatorId;

    // Cria e persiste a mensagem no banco de dados
    const newMessage = await this.messageRepository.createMessage(
      content,
      senderId,
      recipientId,
      chatId
    );

    return newMessage;
  }
}




