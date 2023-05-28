import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "../service/UserService";
import { User } from "@prisma/client";
import { z } from "zod";
import { userValidade } from "../utils/userValidations";

export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(
    request: FastifyRequest<{ Body: User }>,
    reply: FastifyReply
  ): Promise<void> {

    const {body} = request;

    try {
      await userValidade.parseAsync(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = error.errors.map((e) => e.message).join(", ");
        reply.status(400).send({
          message: `Ocorreu um erro: ${validationError}`,
        });
        return;
      } 
      throw error;
    }

    try {
      await this.userService.execute(request.body);
      reply.status(201).send({
        message: "Registro feito com sucesso",
      });
    } catch {
      reply.status(500).send({
        message: "verifique seus dados",
      });
    }
  }

  /* userValidade.parse(request.body);

    try {
      const createdUser = await this.userService.execute(request.body);
      reply.status(201).send({
        message: "Registro feito com sucesso",
      });
    } catch (error) {
      reply.status(500).send({
        message: "Verifique seus dados",
      });
    }
  } */

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
