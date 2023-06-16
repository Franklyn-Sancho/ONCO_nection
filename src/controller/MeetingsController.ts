import {
  FastifyBaseLogger,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  FastifyTypeProviderDefault,
  RawServerDefault,
  RouteGenericInterface,
} from "fastify";
import { IMeetingService } from "../service/MeetingService";
import { z } from "zod";
import { validateRequest } from "../utils/validateRequest";
import { ResolveFastifyRequestType } from "fastify/types/type-provider";
import { IncomingMessage, ServerResponse } from "http";

export interface IMeetingController {
  createMeeting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  addLikeMeeting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  removeLikeMeeting(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  addComment(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  removeCommentMeeting(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
}

export class MeetingController implements IMeetingController {
  constructor(private meetingService: IMeetingService) {}

  async createMeeting(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const meetingValidations = z.object({
      title: z.string({ required_error: "title is required" }),
      body: z.string({ required_error: "body is required" }),
    });

    try {
      await validateRequest(request, reply, meetingValidations);
      const { type, title, body } = request.body as any;
      const { userId } = request.user as any;

      await this.meetingService.createMeeting({
        type,
        title,
        body,
        userId,
      });
      reply.send({
        message: "Meeting criado com sucesso",
      });
    } catch (error) {
      console.log(request.user);
      reply.code(500).send({
        error: error,
      });
    }
  }

  //função da camada controller para adicionar likes nas meetings
  async addLikeMeeting(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { userId } = request.user as any;
      console.log(userId);

      await this.meetingService.addLikeMeeting(id, userId);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Ocorreu um erro na camada controller: ${error}`,
      });
    }
  }

  async removeLikeMeeting(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;

      await this.meetingService.removeLikeMeeting(id);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `error removing like from meeting: ${error}`,
      });
    }
  }

  async addComment(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { userId } = request.user as any;
      const { content } = request.body as any;

      await this.meetingService.addComment(id, userId, content);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Ocorreu um erro na camada controller: ${error}`,
      });
    }
  }

  async removeCommentMeeting(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;

      await this.meetingService.removeCommentMeeting(id);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `error removing comment from meeting: ${error}`,
      });
    }
  }
}
