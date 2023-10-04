import { FastifyReply, FastifyRequest } from "fastify";
import { IMessageService } from "../service/MessageService";

export interface IMessageController {
  createMessage(request: FastifyRequest, reply: FastifyReply): any;
}

export class MessageController implements IMessageController {
  private messageService: IMessageService;

  constructor(messageService: IMessageService) {
    this.messageService = messageService;
  }

  async createMessage(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { content, recipientId, chatId } = request.body as any;
      const {userId: senderId} = request.user as any

      await this.messageService.createMessage(
        content,
        senderId,
        recipientId,
        chatId
      );

      reply.send({
        message: "Mensagem enviada com sucesso",
      });
    } catch (error) {
      reply.code(500).send({
        message: "Ocorreu um erro, tente novamente mais tarde",
      });
    }
  }
}
