import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../errors/UnauthorizedError";


//plugin to authenticate
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    //verifica o token jwt do usuário
    await request.jwtVerify();
    //atribui o token decodificado ao objeto request.user
    const decodedToken = request.user as any;
    request.user = decodedToken;
  } catch (error) {
    throw new UnauthorizedError("falha na autenticação")
  }
}
