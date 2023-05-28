import { FastifyReply, FastifyRequest } from "fastify";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    const decodedToken = request.user;
    request.user = { id: decodedToken.id };
  } catch (err) {
    reply.send(err);
  }
}
