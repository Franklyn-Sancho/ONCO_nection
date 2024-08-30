import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import userRouter from "./router/user.router";
import fastifyMultipart from "@fastify/multipart";
import { messageRouter } from "./router/chat.router";
import { setupSocket } from "./socket";
import { chatService, io, messageService } from "./utils/providers";
import { meetingRouter } from "./router/meeting.router";
import { muralRouter } from "./router/mural.router";
import { registerFriendshipRoutes } from "./router/friendship.router";
import fastifyStatic from "@fastify/static";
import path from "path";
import dotenv from 'dotenv'
import { setupSwagger } from "./swagger";
import { initRabbitMQ } from "./config/rabbitmqConfig";

dotenv.config()

async function main() {
  const __dirname = path.resolve();

  const fastify = Fastify({
    logger: true,
  });

  await initRabbitMQ();

  setupSwagger(fastify)

  setupSocket(io, messageService, chatService);

  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });


  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "upload"),
    prefix: "/upload/",
  });


  await fastify.register(jwt, {
    secret: process.env.SECRET_KEY,
    decode: { complete: true },
  });

  fastify.register(fastifyMultipart, {
    addToBody: true, // Isso permite adicionar os campos ao objeto `request.body`
  });



  fastify.register(userRouter); //register to userRouter
  fastify.register(meetingRouter); //register to meetingRouter
  fastify.register(registerFriendshipRoutes);
  fastify.register(muralRouter);
  fastify.register(messageRouter);

  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({ error: "Page Not Found" });
  });

  await fastify.listen({ port: 3333, host: "0.0.0.0" });

  return fastify;


}

export default main();
