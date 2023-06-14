import { FastifyInstance, preValidationHookHandler } from "fastify";
import { authenticate } from "../plugins/authenticate";
import { PrismaClient } from "@prisma/client";
import { MuralController } from "../controller/MuralController";
import { MuralRepository } from "../repository/MuralRepository";
import { MuralService } from "../service/MuralService";

export function muralRouter(
  fastify: FastifyInstance,
  options: any,
  done: () => void
) {
  const prisma = new PrismaClient();
  const muralRepository = new MuralRepository(prisma);
  const muralService = new MuralService(muralRepository)
  const muralController = new MuralController(muralService)

  fastify.post(
    "/mural/create",
    { preHandler: authenticate },
    muralController.createMural.bind(muralController)
  );

  fastify.get(
    "/timeline",
    {preHandler: [authenticate]},
    muralController.getMurals.bind(muralController)
  )

  /* fastify.post(
    "/meeting/:id/likes",
    { preHandler: authenticate },
    meetingController.addLike.bind(meetingController)
  );

  fastify.post(
    "/meeting/:id/comments",
    { preHandler: authenticate },
    meetingController.addComment.bind(meetingController)
  ); */

  done();
}
