import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "../service/UserService";
import { User } from "@prisma/client";

export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(
    request: FastifyRequest<{ Body: User }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const createdUser = await this.userService.createUser(request.body);
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
