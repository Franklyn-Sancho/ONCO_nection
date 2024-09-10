import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/authenticate";
import { chatController, messageController } from "../utils/providers";

export function messageRouter(
  fastify: FastifyInstance,
  options: any,
  done: () => void
) {
  // Rota para criar uma nova mensagem usando apenas o chatId
  fastify.post(
    "/chat/:chatId/message",
    { preHandler: authenticate },
    messageController.createMessage.bind(messageController)
  );

  // Rota para obter informações sobre um chat específico
  fastify.get(
    "/chat/:chatId",
    chatController.getChatById.bind(chatController)
  );

  // Rota para obter chats do usuário
  fastify.get(
    "/chats/:userId",
    chatController.getChatsByUserId.bind(chatController)
  );

  done();
}

