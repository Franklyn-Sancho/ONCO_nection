import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
})

export default class EmailService {

  private transporter: nodemailer.Transporter;

  constructor(transporter: nodemailer.Transporter) {
    this.transporter = transporter
  }

  async sendConfirmationEmail(email: string) {
    const mailOptions = {
      from: "test@test.com",
      to: email,
      subject: "Confirmação de registro",
      text: "Seja muito bem vindo"
    }

    await this.transporter.sendMail(mailOptions)
  }
}