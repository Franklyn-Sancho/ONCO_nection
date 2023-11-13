import { FastifyReply, FastifyRequest } from "fastify";
import { IChatService } from "../service/ChatService";
import { Chat } from "@prisma/client";

export interface IChatController {
  /* createChat(request: FastifyRequest, reply: FastifyReply): any; */ //!unused function
  getChatById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<Chat | null>;
}

export class ChatController implements IChatController {
  private chatService: IChatService;

  constructor(chatService: IChatService) {
    this.chatService = chatService;
  }

  /* async createChat(request: FastifyRequest, reply: FastifyReply) {
    try {
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
  } */

  async getChatById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<Chat | null> {
    try {
      const { id } = request.params as any;

      const messages = await this.chatService.getChatById(id);
      reply.send({
        message: "mensagens do chat retornadas com sucesso",
        content: messages,
      });

      return messages;
    } catch (error) {
      reply.status(500).send({
        message: "ocorreu um erro, tente novamente mais tarde",
      });
    }

    return null;
  }
}
