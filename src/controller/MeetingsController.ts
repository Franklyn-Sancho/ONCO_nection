import { FastifyRequest, FastifyReply } from "fastify";
import { Meetings, User } from "@prisma/client";
import { MeetingRepository } from "../repository/MeetingRepository";
import { MeetingService } from "../service/MeetingService";

interface Meeting {
  title: string;
  body: string;
}

export class MeetingController {
  private meetingService: MeetingService;

  constructor() {
    this.meetingService = new MeetingService();
  }

  async handle(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<Response> {
    const { title, body } = request.body as Meetings;

    const userId = request.user as User;

    const meetingRepository = new MeetingRepository(title, body, userId);

    try {
      await this.meetingService?.execute(meetingRepository);
      console.log("Meeting salvo com sucesso!");

      return reply.status(201).send({
        success: "Publicado com sucesso",
        content: meetingRepository,
      });
    } catch (err) {
      return reply.status(500).send({
        failed: `erro ao publicar ${err}`,
      });
    }
  }
}
