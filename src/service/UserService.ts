import { User } from "@prisma/client";
import { IUserRepository } from "../repository/UserRepository";
import bcrypt from "bcryptjs";
import { BadRequestError } from "../errors/BadRequestError";
import { getBlockedUsers } from "../utils/getBlockedUsers";
import { NotFoundError } from "../errors/NotFoundError";
import { FindUserByIdParams, FindUserByNameParams, UserBodyData, UserProfile } from "../types/usersTypes";
import { sendConfirmationEmail } from "../infrastructure/emailService";

export interface IUserService {
  registerWithEmail(user: UserBodyData, password: string): Promise<{ user: User; emailResult: any }>;
  findUserByName(name: string, userId: string): Promise<FindUserByNameParams[] | null>;
  findUserById(id: string): Promise<FindUserByIdParams | null>
  findByEmail(email: string): Promise<User | null>
  findProfileUser(name: string, userId: string): Promise<UserProfile[] | null>
  blockUser(blockerId: string, blockedId: string): Promise<void>;
  deleteUser(id: string): Promise<void>;
  deactivateUser(userId: string): Promise<void>
  markUserForDeletion(userId: string): Promise<void>
  processScheduledDeletions(): Promise<void>
}

export default class UserService implements IUserService {

  constructor(
    private userRepository: IUserRepository,
  ) { }

  // Hashes the user's password before storing it
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // Registers a new user with an email and password, and sends a confirmation email
  async registerWithEmail(user: UserBodyData, password: string): Promise<{ user: User; emailResult: any }> {
    const hashedPassword = await this.hashPassword(password);
    const createdUser = await this.userRepository.registerUserWithEmail(user, hashedPassword);
    const emailResult = await sendConfirmationEmail(createdUser);

    return { user: createdUser, emailResult };
  }

  // Finds a user by their ID
  async findUserById(id: string): Promise<FindUserByIdParams | null> {
    return this.userRepository.findUserById(id);
  }

  // Finds a user by their email address
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  // Finds users by their name, excluding blocked users
  async findUserByName(name: string, userId: string): Promise<FindUserByNameParams[] | null> {
    const blockedUsers = await getBlockedUsers(userId);
    return this.userRepository.findUserByName(name, blockedUsers);
  }

  // Finds user profiles by name, excluding blocked users
  async findProfileUser(name: string, userId: string): Promise<UserProfile[] | null> {
    const blockedUsers = await getBlockedUsers(userId);
    return this.userRepository.findProfileUser(name, blockedUsers);
  }

  // Blocks a user from interacting with the blocker
  async blockUser(blockerId: string, blockedId: string): Promise<void> {
    if (blockerId === blockedId) throw new BadRequestError("You cannot block yourself");

    const user = await this.userRepository.findUserById(blockedId);
    if (!user) throw new NotFoundError("User not found");

    const blockRecord = await this.userRepository.findUserBlockRecord(blockerId, blockedId);
    if (blockRecord) throw new BadRequestError("User is already blocked");

    await this.userRepository.blockUser(blockerId, blockedId);
  }

  // Deletes a user by their ID
  async deleteUser(id: string): Promise<void> {
    const verifyIfUserExist = await this.userRepository.findUserById(id);

    if (!verifyIfUserExist) throw new NotFoundError("User not found");

    return this.userRepository.deleteUser(id);
  }

  // Deactivates a user by their ID
  async deactivateUser(userId: string): Promise<void> {
    await this.userRepository.deactivateUser(userId);
  }

  // Marks a user for deletion
  async markUserForDeletion(userId: string): Promise<void> {
    await this.userRepository.markUserForDeletion(userId);
  }

  // Permanently deletes users that were marked for deletion 30 days ago
  async processScheduledDeletions(): Promise<void> {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    // Find users scheduled for deletion that have passed the threshold date
    const usersToDelete = await this.userRepository.findUsersScheduledForDeletion(thresholdDate);

    for (const user of usersToDelete) {
      await this.userRepository.deleteUser(user.id);
    }
  }
}
