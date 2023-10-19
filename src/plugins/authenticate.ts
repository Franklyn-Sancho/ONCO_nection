import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../errors/UnauthorizedError";


//plugin to authenticate
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    const decodedToken = request.user as any;
    request.user = decodedToken;
  } catch (error) {
    throw new UnauthorizedError("falha de autenticação")
  }
}
