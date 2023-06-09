import { FastifyReply, FastifyRequest } from "fastify";
import { IMeetingService } from "../service/MeetingService";

export interface IMeetingController {
  createMeeting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
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
      console.log(request.user)
      reply.code(500).send({
        
        error: error,
      });
    }
  }
}
