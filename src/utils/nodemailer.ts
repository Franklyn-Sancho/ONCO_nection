import nodemailer from "nodemailer";

export class Nodemailer {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.PASS_ACCOUNT,
      },
    });
  }

  async sendConfirmationEmail(email: string) {
    const mailOptions = {
      from: process.env.EMAIL_ACCOUNT,
      to: email,
      subject: `Seja muito bem vindo, ${""}`,
      text: "Clique no link para confirmar o seu email",
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("email enviado: ", info.response);
      }
    });
  }
}
