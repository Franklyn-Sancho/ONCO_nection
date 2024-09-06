import nodemailer, { Transporter } from 'nodemailer';
import { randomBytes } from "crypto";
import { User } from "@prisma/client";
import UserRepository from "../repository/UserRepository";
import { getRabbitChannel, initRabbitMQ, RABBITMQ_QUEUE_NAME } from './rabbitmqService';

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

export default class EmailService {
  private transporter: Transporter;
  private userRepository: UserRepository;

  constructor(
    transporter: Transporter,
    userRepository: UserRepository
  ) {
    this.transporter = transporter;
    this.userRepository = userRepository;
    this.initialize();
  }

  private async initialize() {
    await initRabbitMQ();
    this.processEmailQueue();
  }

  async generateEmailConfirmationToken(user: User): Promise<string> {
    const token = randomBytes(20).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.userRepository.updateUser(user.id, {
      emailConfirmationToken: token,
      emailConfirmationExpires: expires,
    });

    return token;
  }

  confirmationEmailTemplate(name: string, confirmationLink: string): string {
    return `
      <p>Olá ${name},</p>
      <p>Por favor, clique no link a seguir para confirmar seu email:</p>
      <a href="${confirmationLink}">Confirmar Email</a>
    `;
  }

  welcomeEmailTemplate(name: string): string {
    return `
      <p>Olá ${name},</p>
      <p>Bem-vindo(a)! Agora você tem acesso a todas as nossas funcionalidades.</p>
      <p>Estamos felizes em tê-lo(a) conosco!</p>
      <p>Se precisar de ajuda, não hesite em nos contatar.</p>
      <p>Atenciosamente, Equipe ONCO_nection.</p>
    `;
  }

  async sendConfirmationEmail(user: User) {
    const token = await this.generateEmailConfirmationToken(user);
    const confirmationLink = `http://localhost:3333/confirm-email/${token}`;

    const mailOptions = {
      from: "test@test.com",
      to: user.email,
      subject: "Confirmação de registro",
      html: this.confirmationEmailTemplate(user.name, confirmationLink),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        message: "Confirmation email was sent successfully",
      };
    } catch (error) {
      const rabbitChannel = getRabbitChannel();
      if (rabbitChannel) {
        rabbitChannel.sendToQueue(RABBITMQ_QUEUE_NAME, Buffer.from(JSON.stringify(mailOptions)), { persistent: true });
      }
      return {
        success: false,
        message: "User registered successfully, but confirmation email could not be sent",
      };
    }
  }

  async sendWelcomeEmail(user: User) {
    const mailOptions = {
      from: "test@test.com",
      to: user.email,
      subject: "Bem-vindo(a) à ONCO_nection!",
      html: this.welcomeEmailTemplate(user.name),
    };

    try {
      await this.transporter.sendMail(mailOptions);
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

  async processEmailQueue() {
    const rabbitChannel = getRabbitChannel();
    if (!rabbitChannel) {
      console.error('RabbitMQ channel is not initialized');
      return;
    }

    rabbitChannel.consume(RABBITMQ_QUEUE_NAME, async (msg) => {
      if (msg) {
        const mailOptions = JSON.parse(msg.content.toString());

        try {
          await this.transporter.sendMail(mailOptions);
          console.log("Confirmation email was sent successfully");
          rabbitChannel.ack(msg);
        } catch (error) {
          console.error("Failed to send email, retrying...", error);
          rabbitChannel.nack(msg);
        }
      }
    }, { noAck: false });
  }
}