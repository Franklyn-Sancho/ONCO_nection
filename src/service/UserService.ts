import { User } from "@prisma/client";
import { IUserRepository, UserName } from "../repository/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IEmailService } from "../utils/nodemailer";
import { BadRequestError } from "../errors/BadRequestError";
import { getBlockedUsers } from "../utils/getBlockedUsers";
import { NotFoundError } from "../errors/NotFoundError";
import { CreateUserData } from "../types/usersTypes";

export interface IUserService {
  register(user: CreateUserData): Promise<User>;
  findUserByName(name: string, userId: string): Promise<UserName[] | null>;
  authenticate(user: User): Promise<{ success: boolean; message: string }>;
  blockUser(blockerId: string, blockedId: string): Promise<void>;
}

export default class UserService implements IUserService {
  private userRepository: IUserRepository;
  private emailService: IEmailService;

  constructor(userRepository: IUserRepository, emailService: IEmailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async register(user: CreateUserData): Promise<User> {
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
    const onlyNonBlockingUsers = await getBlockedUsers(userId);

    // Use a função findUserByName na camada de repositório, passando a lista de IDs de usuário bloqueados
    return this.userRepository.findUserByName(name, onlyNonBlockingUsers);
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
    const existingUser = await this.userRepository.findUserById(blockedId);

    if (!existingUser)
      throw new NotFoundError("Nenhum usuário com esse ID foi encontrado");

    const existingBlock = await this.userRepository.findUserBlockRecord(
      blockerId,
      blockedId
    );

    if (existingBlock)
      throw new BadRequestError("Você já bloqueou esse usuário");

    if (blockedId == blockerId)
      throw new BadRequestError("O usuário não pode bloquear a si mesmo");

    await this.userRepository.blockUser(blockerId, blockedId);
  }
}
