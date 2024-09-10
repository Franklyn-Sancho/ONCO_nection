import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '../../config/providers';


export function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.SECRET_KEY as string, { expiresIn: '1h' });
}

export function validatePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
  return bcrypt.compare(inputPassword, storedPassword);
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
  // Find the authentication record by user ID
  const auth = await prisma.authentication.findFirst({
    where: { userId },
  });

  if (!auth) {
    throw new Error("Authentication record not found.");
  }

  // Update the password
  await prisma.authentication.update({
    where: { id: auth.id },
    data: { password: newPassword },
  });
}


export async function addToBlacklist(token: string): Promise<void> {
  await prisma.tokenBlacklist.create({
    data: { token },
  });
}
