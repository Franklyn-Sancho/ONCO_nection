import { FastifyInstance, preValidationHookHandler } from "fastify";
import { MeetingController } from "../controller/MeetingController";
import { MeetingService } from "../service/MeetingService";
import { MeetingRepository } from "../repository/MeetingRepository";
import { authenticate } from "../plugins/authenticate";
import { PrismaClient } from "@prisma/client";

export function meetingRouter(
  fastify: FastifyInstance,
  options: any,
  done: () => void
) {
  const prisma = new PrismaClient();
  const meetingRepository = new MeetingRepository(prisma);
  const meetingService = new MeetingService(meetingRepository);
  const meetingController = new MeetingController(meetingService);

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
