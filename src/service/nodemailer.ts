import nodemailer, { Transporter } from "nodemailer";
import { randomBytes } from "crypto";
import { User } from "@prisma/client";
import UserRepository from "../repository/UserRepository";
import { getRabbitChannel, initRabbitMQ, RABBITMQ_QUEUE_NAME } from './rabbitmqConfig';

//test: ~/go/bin/MailHog

// Define a interface que especifica os métodos disponíveis no serviço de email
export interface IEmailService {
  generateEmailConfirmationToken(user: User): Promise<string>;
  confirmationEmailTemplate(name: string, confirmationLink: string): string;
  sendConfirmationEmail(user: User): Promise<{ success: boolean; message: string }>;
  processEmailQueue(): Promise<void>; // Adicionado para refletir o método público
}

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
});

export default class EmailService implements IEmailService {
  private readonly transporter: Transporter;
  private readonly userRepository: UserRepository;

  constructor(transporter: Transporter, userRepository: UserRepository) {
    this.transporter = transporter;
    this.userRepository = userRepository;
    this.initialize(); // Inicializa RabbitMQ e começa a processar a fila
  }

  // Inicializa RabbitMQ e começa a processar a fila
  private async initialize(): Promise<void> {
    try {
      await initRabbitMQ(); // Inicializa RabbitMQ
      this.processEmailQueue(); // Começa a processar a fila
    } catch (error) {
      console.error('Failed to initialize RabbitMQ:', error);
    }
  }

  // Gera um token de confirmação de email para o usuário
  async generateEmailConfirmationToken(user: User): Promise<string> {
    const token = randomBytes(20).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.userRepository.updateUser(user.id, {
      emailConfirmationToken: token,
      emailConfirmationExpires: expires,
    });

    return token;
  }

  // Gera o template de email de confirmação
  confirmationEmailTemplate(name: string, confirmationLink: string): string {
    return `
      <p>Olá ${name},</p>
      <p>Por favor, clique no link a seguir para confirmar seu email:</p>
      <a href="${confirmationLink}">Confirmar Email</a>
    `;
  }

  // Envia um email de confirmação para o usuário
  async sendConfirmationEmail(user: User): Promise<{ success: boolean; message: string }> {
    const token = await this.generateEmailConfirmationToken(user);
    const confirmationLink = `http://localhost:3333/confirm-email/${token}`;

    const mailOptions = {
      from: 'test@test.com',
      to: user.email,
      subject: 'Confirmação de registro',
      text: this.confirmationEmailTemplate(user.name, confirmationLink),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Confirmation email was sent successfully' };
    } catch (error) {
      console.error('Failed to send confirmation email, queuing for retry:', error);
      const rabbitChannel = getRabbitChannel();
      if (rabbitChannel) {
        rabbitChannel.sendToQueue(RABBITMQ_QUEUE_NAME, Buffer.from(JSON.stringify(mailOptions)), { persistent: true });
      }
      return { success: false, message: 'User registered successfully, but confirmation email could not be sent' };
    }
  }

  // Processa as mensagens na fila do RabbitMQ
  async processEmailQueue(): Promise<void> {
    const rabbitChannel = getRabbitChannel();
    if (!rabbitChannel) {
      console.error('RabbitMQ channel is not initialized');
      return;
    }

    const retryInterval = 30000; // Intervalo de retry em milissegundos (30 segundos)

    rabbitChannel.consume(RABBITMQ_QUEUE_NAME, async (msg) => {
      if (msg) {
        const mailOptions = JSON.parse(msg.content.toString());

        try {
          await this.transporter.sendMail(mailOptions);
          console.log('Confirmation email sent successfully');
          rabbitChannel.ack(msg); // Confirmação de processamento bem-sucedido
        } catch (error) {
          console.error('Failed to send email, retrying...', error);
          setTimeout(() => rabbitChannel.nack(msg, false, true), retryInterval); // Retry após o intervalo
        }
      }
    }, { noAck: false });
  }
}