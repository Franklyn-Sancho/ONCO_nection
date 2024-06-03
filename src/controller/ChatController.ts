import { FastifyReply, FastifyRequest } from "fastify";
import { IChatService } from "../service/ChatService";
import { Chat } from "@prisma/client";
import { ChatParams } from "../types/chatTypes";

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
      const { chatId } = request.params as ChatParams;

      const messages = await this.chatService.getChatById(chatId);
      reply.send({
        message: "messages returned successfully",
        content: messages,
      });

      return messages;
    } catch (error) {
      reply.status(500).send({
        message: "An error occurred, try again later",
      });
    }

    return null;
  }
}
