import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import userRouter from "./router/user.router";
import { meetingRouter } from "./router/meeting.router";
import { muralRouter } from "./router/mural.router";
import { registerFriendshipRoutes } from "./router/friendship.router";

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

  fastify.register(userRouter); //register to userRouter
  fastify.register(meetingRouter); //register to meetingRouter
  fastify.register(registerFriendshipRoutes)
  fastify.register(muralRouter)

  await fastify.listen({ port: 3000, host: "0.0.0.0" });

  return fastify; 
}

export default main();
