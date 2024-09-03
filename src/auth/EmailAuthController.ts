import { FastifyReply, FastifyRequest } from "fastify";
import { validateRequest } from "../utils/validateRequest";
import { userAutenticateValidade } from "../utils/userValidations";
import { BadRequestError } from "../errors/BadRequestError";
import { UserBodyData } from "../types/usersTypes";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import EmailAuthService from "./EmailAuthService";

export default class EmailAuthController {
  constructor(private emailAuthService: EmailAuthService) {}

  async authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await validateRequest(request, reply, userAutenticateValidade);

      const { email, password } = request.body as UserBodyData;

      if (!password) {
        throw new BadRequestError("Password is required for login");
      }

      const result = await this.emailAuthService.authenticate(email, password);

      reply.status(200).send({
        id: result.user.id,
        token: result.token,
        imageProfile: result.user.imageProfile,
      });
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
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
