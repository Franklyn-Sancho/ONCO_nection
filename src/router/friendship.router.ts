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
    "/friendships",
    { preHandler: [authenticate] },
    friendshipController.sendFriendRequest.bind(friendshipController)
  );

  fastify.put(
    "/friendships/:id",
    { preHandler: [authenticate] },
    friendshipController.acceptFriendRequest.bind(friendshipController)
  );

  // Registra a rota GET /friends/:userId para recuperar a lista de amigos de um usuário
  fastify.get(
    "/friends/:userId",
    { preHandler: [authenticate] },
    friendshipController.getFriends.bind(friendshipController)
  );

  //rota responsável por deletar uma amizade por seu ID
  fastify.delete(
    "/friendship/:addressedId",
    { preHandler: [authenticate] },
    friendshipController.deleteFriendship.bind(friendshipController)
  );

  done();
}
