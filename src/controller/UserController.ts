import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "../service/UserService";
import { User } from "@prisma/client";
import { z } from "zod";

export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(
    request: FastifyRequest<{ Body: User }>,
    reply: FastifyReply
  ): Promise<void> {
    const userValidade = z.object({
      name: z.string({ required_error: "nome requerido" }),
      email: z.string({ required_error: "email requerido" }).email(),
      password: z.string({ required_error: "senha requerida" }),
    });

    userValidade.parse(request.body);

    try {
      const createdUser = await this.userService.execute(request.body);
      reply.status(201).send(createdUser);
    } catch {
      reply.status(500).send("Verifique seus Dados");
    }
  }

  async authenticateUser(
    request: FastifyRequest<{ Body: User }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const token = await this.userService.authenticate(request.body);
      reply.send({ token });
    } catch {
      reply.status(401).send("Email ou Senha inválidos");
    }
  }
}
