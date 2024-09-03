import { FastifyReply, FastifyRequest } from "fastify";
import { IUserService } from "../service/UserService";
import { PrismaClient, User } from "@prisma/client";
import {
  userRegisterValidade,
  userAutenticateValidade,
} from "../utils/userValidations";
import { validateRequest } from "../utils/validateRequest";
import { FindUserByIdParams, FindUserByNameParams, UserBodyData, UserParams } from "../types/usersTypes";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { handleImageUpload } from "../service/FileService";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export interface IUserController {
  registerWithEmail(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  findUserByName(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  findUserById(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  findUserProfile(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  confirmEmail(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  blockUser(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}


//class user controller
export default class UserController implements IUserController {

  constructor(private prisma: PrismaClient, private userService: IUserService) { }

  async registerWithEmail(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await validateRequest(request, reply, userRegisterValidade);
      const { name, email, description, password } = request.body as UserBodyData;

      if (!password) {
        throw new BadRequestError("Password is required for email registration");
      }

      const subDir = "user_profile";
      const filePath = await handleImageUpload(request, subDir);

      const { emailResult } = await this.userService.registerWithEmail({
        name,
        email,
        description,
        imageProfile: filePath,
      }, password);

      const message = emailResult.success
        ? "Registration successful, check your email"
        : "Registration successful, confirmation email will be sent as soon as the system returns to normal";

      reply.status(201).send({ message });
    } catch (error) {
      if (error instanceof BadRequestError) {
        reply.status(error.statusCode).send({ message: error.message });
      } else {
        reply.status(500).send({
          error: `An error occurred: ${error}`
        });
      }
    }
  }

  async findUserById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params as FindUserByIdParams;

      const getUserById = await this.userService.findUserById(id);

      reply.send({
        message: "Users found",
        name: getUserById,
      });
    } catch (error) {
      reply.status(500).send({
        error: `an error has occurred: ${error}`,
      });
    }
  }

  async findUserByName(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { name } = request.params as FindUserByNameParams;
      const { userId } = request.user as UserParams;

      const getUserByName = await this.userService.findUserByName(name, userId);

      reply.send({
        message: "Users found",
        content: getUserByName,
      });
    } catch (error) {
      reply.status(500).send({
        error: `an error has occurred: ${error}`,
      });
    }
  }

  async findUserProfile(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { name } = request.params as FindUserByNameParams;
      const { userId } = request.user as UserParams;

      const getUserProfile = await this.userService.findProfileUser(name, userId);

      reply.send({
        message: "Profiles found",
        content: getUserProfile,
      });
    } catch (error) {
      reply.status(500).send({
        error: `an error has occurred: ${error}`,
      });
    }
  }

  async confirmEmail(request: FastifyRequest, reply: FastifyReply) {
    const token = (request.params as any).token;

    if (typeof token !== "string") {
      reply.send("Invalid or expired confirmation link");
      return;
    }

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

      reply.send("email confirmed successfully");
    } else {
      reply.send("Invalid or expired confirmation link");
    }
  }

  async blockUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId: blockerId } = request.user as UserParams;
      const { blockedId } = request.params as any;

      await this.userService.blockUser(blockerId, blockedId);

      reply.status(200).send({
        message: "User was blocked successfully",
      });
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        reply.code(error.statusCode).send({
          error: error.message,
        });
      } else {
        reply.code(500).send({
          error: error,
        });
      }
    }
  }
}
