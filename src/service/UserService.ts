import { PrismaClient, User } from "@prisma/client";
import UserRepository, { UserName } from "../repository/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import EmailService, { IEmailService, transporter } from "../utils/nodemailer";
import { BadRequestError } from "../errors/BadRequestError";
import { getBlockedUsers } from "../utils/getBlockedUsers";

export default class UserService {
  private userRepository: UserRepository;
  private emailService: IEmailService;

  constructor() {
    this.userRepository = new UserRepository();
    this.emailService = new EmailService(transporter, this.userRepository);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async register(user: User): Promise<User> {
    user.password = await this.hashPassword(user.password);

    const createdUser = await this.userRepository.create(user);

    await this.emailService.sendConfirmationEmail(createdUser);

    return createdUser;
  }

  async findUserByName(
    name: string,
    userId: string
  ): Promise<UserName[] | null> {
    // Obtenha a lista de usuários que o usuário bloqueou
    const allBlockedUsers = await getBlockedUsers(userId);

    // Use a função findUserByName na camada de repositório, passando a lista de IDs de usuário bloqueados
    return this.userRepository.findUserByName(name, allBlockedUsers);
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
    const token = jwt.sign({ userId: findUser.id }, process.env.TOKEN_KEY, {
      expiresIn: "1h",
    });

    return { success: true, message: token };
  }

  async blockUser(blockerId: string, blockedId: string) {
    if (blockedId == blockerId)
      throw new BadRequestError("O usuário não pode bloquear a si mesmo");

    await this.userRepository.blockUser(blockerId, blockedId);
  }

  
}
