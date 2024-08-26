import { User } from "@prisma/client";
import { IUserRepository, UserProfile } from "../repository/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IEmailService } from "./nodemailer";
import { BadRequestError } from "../errors/BadRequestError";
import { getBlockedUsers } from "../utils/getBlockedUsers";
import { NotFoundError } from "../errors/NotFoundError";

import { UnauthorizedError } from "../errors/UnauthorizedError";
import { UserBodyData } from "../types/usersTypes";

export interface IUserService {
  register(user: UserBodyData): Promise<{user: User, emailResult: any}>;
  findUserByName(name: string, userId: string): Promise<UserProfile[] | null>;
  findUserById(id: string): Promise<UserProfile | null>
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
    return bcrypt.hash(password, 10);
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "1h" });
  }

  private async validatePassword(
    inputPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  async register(user: UserBodyData): Promise<{ user: User; emailResult: any }> {
    user.password = await this.hashPassword(user.password);

    const createdUser = await this.userRepository.create(user);
    const emailResult = await this.emailService.sendConfirmationEmail(createdUser);

    return { user: createdUser, emailResult };
  }

  findUserById(id: string): Promise<UserProfile | null> {
    return this.userRepository.findUserById(id);
  }

  async findUserByName(name: string, userId: string): Promise<UserProfile[] | null> {
    const blockedUsers = await getBlockedUsers(userId);
    return this.userRepository.findUserByName(name, blockedUsers);
  }

  async authenticate(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError("Email not found");
    }

    const isValidPassword = await this.validatePassword(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = this.generateToken(user.id);
    return { user, token };
  }

  async blockUser(blockerId: string, blockedId: string): Promise<void> {
    if (blockerId === blockedId) {
      throw new BadRequestError("You cannot block yourself");
    }

    const user = await this.userRepository.findUserById(blockedId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const blockRecord = await this.userRepository.findUserBlockRecord(blockerId, blockedId);
    if (blockRecord) {
      throw new BadRequestError("User is already blocked");
    }

    await this.userRepository.blockUser(blockerId, blockedId);
  }
}

