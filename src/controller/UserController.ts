import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "../service/UserService";
import { User } from "@prisma/client";
import { z } from "zod";
import {
  userRegisterValidade,
  userAutenticateValidade,
} from "../utils/userValidations";

//class user controller
export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  //createUser function
  async createUser(
    request: FastifyRequest<{ Body: User }>,
    reply: FastifyReply
  ): Promise<void> {
    const { body } = request;

    //This structure maps the Zod validation error and returns it
    try {
      await userRegisterValidade.parseAsync(body);
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

    //this struct try to save new user on database
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

  //authenticationUser function
  async authenticateUser(
    request: FastifyRequest<{ Body: User }>,
    reply: FastifyReply
  ): Promise<void> {
    const { body } = request;
    try {
      await userAutenticateValidade.parseAsync(body)
      const token = await this.userService.authenticate(request.body);
      reply.send({ token });
    } catch (error) {
      //This structure maps the Zod validation error and returns it
      if(error instanceof z.ZodError) {
        const validationError = error.errors.map((e) => e.message).join(", ");
        reply.status(400).send({
          message: `Ocorreu um erro: ${validationError}`,
        });
        return;
      } 

      reply.status(401).send({
        message: "Email ou Senha inválidos"
      })
    }
  }
}
