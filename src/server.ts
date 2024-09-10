import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { Server as SocketIOServer } from 'socket.io';
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import userRouter from "./router/user.router";
import fastifyMultipart from "@fastify/multipart";
import { messageRouter } from "./router/chat.router";
import { setupSocket } from "./socket/socket";
import { messageService } from "./utils/providers";
import { meetingRouter } from "./router/meeting.router";
import { muralRouter } from "./router/mural.router";
import { registerFriendshipRoutes } from "./router/friendship.router";
import fastifyStatic from "@fastify/static";
import path from "path";
import dotenv from 'dotenv'
import { setupSwagger } from "./swagger";
import { initRabbitMQ } from "./infrastructure/rabbitmqService";
import { googleRouterAuthentication } from "./auth/google/authGoogleConfig";
import './infrastructure/cronServices';

dotenv.config()

async function main() {
  const __dirname = path.resolve();

  const fastify = Fastify({
    logger: true,
  });

  await initRabbitMQ();

  const io = new SocketIOServer(fastify.server, {
    cors: {
      origin: "*", // Defina corretamente a origem conforme necessário
      methods: ["GET", "POST"],
    },
  });

  // Configura o socket
  setupSocket(io, messageService);

  setupSwagger(fastify)

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
    addToBody: true, 
  });



  fastify.register(userRouter); 
  fastify.register(meetingRouter); 
  fastify.register(registerFriendshipRoutes);
  fastify.register(muralRouter);
  fastify.register(messageRouter);
  fastify.register(googleRouterAuthentication)

  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({ error: "Page Not Found" });
  });

  await fastify.listen({ port: 3333, host: "0.0.0.0" });

  return fastify;


}

export default main();
