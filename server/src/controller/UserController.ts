import { FastifyReply, FastifyRequest } from "fastify";
import { IUserService } from "../service/UserService";
import { PrismaClient, User } from "@prisma/client";
import {
  userRegisterValidade,
  userAutenticateValidade,
} from "../utils/userValidations";
import { validateRequest } from "../utils/validateRequest";
import { CreateUserData, UserParams } from "../types/usersTypes";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { handleImageUpload } from "../service/FileService";

export interface IUserController {
  register(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  findUserByName(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  authenticate(
    request: FastifyRequest<{ Body: User }>,
    reply: FastifyReply
  ): Promise<void>;
  confirmEmail(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  blockUser(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

//class user controller
export default class UserController implements IUserController {
  private prisma: PrismaClient;
  private userService: IUserService;

  constructor(prisma: PrismaClient, userService: IUserService) {
    this.prisma = prisma;
    this.userService = userService;
  }

  async register(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await validateRequest(request, reply, userRegisterValidade);

      const { name, email, password } = request.body as CreateUserData;

      const base64Image = await handleImageUpload(request);

      await this.userService.register({
        name,
        email,
        password,
        image: base64Image,
      });
      reply.status(201).send({
        message: "Registro feito com sucesso",
      });
    } catch (error) {
      reply.status(500).send({
        message: "verifique seus dados",
      });
    }
  }

  async findUserByName(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { name } = request.params as any;
      const { userId } = request.user as UserParams;

      const getUserByName = await this.userService.findUserByName(name, userId);

      reply.send({
        message: "usuários encontrados",
        content: getUserByName,
      });
    } catch (error) {
      reply.status(500).send({
        error: `ocorreu um erro: ${error}`,
      });
    }
  }

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
    const user = await this.prisma.user.findUnique({
      where: { emailConfirmationToken: token },
    });

    if (
      user &&
      user.emailConfirmationExpires &&
      user.emailConfirmationExpires > new Date()
    ) {
      await this.prisma.user.update({
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

  async blockUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId: blockerId } = request.user as UserParams;
      const { blockedId } = request.params as any;

      await this.userService.blockUser(blockerId, blockedId);

      reply.status(200).send({
        message: "Usuário bloqueado com sucesso",
      });
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        reply.code(error.statusCode).send({
          error: error.message,
        });
      } else {
        console.log(request.body);
        reply.code(500).send({
          error: error,
        });
      }
    }
  }
}
