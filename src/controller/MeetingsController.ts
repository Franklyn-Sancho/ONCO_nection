import { FastifyReply, FastifyRequest } from "fastify";
import { MeetingService } from "../service/MeetingService";
import { z } from "zod";
import { User } from "@prisma/client";

export class MeetingController {
  private meetingService: MeetingService;

  constructor() {
    this.meetingService = new MeetingService();
  }

  async createMeeting(request: FastifyRequest, reply: FastifyReply) {
    const meetingValidation = z.object({
      title: z.string({ required_error: "title is required" }),
      body: z.string({ required_error: "body is required" }),
    });

    const { title, body } = meetingValidation.parse(request.body);

    try {
      const createNewMeeting = await this.meetingService.createMeeting(
        title,
        body,
        request.user as User
      );
      reply.status(200).send({
        success: "Publicado com sucesso",
        content: createNewMeeting,
      });
    } catch (err) {
      console.log(title, body, request.user);
      reply.status(500).send({
        failed: `Erro ao publicar ${err}`,
      });
    }
  }
}
