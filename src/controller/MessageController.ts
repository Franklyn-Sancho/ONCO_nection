import { FastifyReply, FastifyRequest } from "fastify";
import { IMessageService } from "../service/MessageService";
import { UserRequest } from "../types/userTypes";

export interface IMessageController {
  createMessage(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class MessageController implements IMessageController {
  private messageService: IMessageService;

  constructor(messageService: IMessageService) {
    this.messageService = messageService;
  }

  async createMessage(
    request: UserRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { content, recipientId } = request.body as any;
      const { chatId } = request.params as any;
      const { userId: senderId } = request.user;

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
