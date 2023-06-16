import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

const prisma = new PrismaClient();

//plugin to authenticate
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    //verifica o token jwt do usuário
    await request.jwtVerify();
    //atribui o token decodificado ao objeto request.user
    const decodedToken = request.user;
    request.user = decodedToken;
  } catch (error) {
    reply.status(401).send({
      error: "Falha na autenticação",
    });
  }
}
