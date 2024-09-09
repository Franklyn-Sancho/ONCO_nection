import { FastifyInstance } from "fastify";
import { handleAuthenticate } from "../auth/email/emailAuthController";
import { authenticate } from "../plugins/authenticate";
import { userController } from "../utils/providers";

