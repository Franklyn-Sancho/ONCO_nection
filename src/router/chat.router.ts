import { FastifyInstance } from "fastify";
import { authenticate } from "../plugins/authenticate";
import { chatController, messageController } from "../utils/providers";

export function messageRouter(
  fastify: FastifyInstance,
  options: any,
  done: () => void
) {

  fastify.post(
    "/chat/:chatId/message/:recipientId",
    { preHandler: authenticate },
    messageController.createMessage.bind(messageController)
  );

  fastify.get(
    "/chat/:id",
    chatController.getChatById.bind(chatController)
  )

  done();
}
