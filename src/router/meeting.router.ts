import { FastifyInstance } from "fastify";

import { authenticate } from "../plugins/authenticate";
import { MeetingController } from "../controller/MeetingsController";
import { MeetingService } from "../service/MeetingService";

export default function meetingRouter (fastify: FastifyInstance, option: any, done: any) {
  const meetingController = new MeetingController();

  fastify.post(
    "/meeting/create",
    { preHandler: authenticate },
    meetingController.handle
  );

  done()
}
