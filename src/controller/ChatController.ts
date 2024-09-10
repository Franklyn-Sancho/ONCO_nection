import { FastifyReply, FastifyRequest } from "fastify";
import { IChatService } from "../service/ChatService";
import { ChatParams } from "../types/chatTypes";
import { UserParams } from "../types/usersTypes";

export interface IChatController {
  /* createChat(request: FastifyRequest, reply: FastifyReply): any; */ //!unused function
  getChatById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  getChatsByUserId(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>
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

    async getChatsByUserId(request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const { userId } = request.params as UserParams;
  
        const result = await this.chatService.getChatsByUserId(userId);
        reply.send({
          content: result,
        });
      } catch (error) {
        reply.status(500).send({
          message: "An error occurred, try again later",
          error: error
        });
      }
    }


  async getChatById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { chatId } = request.params as ChatParams;

      const messages = await this.chatService.getChatById(chatId);
      reply.send({
        content: messages,
      });
    } catch (error) {
      reply.status(500).send({
        message: "An error occurred, try again later",
        error: error,
      });
    }
  }
}
