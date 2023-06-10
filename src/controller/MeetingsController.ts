import { FastifyReply, FastifyRequest } from "fastify";
import { IMeetingService } from "../service/MeetingService";

export interface IMeetingController {
  createMeeting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  addLike(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  addComment(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class MeetingController implements IMeetingController {
  constructor(private meetingService: IMeetingService) {}

  async createMeeting(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { type, title, body } = request.body as any;
      const { userId } = request.user as any;

      const meeting = await this.meetingService.createMeeting({
        type,
        title,
        body,
        userId,
      });
      reply.send(meeting);
    } catch (error) {
      console.log(request.user);
      reply.code(500).send({
        error: error,
      });
    }
  }

  //função da camada controller para adicionar likes nas meetings
  async addLike(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { userId } = request.user as any;
      console.log(userId);

      await this.meetingService.addLike(id, userId);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Ocorreu um erro na camada controller: ${error}`,
      });
    }
  }
  //função da camada controller para adicionar comentários nas meetings
  async addComment(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { content } = request.body as any;
      const {userId} = request.user as any;
      console.log(userId);
      await this.meetingService.addComment(id, userId, content);

      reply.code(201).send("Comentário adicionado com sucesso");
    } catch (error) {
      reply.code(500).send({
        error: `Ocorreu um erro na camada do controlador: ${error}`,
      });
    }
  }
}
