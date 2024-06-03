import { FastifyInstance } from "fastify";
import { authenticate } from "../plugins/authenticate";
import { friendshipController } from "../utils/providers";

export function registerFriendshipRoutes(
  fastify: FastifyInstance,
  options: any,
  done: () => void
) {
  // Registra a rota POST /friendships para enviar uma nova solicitação de amizade
  fastify.post(
    "/friendships/:addressedId",
    { preHandler: [authenticate] },
    friendshipController.sendFriendRequest.bind(friendshipController)
  );

  fastify.put(
    "/friendships/:friendshipId",
    { preHandler: [authenticate] },
    friendshipController.acceptFriendRequest.bind(friendshipController)
  );


  fastify.get(
    "/friends/:addressedId",
    /* { preHandler: [authenticate] }, */
    friendshipController.getAllFriends.bind(friendshipController)
  );

  fastify.get(
    "/friends/solicitation/:addressedId",
    { preHandler: [authenticate] },
    friendshipController.checkPendingFriendship.bind(friendshipController)
  );

  fastify.get(
    "/friendship/solicitations/:addressedId",
    /* { preHandler: [authenticate] } */
    friendshipController.listPendingFriendship.bind(friendshipController)
  );

  //rota responsável por deletar uma amizade por seu ID
  fastify.delete(
    "/friendships/:id",
    { preHandler: [authenticate] },
    friendshipController.deleteFriendship.bind(friendshipController)
  );

  done();
}
