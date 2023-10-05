import { FastifyReply, FastifyRequest } from "fastify";
import { IChatService } from "../service/ChatService";

export interface IChatController {
  createChat(request: FastifyRequest, reply: FastifyReply): any;
}

export class ChatController implements IChatController {
  private chatService: IChatService;

  constructor(chatService: IChatService) {
    this.chatService = chatService;
  }

  async createChat(request: FastifyRequest, reply: FastifyReply) {
    try {
     /*  const { id } = request.params as any; */
      const { userId: initiatorId } = request.user as any;
      const { participantId } = request.body as any;

      await this.chatService.createChat(initiatorId, participantId);

      reply.send({
        message: "chat criado com sucesso",
      });
    } catch (error) {
      reply.code(500).send({
        message: "ocorreu um erro, tente novamente mais tarde",
      });
    }
  }
}