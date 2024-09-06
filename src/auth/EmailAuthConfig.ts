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

// Function to compare the input password with the stored hashed password
function validatePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
  return bcrypt.compare(inputPassword, storedPassword);
}

// Function to generate a JWT token for the user
function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.SECRET_KEY as string, { expiresIn: '1h' });
}

// Function to handle user authentication
async function authenticate(email: string, password: string): Promise<{ user: User; token: string }> {
  const userRepository = new UserRepository(prisma);

  // Retrieve the user by email
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new NotFoundError('Email not found');  // User not found
  }

  // Check if the user is deactivated or scheduled for deletion
  if (user.isDeactivated) {
    // Reactivate the account if it is deactivated
    await userRepository.reactivateUser(user.id);
  } else if (user.deleteScheduledAt) {
    throw new UnauthorizedError('Account is scheduled for deletion');  // Account is marked for deletion
  }

  // Retrieve authentication details for the user
  const auth = await userRepository.findAuthenticationByUserIdAndProvider(user.id, 'email');

  if (!auth || !auth.password) {
    throw new UnauthorizedError('Invalid email or password');  // Authentication details are invalid
  }

  // Validate the input password against the stored password
  const isValidPassword = await validatePassword(password, auth.password);

  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid email or password');  // Password does not match
  }

  // Generate a token for the authenticated user
  const token = generateToken(user.id);
  return { user, token };
}

// Route handler for user authentication
export async function handleAuthenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    // Validate the incoming request
    await validateRequest(request, reply, userAutenticateValidade);

    const { email, password } = request.body as UserBodyData;

    if (!password) {
      throw new BadRequestError('Password is required for login');  // Password is missing
    }

    // Perform authentication
    const result = await authenticate(email, password);

    // Send successful response with user details and token
    reply.status(200).send({
      id: result.user.id,
      token: result.token,
      imageProfile: result.user.imageProfile,
    });
  } catch (error) {
    // Handle errors and send appropriate response
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

// Route handler for user logout
export async function logout(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new BadRequestError('Token is required for logout');  // Token is missing
    }

    // Add token to blacklist to invalidate it
    await addToBlacklist(token);

    // Send successful logout response
    reply.status(200).send({ message: 'Logout successful' });
  } catch (error) {
    // Handle errors and send appropriate response
    reply.code(500).send({ error: error });
  }
}




