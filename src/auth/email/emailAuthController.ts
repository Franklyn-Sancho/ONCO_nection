import { FastifyRequest, FastifyReply } from 'fastify';
import { authenticate, requestPasswordReset, resetUserPassword } from './emailAuthService';
import { BadRequestError } from '../../errors/BadRequestError';
import { addToBlacklist } from './emailAuth';

export async function handleAuthenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const { email, password } = request.body as { email: string; password: string };
    if (!password) throw new Error('Password is required for login');

    const result = await authenticate(email, password);
    reply.status(200).send({
      id: result.user.id,
      token: result.token,
      imageProfile: result.user.imageProfile,
    });
  } catch (error) {
    if (error instanceof Error) {
      reply.code(error instanceof Error ? 400 : 500).send({ error: error.message });
    }
  }
}

export async function handleRequestPasswordReset(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const { email } = request.body as { email: string };
    await requestPasswordReset(email);
    reply.status(200).send({ message: 'Password reset email sent' });
  } catch (error) {
    reply.code(400).send({ error: error });
  }
}

export async function handleResetPassword(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    // Extract token and new password from the request body
    const { token, newPassword } = request.body as { token: string; newPassword: string };

    // Call the service function to reset the password
    await resetUserPassword(token, newPassword);

    // Send a success response
    reply.status(200).send({ message: 'Password has been successfully updated.' });
  } catch (error) {
    // Error handling
    if (error instanceof Error) {
      // Handle known errors
      if (error.message === 'Invalid or expired token.') {
        reply.status(400).send({ error: 'Invalid or expired token.' });
      } else if (error.message === 'Token has expired.') {
        reply.status(400).send({ error: 'Token has expired.' });
      } else if (error.message === 'The new password does not meet security criteria.') {
        reply.status(400).send({ error: 'The new password does not meet security criteria.' });
      } else {
        reply.status(500).send({ error: 'An unexpected error occurred.' });
      }
    } else {
      // Handle unexpected error types
      reply.status(500).send({ error: 'An unexpected error occurred.' });
    }
  }
}

export async function Handlelogout(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new BadRequestError('Token is required for logout');

    // Add token to blacklist to invalidate it
    await addToBlacklist(token);

    // Send successful response
    reply.status(200).send({ message: 'Logout successful' });
  } catch (error) {
    if (error instanceof Error) {
      reply.code(500).send({ error: error.message });
    }
  }
}