import { FastifyRequest, FastifyReply } from "fastify";
import { MeetingService } from "../service/MeetingService";
import { Meetings, User } from "@prisma/client";
import { MeetingRepository } from "../repository/MeetingRepository";

/* interface Meeting {
  title: string;
  body: string;
}

const meetingService = new MeetingService();

export class MeetingController {

  
  async createMeeting(request: FastifyRequest, reply: FastifyReply) {
    const { title, body } = request.body as Meeting;
    const user = request.user as User

    const createMeeting = await meetingService.create({title, body, userId: user.id})

    if (!user) {
      console.log(createMeeting);
      reply.status(401).send({
        failed: "Usuário não autenticado",
      });
      return;
    }

    try {
      

      reply.status(200).send({
        success: "Publicado com sucesso",
        content: createMeeting,
      });
    } catch (error) {
      console.log();
      reply.status(500).send({
        failed: `Erro ao publicar ${error}`,
      });
    }
  }
} */

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
      await this.meetingService.execute(meetingRepository);


      return reply.status(201).send({
        success: "Publicado com sucesso",
        content: meetingRepository,
      });
    } catch (err) {
      console.log(meetingRepository);
      return reply.status(500).send({
        failed: `erro ao publicar ${err}`,
      });
    }
  }
}
