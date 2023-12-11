import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import {verify} from 'jsonwebtoken'


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

/* export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Obter o token do cookie
    const token = request.cookies.token;

    // Verificar o token
    const decodedToken = verify(token, process.env.TOKEN_KEY);

    request.user = decodedToken;
  } catch (error) {
    throw new UnauthorizedError("falha de autenticação")
  }
}
 */
