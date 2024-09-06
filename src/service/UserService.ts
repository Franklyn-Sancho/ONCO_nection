import { User } from "@prisma/client";
import { IUserRepository } from "../repository/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/BadRequestError";
import { getBlockedUsers } from "../utils/getBlockedUsers";
import { NotFoundError } from "../errors/NotFoundError";

import { UnauthorizedError } from "../errors/UnauthorizedError";
import { FindUserByIdParams, FindUserByNameParams, UserBodyData, UserProfile } from "../types/usersTypes";
import { IEmailService } from "../infrastructure/EmailService";

export interface IUserService {
  registerWithEmail(user: UserBodyData, password: string): Promise<{ user: User; emailResult: any }>;
  findUserByName(name: string, userId: string): Promise<FindUserByNameParams[] | null>;
  findUserById(id: string): Promise<FindUserByIdParams | null>
  findByEmail(email: string): Promise<User | null>
  findProfileUser(name: string, userId: string): Promise<UserProfile[] | null>
  blockUser(blockerId: string, blockedId: string): Promise<void>;
  deleteUser(id: string): Promise<void>;
}

export default class UserService implements IUserService {

  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) { }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async registerWithEmail(user: UserBodyData, password: string): Promise<{ user: User; emailResult: any }> {
    const hashedPassword = await this.hashPassword(password);
    const createdUser = await this.userRepository.registerUserWithEmail(user, hashedPassword);
    const emailResult = await this.emailService.sendConfirmationEmail(createdUser);

    return { user: createdUser, emailResult };
  }


  async findUserById(id: string): Promise<FindUserByIdParams | null> {
    return this.userRepository.findUserById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findUserByName(name: string, userId: string): Promise<FindUserByNameParams[] | null> {
    const blockedUsers = await getBlockedUsers(userId);
    return this.userRepository.findUserByName(name, blockedUsers);
  }

  async findProfileUser(name: string, userId: string): Promise<UserProfile[] | null> {
    const blockedUsers = await getBlockedUsers(userId);
    return this.userRepository.findProfileUser(name, blockedUsers);
  }


  async blockUser(blockerId: string, blockedId: string): Promise<void> {
    if (blockerId === blockedId) throw new BadRequestError("You cannot block yourself");

    const user = await this.userRepository.findUserById(blockedId);
    if (!user) throw new NotFoundError("User not found");

    const blockRecord = await this.userRepository.findUserBlockRecord(blockerId, blockedId);
    if (blockRecord) throw new BadRequestError("User is already blocked");

    await this.userRepository.blockUser(blockerId, blockedId);
  }

  async deleteUser(id: string): Promise<void> {

      const verifyIfUserExist = await this.userRepository.findUserById(id)

      if(!verifyIfUserExist) throw new NotFoundError("User not found");

      return this.userRepository.deleteUser(id)
  }
}