import nodemailer from 'nodemailer';
import { randomBytes } from "crypto";
import { User } from "@prisma/client";
import { getRabbitChannel, RABBITMQ_QUEUE_NAME } from './rabbitmqService';
import { userRepository } from '../config/providers';

export interface IEmailService {
  generateEmailConfirmationToken(user: User): Promise<string>;
  confirmationEmailTemplate(name: string, confirmationLink: string): string;
  sendConfirmationEmail(user: User): Promise<{ success: boolean; message: string }>;
  sendWelcomeEmail(user: User): Promise<{ success: boolean; message: string }>; // Adicione essa função na interface
}

export const transporter = nodemailer.createTransport({
  host: "mailhog",
  port: 1025,
});

export async function generateEmailConfirmationToken(user: User): Promise<string> {
  const token = randomBytes(20).toString("hex");
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);

  await userRepository.updateUser(user.id, {
    emailConfirmationToken: token,
    emailConfirmationExpires: expires,
  });

  return token;
}

export async function generateResetToken(user: User): Promise<string> {
  const token = randomBytes(20).toString("hex");
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);

  try {
    await userRepository.updateUser(user.id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });
  } catch (error) {
    throw new Error(`Failed to update user with reset token: ${error}`);
  }

  // Retorne o token gerado
  return token;
}

export function confirmationEmailTemplate(name: string, confirmationLink: string): string {
  return `
    <p>Olá ${name},</p>
    <p>Por favor, clique no link a seguir para confirmar seu email:</p>
    <a href="${confirmationLink}">Confirmar Email</a>
  `;
}

export function welcomeEmailTemplate(name: string): string {
  return `
    <p>Olá ${name},</p>
    <p>Bem-vindo(a)! Agora você tem acesso a todas as nossas funcionalidades.</p>
    <p>Estamos felizes em tê-lo(a) conosco!</p>
    <p>Se precisar de ajuda, não hesite em nos contatar.</p>
    <p>Atenciosamente, Equipe ONCO_nection.</p>
  `;
}

export function resetPasswordEmailTemplate(name: string, resetLink: string): string {
  return `
    <p>Olá ${name},</p>
    <p>Recebemos uma solicitação para redefinir sua senha. Se você não fez essa solicitação, por favor ignore este e-mail.</p>
    <p>Para redefinir sua senha, clique no link abaixo:</p>
    <a href="${resetLink}">Redefinir Senha</a>
    <p>Este link é válido por 1 hora.</p>
    <p>Atenciosamente, Equipe ONCO_nection.</p>
  `;
}

export async function sendConfirmationEmail(user: User): Promise<{ success: boolean; message: string }> {
  const confirmationTokenEmail = await generateEmailConfirmationToken(user);
  const confirmationLink = `http://localhost:3333/confirm-email/${confirmationTokenEmail}`;

  const mailOptions = {
    from: "test@test.com",
    to: user.email,
    subject: "Confirmação de registro",
    html: confirmationEmailTemplate(user.name, confirmationLink),
  };

  try {
    const rabbitChannel = getRabbitChannel();
    if (rabbitChannel) {
      // Envia o email para a fila do RabbitMQ
      rabbitChannel.sendToQueue(RABBITMQ_QUEUE_NAME, Buffer.from(JSON.stringify(mailOptions)), { persistent: true });
      return {
        success: true,
        message: "User registered successfully and email queued for sending",
      };
    } else {
      console.error('RabbitMQ channel is not available');
      return {
        success: false,
        message: "Failed to queue confirmation email",
      };
    }
  } catch (error) {
    console.error("Failed to queue confirmation email:", error);
    return {
      success: false,
      message: "User registered successfully, but confirmation email could not be queued",
    };
  }
}


export async function sendResetPasswordEmail(user: User) {
  // Gere o token de redefinição de senha
  const resetPasswordToken = await generateResetToken(user);
  const resetLink = `http://localhost:3333/auth/reset-password/${resetPasswordToken}`;

  const mailOptions = {
    from: "test@test.com",
    to: user.email,
    subject: "Redefinição de Senha",
    html: resetPasswordEmailTemplate(user.name, resetLink),
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Reset password email was sent successfully",
    };
  } catch (error) {
    const rabbitChannel = getRabbitChannel();
    if (rabbitChannel) {
      rabbitChannel.sendToQueue(RABBITMQ_QUEUE_NAME, Buffer.from(JSON.stringify(mailOptions)), { persistent: true });
    }
    return {
      success: false,
      message: "Failed to send reset password email",
    };
  }
}


export async function sendWelcomeEmail(user: User) {
  const mailOptions = {
    from: "test@test.com",
    to: user.email,
    subject: "Bem-vindo(a) à ONCO_nection!",
    html: welcomeEmailTemplate(user.name),
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Welcome email was sent successfully",
    };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return {
      success: false,
      message: "Failed to send welcome email",
    };
  }
}

export async function processEmailQueue() {
  const rabbitChannel = getRabbitChannel();
  if (!rabbitChannel) {
    console.error('RabbitMQ channel is not initialized');
    return;
  }

  rabbitChannel.consume(RABBITMQ_QUEUE_NAME, async (msg) => {
    if (msg) {
      const mailOptions = JSON.parse(msg.content.toString());

      try {
        await transporter.sendMail(mailOptions);
        console.log("Confirmation email was sent successfully");
        rabbitChannel.ack(msg);
      } catch (error) {
        console.error("Failed to send email, retrying...", error);
        rabbitChannel.nack(msg);
      }
    }
  }, { noAck: false });
}