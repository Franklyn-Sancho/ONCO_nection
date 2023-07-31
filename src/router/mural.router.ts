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
  const muralService = new MuralService(muralRepository);
  const muralController = new MuralController(muralService);

  fastify.post(
    "/mural/create",
    { preHandler: authenticate },
    muralController.createMural.bind(muralController)
  );

  fastify.get(
    "/mural/timeline",
    { preHandler: [authenticate] },
    muralController.getMurals.bind(muralController)
  );

  fastify.post(
    "/mural/:id/likes",
    { preHandler: authenticate },
    muralController.addLikeMural.bind(muralController)
  );

  fastify.post(
    "/mural/:id/comments",
    { preHandler: authenticate },
    muralController.addCommentMural.bind(muralController)
  );

  fastify.delete(
    "/mural/:id/likes",
    { preHandler: authenticate },
    async (request, reply) => {
      await muralController.removeLikeMural(request, reply);
    }
  );

  fastify.delete(
    "/mural/:id/comments",
    { preHandler: authenticate },
    async (request, reply) => {
      await muralController.removeCommentMural(request, reply);
    }
  );

  done();
}
