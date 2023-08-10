import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import UserRepository from "../repository/UserRepository";
import { User } from "@prisma/client";

export interface IEmailService {
  generateEmailConfirmationToken(user: User): Promise<string>;
  confirmationEmailTemplate(name: string, confirmationLink: string): string;
  sendConfirmationEmail(user: User): Promise<void>,
}

export const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
});

export default class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;
  private userRepository: UserRepository;

  constructor(
    transporter: nodemailer.Transporter,
    userRepository: UserRepository
  ) {
    this.transporter = transporter;
    this.userRepository = userRepository;
  }

  async generateEmailConfirmationToken(user: User): Promise<string> {
    const token = randomBytes(20).toString("hex");

    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.userRepository.updateUser(user.id, {
      emailConfirmationToken: token,
      emailConfirmationExpires: expires,
    });

    return token
  }

  confirmationEmailTemplate(name: string, confirmationLink: string): string {
    return `
      <p>Olá ${name},</p>
      <p>Por favor, clique no link a seguir para confirmar seu email:</p>
      <a href="${confirmationLink}" />
    `;
  }

  async sendConfirmationEmail(user: User) {
    const token = await this.generateEmailConfirmationToken(user)

    const confirmationLink = `http://localhost:3000/confirm-email/${token}`

    const mailOptions = {
      from: "test@test.com",
      to: user.email,
      subject: "Confirmação de registro",
      text: this.confirmationEmailTemplate(user.name, confirmationLink)
    };

    await this.transporter.sendMail(mailOptions);
  }
}
