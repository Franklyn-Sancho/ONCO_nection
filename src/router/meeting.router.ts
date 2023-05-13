import { FastifyInstance } from "fastify";
import MeetingsController from "../controller/MeetingsController";

const meetingController = new MeetingsController();

//meeting router
export default async function meetingRouter(fastify: FastifyInstance) {
  fastify.post(
    "/meeting/create",
    meetingController.create.bind(meetingController)
  );
}
