import { FastifyReply, FastifyRequest } from "fastify";
import MeetingService from "../service/MeetingService";
import { Meetings, User } from "@prisma/client";

export default class MeetingsController {
  private meetingService: MeetingService;

  constructor() {
    this.meetingService = new MeetingService();
  }

  async create(
    request: FastifyRequest<{ Body: Meetings}>,
    reply: FastifyReply
  ): Promise<Meetings> {
    const meeting = await this.meetingService.create(request.body);

    return meeting;
  }
}
