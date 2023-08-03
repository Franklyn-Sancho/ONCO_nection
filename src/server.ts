import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import userRouter from "./router/user.router";
import { meetingRouter } from "./router/meeting.router";
import { muralRouter } from "./router/mural.router";
import { registerFriendshipRoutes } from "./router/friendship.router";
import fastifyMultipart from "@fastify/multipart";
import socketioServer from "fastify-socket.io";

import("dotenv").then((dotenv) => dotenv.config());

//app function
async function main() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: process.env.TOKEN_KEY,
    decode: { complete: true },
  });

  /* fastify.register(fastifyMultipart); */

  fastify.register(fastifyMultipart, {
    addToBody: true, // Isso permite adicionar os campos ao objeto `request.body`
  });
  
  fastify.register(socketioServer)

  fastify.register(userRouter); //register to userRouter
  fastify.register(meetingRouter); //register to meetingRouter
  fastify.register(registerFriendshipRoutes);
  fastify.register(muralRouter);

  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({error: "Página não encontrada"})
  })

  await fastify.listen({ port: 3000, host: "0.0.0.0" });

  return fastify;
}

export default main();
