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
    async (request, reply) => {
      const { userId: requesterId } = request.user as any;

      const { addressedId } = request.body as any;

      const result = await friendshipController.sendFriendRequest(
        requesterId,
        addressedId
      );
      reply.code(200).send({
        message: "Solicitação de amizade enviada"
      });
    }
  );

  // Registra a rota PUT /friendships/:requesterId/:addresseeId para aceitar uma solicitação de amizade existente
  fastify.put(
    "/friendships/:requesterId",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { userId: addressedId } = request.user as any;
      const { requesterId } = request.params as any;
      const { status } = request.body as any;

      if (status !== "ACCEPTED" && status !== "DENIED") {
        reply.status(400).send({ error: "Valor de status inválido" });
        return;
      }

      await friendshipController.acceptFriendRequest(
        requesterId,
        addressedId,
        status
      );

      if (status === "ACCEPTED") {
        reply.send({ message: "Solicitação de amizade aceita" });
      } else {
        reply.send({ message: "Solicitação de amizade negada" });
      }
    }
  );

  // Registra a rota GET /friends/:userId para recuperar a lista de amigos de um usuário
  fastify.get(
    "/friends/:userId",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { userId } = request.params as any;
      const result = await friendshipController.getFriends(userId);
      reply.send(result);
    }
  );

  //rota responsável por deletar uma amizade por seu ID
  fastify.delete("/friendship/:addressedId", async (request, reply) => {
    const { addressedId } = request.params as any;
    const { userId: requesterId } = request.user as any;

    await friendshipController.deleteFriendship(requesterId, addressedId);
    reply.send({
      message: "Usuário deletado com sucesso",
    });
  });

  done();
}
