import { User } from "@prisma/client";
import { prisma, userRepository } from "../../utils/providers";
import { generateToken, updateUserPassword, validatePassword } from "./emailAuth";
import bcrypt from 'bcryptjs'
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { NotFoundError } from "../../errors/NotFoundError";
import { generateResetToken, sendResetPasswordEmail } from "../../infrastructure/emailService";


export async function authenticate(email: string, password: string): Promise<{ user: User; token: string }> {

    // Retrieve the user by email
    const user = await userRepository.findByEmail(email);
    if (!user) throw new NotFoundError('Email not found');

    // Check if the user is deactivated or scheduled for deletion
    if (user.isDeactivated) {
        await userRepository.reactivateUser(user.id);
    } else if (user.deleteScheduledAt) {
        throw new UnauthorizedError('Account is scheduled for deletion');
    }

    // Retrieve authentication details for the user
    const auth = await userRepository.findAuthenticationByUserIdAndProvider(user.id, 'email');
    if (!auth || !auth.password) throw new UnauthorizedError('Invalid email or password');

    // Validate the password
    const isValidPassword = await validatePassword(password, auth.password);
    if (!isValidPassword) throw new UnauthorizedError('Invalid email or password');

    // Generate a token for the authenticated user
    const token = generateToken(user.id);
    return { user, token };
}

export async function requestPasswordReset(email: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Email not found");

    await generateResetToken(user);
    const result = await sendResetPasswordEmail(user);

    return result.success ? "Password reset email sent" : "Failed to send password reset email";
}


export async function resetUserPassword(token: string, newPassword: string): Promise<void> {

    // Verify the reset token
    const user = await userRepository.findByResetToken(token);
    if (!user) throw new Error("Invalid or expired token.");

    // Check if the token has expired
    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
        throw new Error("Token has expired.");
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await updateUserPassword(user.id, hashedNewPassword);

    // Clear the reset token and expiry date
    await userRepository.updateUser(user.id, {
        resetPasswordToken: null,
        resetPasswordExpires: null,
    });
}