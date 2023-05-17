import { FastifyInstance } from "fastify";
import { MeetingController } from "../controller/MeetingsController";
import { authenticate } from "../plugins/authenticate";

/* const meetingController = new MeetingController();

export default async function (fastify: FastifyInstance) {
  fastify.post("/meeting/new", {preHandler: authenticate}, meetingController.createMeeting);
} */

export default function meetingRouter(
  fastify: FastifyInstance,
  options: any,
  done: any
) {
  const meetingController = new MeetingController();


  fastify.route({
    method: "POST",
    url: "/meeting/create",
    preHandler: authenticate,
    handler: meetingController.createMeeting.bind(meetingController)
  });

  done();
}
