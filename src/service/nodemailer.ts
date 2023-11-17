import nodemailer from "nodemailer";
import UserRepository from "../repository/UserRepository";
import { randomBytes } from "crypto";
import { User } from "@prisma/client";
import Mail from "nodemailer/lib/mailer";

//test: ~/go/bin/MailHog

export interface IEmailService {
  generateEmailConfirmationToken(user: User): Promise<string>;
  confirmationEmailTemplate(name: string, confirmationLink: string): string;
  sendConfirmationEmail(user: User): Promise<{ success: boolean; message: string }>;
}

export const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
});

export default class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;
  private userRepository: UserRepository;
  private emailQueue: Mail.Options[] = [];

  constructor(
    transporter: nodemailer.Transporter,
    userRepository: UserRepository
  ) {
    this.transporter = transporter;
    this.userRepository = userRepository;
    this.startEmailServiceCheck();
  }

  private startEmailServiceCheck() {
    setInterval(this.tryProcessEmailQueue.bind(this), 60000);
  }

  private async tryProcessEmailQueue() {
    try {
      await this.transporter.verify();
      await this.processEmailQueue();
    } catch (error) {
      console.error("the email service is unavailable");
    }
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
      <a href="${confirmationLink}" />
    `;
  }

  async sendConfirmationEmail(user: User) {
    const token = await this.generateEmailConfirmationToken(user);

    const confirmationLink = `http://localhost:3000/confirm-email/${token}`;

    const mailOptions = {
      from: "test@test.com",
      to: user.email,
      subject: "Confirmação de registro",
      text: this.confirmationEmailTemplate(user.name, confirmationLink),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        message: "confirmation email was sent successfully",
      };
    } catch (error) {
      this.emailQueue.push(mailOptions);
      return {
        success: false,
        message:
          "User registered successfully, but confirmation email could not be sent",
      };
    }
  }

  async processEmailQueue() {
    while (this.emailQueue.length > 0) {
      const mailOptions = this.emailQueue.shift();
      if (mailOptions !== undefined) {
        try {
          await this.transporter.sendMail(mailOptions);
          console.log("confirmation email was sent successfully");
        } catch (error) {
          this.emailQueue.unshift(mailOptions);
          break;
        }
      } else {
        console.log("mailOptions é undefined");
      }
    }
  }
}
