import { FastifyInstance } from "fastify";
import { authenticate } from "../plugins/authenticate";
import { meetingController } from "../utils/providers";
import { UserRequest } from "../types/userTypes";

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

  fastify.put(
    "/meetings/:id/update",
    {preHandler: authenticate},
    meetingController.updateMeeting.bind(meetingController)
  )

  fastify.delete(
    "/meetings/:id/delete",
    {preHandler: authenticate},
    meetingController.deleteMeeting.bind(meetingController)
  )

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
