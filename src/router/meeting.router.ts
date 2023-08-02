import { FastifyInstance } from "fastify";
import { authenticate } from "../plugins/authenticate";
import { meetingController } from "../utils/providers";

export function meetingRouter(
  fastify: FastifyInstance,
  options: any,
  done: () => void
) {



  fastify.post(
    "/meetings/create",
    { preHandler: authenticate },
    meetingController.createMeeting.bind(meetingController)
  );

  fastify.post(
    "/meetings/:id/likes",
    { preHandler: authenticate },
    meetingController.addLikeMeeting.bind(meetingController)
  );

  fastify.post(
    "/meetings/:id/comments",
    { preHandler: authenticate },
    meetingController.addCommentMeeting.bind(meetingController)
  );

  fastify.delete(
    "/meetings/:id/likes",
    { preHandler: authenticate },
    async (request, reply) => {
      await meetingController.removeLikeMeeting(request, reply);
    }
  );

  fastify.delete(
    "/meetings/:id/comments",
    { preHandler: authenticate },
    async (request, reply) => {
      await meetingController.removeCommentMeeting(request, reply);
    }
  );

  done();
}
