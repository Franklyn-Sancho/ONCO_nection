import { FastifyInstance, preValidationHookHandler } from "fastify";
import { authenticate } from "../plugins/authenticate";
import { muralController } from "../utils/providers";

export function muralRouter(
  fastify: FastifyInstance,
  options: any,
  done: () => void
) {
  fastify.post(
    "/mural/create",
    { preHandler: authenticate },
    muralController.createMural.bind(muralController)
  );

  fastify.get(
    "/mural/:muralId",
    { preHandler: authenticate },
    muralController.getMuralByIdIfFriends.bind(muralController)
  );

  fastify.get(
    "/mural/timeline",
    { preHandler: [authenticate] },
    muralController.getMuralsIfFriends.bind(muralController)
  );

  fastify.get(
    "/mural/:muralId/likes",
    { preHandler: authenticate },
    muralController.getLikeByMural.bind(muralController)
  );

  fastify.get(
    "/mural/:muralId/totalLikes",
    { preHandler: authenticate },
    muralController.countLikesByMural.bind(muralController)
  );

  fastify.get(
    "/mural/:muralId/totalComments",
    { preHandler: authenticate },
    muralController.countCommentsByMural.bind(muralController)
  );

  fastify.get(
    "/mural/:muralId/comments",
    muralController.getCommentByMural.bind(muralController)
  );


  fastify.put(
    "/mural/:muralId/update",
    { preHandler: authenticate },
    muralController.updateMural.bind(muralController)
  );

  fastify.delete(
    "/mural/:muralId/delete",
    { preHandler: authenticate },
    muralController.deleteMural.bind(muralController)
  );

  fastify.post(
    "/mural/:muralId/likes",
    { preHandler: authenticate },
    muralController.addLikeMural.bind(muralController)
  );

  fastify.post(
    "/mural/:muralId/comments",
    { preHandler: authenticate },
    muralController.addCommentMural.bind(muralController)
  );

  fastify.delete(
    "/mural/:likesId/likes",
    { preHandler: authenticate },
    async (request, reply) => {
      await muralController.removeLikeMural(request, reply);
    }
  );

  fastify.delete(
    "/mural/:commentId/comments",
    { preHandler: authenticate },
    async (request, reply) => {
      await muralController.removeCommentMural(request, reply);
    }
  );

  done();
}
