import { FastifyInstance } from "fastify";
import { authenticate } from "../plugins/authenticate";
import { chatController, messageController } from "../utils/providers";

export function messageRouter(
  fastify: FastifyInstance,
  options: any,
  done: () => void
) {
  fastify.post(
    "/chat/:id",
    { preHandler: authenticate },
    chatController.createChat.bind(chatController)
  );

  fastify.post(
    "/chat/:chatId/message",
    { preHandler: authenticate },
    messageController.createMessage.bind(messageController)
  );

  done();
}
