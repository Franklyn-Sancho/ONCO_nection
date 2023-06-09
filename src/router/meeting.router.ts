import { FastifyInstance, preValidationHookHandler } from "fastify";
import { MeetingController } from "../controller/MeetingsController";
import { MeetingService } from "../service/MeetingService";
import { MeetingRepository } from "../repository/MeetingRepository";
import { authenticate } from "../plugins/authenticate";
import { PrismaClient } from "@prisma/client";

export function meetingRouter(
  fastify: FastifyInstance,
  options: any,
  done: () => void
) {
  const prisma = new PrismaClient
  const meetingRepository = new MeetingRepository(prisma);
  const meetingService = new MeetingService(meetingRepository);
  const meetingController = new MeetingController(meetingService);

  fastify.post(
    "/meetings/create",
    { preHandler: authenticate },
    meetingController.createMeeting.bind(meetingController)
  );

  done();
}
