import { FastifyBaseLogger, FastifyReply, FastifyRequest, FastifySchema, FastifyTypeProviderDefault, RawServerDefault, RouteGenericInterface } from "fastify";
import { IChatService } from "../service/ChatService";
import { ResolveFastifyRequestType } from "fastify/types/type-provider";
import { IncomingMessage, ServerResponse } from "http";

export interface IChatController {
  createChat(request: FastifyRequest, reply: FastifyReply): any;
  getChat(request: FastifyRequest, reply: FastifyReply): any;
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

  async getChat(request: FastifyRequest, reply: FastifyReply) {
      
    try {
      const {id} = request.params as any

    const messages = await this.chatService.getChat(id)
    reply.send({
      message: "mensagens retornadas com sucesso",
      content: messages
    })
    }
    catch (error) {
      reply.status(500).send({
        message: "ocorreu um erro, tente novamente mais tarde"
      })
    }
  }
}
