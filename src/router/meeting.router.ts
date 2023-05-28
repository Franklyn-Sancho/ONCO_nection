import { FastifyInstance } from "fastify";
import { MeetingController } from "../controller/MeetingsController";
import { authenticate } from "../plugins/authenticate";

/* const meetingController = new MeetingController();

export default async function (fastify: FastifyInstance) {
  fastify.post("/meeting/new", {preHandler: authenticate}, meetingController.createMeeting);
} */

/**
 * 
 * meeting router to create for while
 * i need to repair this router because the requisition is not 
 * recognizing the foreign key
 */
export default function meetingRouter(
  fastify: FastifyInstance,
  options: any,
  done: any
) {
  const meetingController = new MeetingController();


  fastify.route({
    method: "POST", //post method
    url: "/meeting/create", //router url
    preHandler: authenticate, //prehandler is required
    handler: meetingController.createMeeting.bind(meetingController)
  });

  done();
}
