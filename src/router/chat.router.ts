import { FastifyInstance } from "fastify";
import { authenticate } from "../plugins/authenticate";
import { chatController } from "../utils/providers";

export function meetingRouter(
  fastify: FastifyInstance,
  options: any,
  done: () => void
) {
  fastify.post(
    "/chat/:id",
    { preHandler: authenticate },
    chatController.createChat.bind(chatController)
  );
}
