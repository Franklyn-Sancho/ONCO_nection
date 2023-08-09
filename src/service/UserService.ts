import { User } from "@prisma/client";
import UserRepository from "../repository/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import EmailService, { IEmailService, transporter } from "../utils/nodemailer";

//service user classes
export default class UserService {
  private userRepository: UserRepository; //object instance userRepository
  private emailService: IEmailService;

  constructor() {
    this.userRepository = new UserRepository();
    this.emailService = new EmailService(transporter, this.userRepository)
  }

  //service layer create new user
  async register(user: User): Promise<User> {
    user.password = await this.hashPassword(user.password);

    const createdUser = await this.userRepository.create(user);

    await this.emailService.sendConfirmationEmail(createdUser)

    return createdUser;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async authenticate(
    user: User
  ): Promise<{ success: boolean; message: string }> {
    const findUser = await this.userRepository.findByEmail(user.email);

    if (!findUser) {
      return { success: false, message: "email não encontrado" };
    }

    const ValidPassword = await bcrypt.compare(
      user.password,
      findUser.password
    );

    if (!ValidPassword) {
      return { success: false, message: "email ou senha inválidos" };
    }

    //return a token by jwt.sign
    const token = jwt.sign({ userId: user.id }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    return { success: true, message: token };
  }
}
