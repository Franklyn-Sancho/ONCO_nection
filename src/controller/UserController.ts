import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "../service/UserService";
import { User } from "@prisma/client";
import {
  userRegisterValidade,
  userAutenticateValidade,
} from "../utils/userValidations";
import { validateRequest } from "../utils/validateRequest";

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
    //this struct try to save new user on database
    try {
      await validateRequest(request, reply, userRegisterValidade);
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

  //authenticationUser function
  async authenticateUser(
    request: FastifyRequest<{ Body: User }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await validateRequest(request, reply, userAutenticateValidade);
      const token = await this.userService.authenticate(request.body);
      reply.send({ token });
    } catch (error) {
      reply.status(401).send({
        message: "email ou senha inválidos",
      });
    }
  }
}
