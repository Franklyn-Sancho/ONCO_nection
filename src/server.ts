import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import userRouter from "./router/user.router";
import meetingRouter from "./router/meeting.router";
import muralRouter from "./router/mural.router";

require("dotenv").config();

async function main() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: process.env.TOKEN_KEY,
  });

  fastify.register(userRouter);
  fastify.register(meetingRouter);
  fastify.register(muralRouter);

  await fastify.listen({ port: 3000, host: "0.0.0.0" });
}

main();
