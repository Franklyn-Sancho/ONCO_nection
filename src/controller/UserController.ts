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
import { handleImageUpload } from "../infrastructure/fileService";
import { sendWelcomeEmail } from "../infrastructure/emailService";

export interface IUserController {
  registerWithEmail(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  findUserByName(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  findUserById(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  findUserProfile(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  handleConfirmEmail(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  blockUser(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  deleteUser(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  deactivateUserHandler(request: FastifyRequest, reply: FastifyReply): Promise<void>
  markUserForDeletionHandler(request: FastifyRequest, reply: FastifyReply): Promise<void>
  permanentlyDeleteUserHandler(request: FastifyRequest, reply: FastifyReply): Promise<void>
}


// Controller class for user-related operations
export default class UserController implements IUserController {

  constructor(private prisma: PrismaClient, private userService: IUserService) { }

  // Handles user registration with email and password
  async registerWithEmail(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      // Validate the request body against predefined rules
      await validateRequest(request, reply, userRegisterValidade);
      const { name, email, description, password } = request.body as UserBodyData;

      if (!password) {
        throw new BadRequestError("Password is required for email registration");
      }

      // Handle image upload and get the file path
      const subDir = "user_profile";
      const filePath = handleImageUpload(request, subDir);

      // Register the user with the provided email and hashed password
      const { emailResult } = await this.userService.registerWithEmail({
        name,
        email,
        description,
        imageProfile: await filePath,
      }, password);

      // Prepare a response message based on the result of email registration
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

  // Finds a user by their ID
  async findUserById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params as FindUserByIdParams;

      // Retrieve user details from the service
      const getUserById = await this.userService.findUserById(id);

      reply.send({
        message: "Users found",
        name: getUserById,
      });
    } catch (error) {
      reply.status(500).send({
        error: `An error has occurred: ${error}`,
      });
    }
  }

  // Finds users by their name
  async findUserByName(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { name } = request.params as FindUserByNameParams;
      const { userId } = request.user as UserParams;

      // Retrieve users by name from the service, excluding blocked users
      const getUserByName = await this.userService.findUserByName(name, userId);

      reply.send({
        message: "Users found",
        content: getUserByName,
      });
    } catch (error) {
      reply.status(500).send({
        error: `An error has occurred: ${error}`,
      });
    }
  }

  // Finds user profiles by name
  async findUserProfile(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { name } = request.params as FindUserByNameParams;
      const { userId } = request.user as UserParams;

      // Retrieve user profiles from the service
      const getUserProfile = await this.userService.findProfileUser(name, userId);

      reply.send({
        message: "Profiles found",
        content: getUserProfile,
      });
    } catch (error) {
      reply.status(500).send({
        error: `An error has occurred: ${error}`,
      });
    }
  }

  // Confirms the user's email using a confirmation token
  async handleConfirmEmail(request: FastifyRequest, reply: FastifyReply) {
    const token = (request.params as any).token;

    if (typeof token !== "string") {
      reply.send("Invalid or expired confirmation link");
      return;
    }

    // Encontrar o usuário pelo token de confirmação de email
    const user = await this.prisma.user.findUnique({
      where: { emailConfirmationToken: token },
    });

    if (
      user &&
      user.emailConfirmationExpires &&
      user.emailConfirmationExpires > new Date()
    ) {
      // Atualizar o status de confirmação de email do usuário
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailConfirmed: true,
        },
      });

      const emailResult = await sendWelcomeEmail(user);

      if (emailResult.success) {
        reply.send("Email confirmed successfully and welcome email sent.");
      } else {
        reply.send("Email confirmed successfully, but failed to send welcome email.");
      }
      reply.send("Invalid or expired confirmation link");
    }
  }


  async handleResetPasswordEmail(request: FastifyRequest, reply: FastifyReply) {
    const token = (request.params as any).token;

    if (typeof token !== "string") {
      reply.send("Invalid or expired confirmation link");
      return;
    }

    // Find the user by email confirmation token
    const user = await this.prisma.user.findUnique({
      where: { resetPasswordToken: token },
    });

    if (
      user &&
      user.resetPasswordExpires &&
      user.resetPasswordExpires > new Date()
    ) {

      reply.code(201).send({
        message: "token created sucessfully",
        token: request.params
      })
    } else {
      reply.send("Invalid or expired reset password link");
    }
  }

  // Blocks a user
  async blockUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId: blockerId } = request.user as UserParams;
      const { blockedId } = request.params as any;

      // Create a block record using the service
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

  // Deletes a user account
  async deleteUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { userId } = request.user as UserParams

      // Delete the user account using the service
      await this.userService.deleteUser(userId)

      reply.status(200).send({
        message: "User was deleted successfully",
      });
    }
    catch (error) {
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

  // Deactivates a user account
  async deactivateUserHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { userId } = request.user as UserParams

      // Deactivate the user account using the service
      await this.userService.deactivateUser(userId);

      reply.status(200).send({ message: "User account deactivated successfully." });
    } catch (error) {
      reply.status(500).send({ error: "Failed to deactivate user account." });
    }
  }

  // Marks a user account for deletion
  async markUserForDeletionHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { userId } = request.user as UserParams

      // Mark the user account for deletion using the service
      await this.userService.markUserForDeletion(userId);

      reply.status(200).send({ message: "User account marked for deletion successfully." });
    } catch (error) {
      reply.status(500).send({ error: "Failed to mark user account for deletion." });
    }
  }

  // Processes scheduled user deletions
  async permanentlyDeleteUserHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      // Process scheduled deletions
      await this.userService.processScheduledDeletions();

      reply.status(200).send({ message: "User accounts that were scheduled for deletion have been processed." });
    } catch (error) {
      reply.status(500).send({ error: "Failed to process scheduled deletions." });
    }
  }
}
