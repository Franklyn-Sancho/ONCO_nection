import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "../service/UserService";
import { PrismaClient, User } from "@prisma/client";
import {
  userRegisterValidade,
  userAutenticateValidade,
} from "../utils/userValidations";
import { validateRequest } from "../utils/validateRequest";

const prisma = new PrismaClient();

//class user controller
export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  //createUser function
  async register(
    request: FastifyRequest<{ Body: User }>,
    reply: FastifyReply
  ): Promise<void> {
    //this struct try to save new user on database
    try {
      await validateRequest(request, reply, userRegisterValidade);
      await this.userService.register(request.body);
      reply.status(201).send({
        message: "Novo usuário registrado com sucesso",
      });
    } catch {
      reply.status(500).send({
        message: "verifique seus dados",
      });
    }
  }

  //authenticationUser function
  //! há uma redundância de exceção entre a camada de serviço e controlador*****
  async authenticate(
    request: FastifyRequest<{ Body: User }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await validateRequest(request, reply, userAutenticateValidade);
      const result = await this.userService.authenticate(request.body);
      if (result.success) {
        reply.send({ token: result.message });
      } else {
        reply.status(401).send({
          message: result.message,
        });
      }
      /* reply.send({ token }); */
    } catch (error) {
      reply.status(401).send({
        message: "email ou senha inválidos",
      });
    }
  }

  async confirmEmail(request: FastifyRequest, reply: FastifyReply) {
    const token = (request.params as any).token;

    if (typeof token !== "string") {
      reply.send("O link de confirmação é inválido ou expirou");
      return;
    }

    // Busca o usuário pelo token de confirmação de email
    const user = await prisma.user.findUnique({
      where: { emailConfirmationToken: token },
    });

    if (
      user &&
      user.emailConfirmationExpires &&
      user.emailConfirmationExpires > new Date()
    ) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailConfirmed: true,
        },
      });

      reply.send("Seu email foi confirmado com sucesso");
    } else {
      reply.send("O link de confirmação é inválido ou expirou");
    }
  }
}
