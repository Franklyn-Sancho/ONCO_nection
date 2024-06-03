import { FastifyReply, FastifyRequest } from "fastify";
import { IMessageService } from "../service/MessageService";
import { UserParams } from "../types/usersTypes";
import { ChatParams, ChatTypes } from "../types/chatTypes";
import { MessageParams, MessageTypes } from "../types/messageTypes";

type ChatAndMessageParams = ChatParams & MessageParams;

export interface IMessageController {
  createMessage(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class MessageController implements IMessageController {
  private messageService: IMessageService;

  constructor(messageService: IMessageService) {
    this.messageService = messageService;
  }

  async createMessage(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { content } = request.body as MessageTypes;
      const { chatId, recipientId } = request.params as any;
      const { userId: senderId } = request.user as UserParams;

      const message = await this.messageService.createMessage(
        content,
        senderId,
        recipientId,
        chatId
      );

      reply.send({
        message: "message was sent successfully",
        chatId: message.chatId,
      });
    } catch (error) {
      reply.code(500).send({
        message: `an error has occurred, try again later: ${error}`,
      });
    }
  }
}
