import { PrismaClient, User } from "@prisma/client";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserRepository from "../repository/UserRepository";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { validateRequest } from "../utils/validateRequest";
import { userAutenticateValidade } from "../utils/userValidations";
import { BadRequestError } from "../errors/BadRequestError";
import { UserBodyData } from "../types/usersTypes";


const prisma = new PrismaClient();

async function addToBlacklist(token: string): Promise<void> {
  await prisma.tokenBlacklist.create({
    data: {
      token,
    },
  });
}

// Funções de Autenticação
function validatePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
  return bcrypt.compare(inputPassword, storedPassword);
}

function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.SECRET_KEY as string, { expiresIn: '1h' });
}

async function authenticate(email: string, password: string): Promise<{ user: User; token: string }> {
  const userRepository = new UserRepository(prisma);

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new NotFoundError('Email not found');
  }

  const auth = await userRepository.findAuthenticationByUserIdAndProvider(user.id, 'email');

  if (!auth || !auth.password) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isValidPassword = await validatePassword(password, auth.password);

  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = generateToken(user.id);
  return { user, token };
}

// Handlers de Rotas
export async function handleAuthenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await validateRequest(request, reply, userAutenticateValidade);

    const { email, password } = request.body as UserBodyData;

    if (!password) {
      throw new BadRequestError('Password is required for login');
    }

    const result = await authenticate(email, password);

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

export async function logout(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new BadRequestError('Token is required for logout');
    }

    await addToBlacklist(token);

    reply.status(200).send({ message: 'Logout successful' });
  } catch (error) {
    reply.code(500).send({ error: error });
  }
}



