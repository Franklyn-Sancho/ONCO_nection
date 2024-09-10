import { FastifyReply, FastifyRequest } from "fastify";
import { IMessageService } from "../service/MessageService";
import { UserParams } from "../types/usersTypes";
import { MessageTypes } from "../types/messageTypes";
import { Server as SocketIOServer } from 'socket.io';

export interface IMessageController {
  createMessage(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class MessageController implements IMessageController {
  private messageService: IMessageService;
  private io: SocketIOServer;

  constructor(messageService: IMessageService, io: SocketIOServer) {
    this.messageService = messageService;
    this.io = io;
  }

  async createMessage(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { content } = request.body as MessageTypes;
      const { chatId } = request.params as any;
      const { userId: senderId } = request.user as UserParams;

    
      const message = await this.messageService.createMessage(
        content,
        senderId,
        chatId
      );

      this.io.to(chatId).emit('message', {
        chatId,
        content,
        senderId,
        recipientId: message.recipientId
      });

      reply.send({
        message: "Message was sent successfully",
        chatId: message.chatId,
      });
    } catch (error) {
      if (error instanceof Error) {
        reply.code(500).send({
          message: `An error has occurred, try again later: ${error.message}`,
        });
      }
    }
  }
}




