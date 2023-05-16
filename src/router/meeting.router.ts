import { FastifyInstance } from "fastify";
import { MeetingController } from "../controller/MeetingsController";
import { authenticate } from "../plugins/authenticate";


/* const meetingController = new MeetingController();

export default async function (fastify: FastifyInstance) {
  fastify.post("/meeting/new", {preHandler: authenticate}, meetingController.createMeeting);
} */

export default function meetingRouter (fastify: FastifyInstance, option: any, done: any) {
  const meetingController = new MeetingController();

  fastify.post(
    "/meeting/create",
    { preHandler: authenticate },
    meetingController.handle
  );

  done()
}
