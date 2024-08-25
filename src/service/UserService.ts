import { User } from "@prisma/client";
import { IUserRepository, UserName } from "../repository/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IEmailService } from "./nodemailer";
import { BadRequestError } from "../errors/BadRequestError";
import { getBlockedUsers } from "../utils/getBlockedUsers";
import { NotFoundError } from "../errors/NotFoundError";
import { CreateUserData } from "../types/usersTypes";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export interface IUserService {
  register(user: CreateUserData): Promise<{user: User, emailResult: any}>;
  findUserByName(name: string, userId: string): Promise<UserName[] | null>;
  findUserById(id: string): Promise<UserName | null>
  authenticate(email: string, password: string): Promise<{ user: User, token: string }>;
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

  async register(user: CreateUserData): Promise<{user: User, emailResult: any}> {

    user.password = await this.hashPassword(user.password);

    const createdUser = await this.userRepository.create(user);

    const emailResult = await this.emailService.sendConfirmationEmail(createdUser);

    return { user: createdUser, emailResult };
  }

  async findUserById(id: string) {
    return await this.userRepository.findUserById(id)
  }

  async findUserByName(
    name: string,
    userId: string
  ): Promise<UserName[] | null> {
    // Obtenha a lista de usuários bloqueados
    const onlyNonBlockingUsers = await getBlockedUsers(userId);

    return this.userRepository.findUserByName(name, onlyNonBlockingUsers);
  }

  async authenticate(email: string, password: string): Promise<{ user: User, token: string }> {
    const findUser = await this.userRepository.findByEmail(email);

    if (!findUser) {
      throw new NotFoundError("Email not found");
    }

    const ValidPassword = await bcrypt.compare(password, findUser.password);

    if (!ValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = jwt.sign({ userId: findUser.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return { user: { ...findUser }, token };
  }

  async blockUser(blockerId: string, blockedId: string) {
    const existingUser = await this.userRepository.findUserById(blockedId);

    if (!existingUser)
      throw new NotFoundError("no user with this id was found");

    const existingBlock = await this.userRepository.findUserBlockRecord(
      blockerId,
      blockedId
    );

    if (existingBlock)
      throw new BadRequestError("this user is already blocked");

    if (blockedId == blockerId)
      throw new BadRequestError("you can not to block yourself");

    await this.userRepository.blockUser(blockerId, blockedId);
  }
}
