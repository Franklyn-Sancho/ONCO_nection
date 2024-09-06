import { Authentication, PrismaClient, User, UserBlocks } from "@prisma/client";
import { processImage } from "../infrastructure/fileService";
import { FindUserByIdParams, FindUserByNameParams, UserBodyData, UserProfile } from "../types/usersTypes";
import { getUserInfoFromGoogle } from "../auth/authGoogleConfig";



export interface IUserRepository {
  registerUserWithEmail(user: UserBodyData, password: string): Promise<User>;
  findAuthenticationByUserIdAndProvider(userId: string, provider: string): Promise<Authentication | null>
  findByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<FindUserByIdParams | null>;
  findUserByName(name: string, blockedUserIds: string[]): Promise<FindUserByNameParams[] | null>;
  findProfileUser(name: string, blockedUserIds: string[]): Promise<UserProfile[] | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  blockUser(blockerId: string, blockedId: string): Promise<void>;
  findUserBlockRecord(blockerId: string, blockedId: string): Promise<UserBlocks | null>;
  deactivateUser(userId: string): Promise<void>
  markUserForDeletion(userId: string): Promise<void>
  deleteUser(id: string): Promise<void>;
  findUsersScheduledForDeletion(thresholdDate: Date): Promise<User[]>
  reactivateUser(userId: string): Promise<void>
}


export default class UserRepository implements IUserRepository {

  constructor(private prisma: PrismaClient) { }

  // Registers a new user with email and hashed password
  async registerUserWithEmail(user: UserBodyData, hashedPassword: string): Promise<User> {
    // Process the user's profile image
    const processedImage = processImage(user.imageProfile);
    
    // Create a new user record
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        imageProfile: processedImage,
      },
    });

    // Create authentication record for the user
    await this.prisma.authentication.create({
      data: {
        userId: newUser.id,
        provider: 'email',
        password: hashedPassword,
      },
    });

    return newUser;
  }

  // Registers or logs in a user using Google authentication token
  async registerOrLoginUserWithGoogle(token: string): Promise<User> {
    // Obtain user information from Google
    const userInfo = await getUserInfoFromGoogle(token);
  
    // Check if the user already exists in the database
    let user = await this.prisma.user.findUnique({
      where: { email: userInfo.email },
    });
  
    if (!user) {
      // If user does not exist, create a new user record
      user = await this.prisma.user.create({
        data: {
          name: userInfo.name,
          email: userInfo.email,
          imageProfile: userInfo.picture,
        },
      });
    } else {
      // If user exists, optionally update user information
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: userInfo.name,
          imageProfile: userInfo.picture,
        },
      });
    }
  
    // Insert or update authentication information
    await this.prisma.authentication.upsert({
      where: {
        userId_provider: {
          userId: user.id,
          provider: 'google',
        },
      },
      update: {
        providerId: userInfo.sub,
      },
      create: {
        userId: user.id,
        provider: 'google',
        providerId: userInfo.sub,
      },
    });
  
    return user;
  }

  // Finds an authentication record by user ID and provider
  findAuthenticationByUserIdAndProvider(userId: string, provider: string): Promise<Authentication | null> {
    return this.prisma.authentication.findFirst({
      where: { userId, provider },
    });
  }

  // Finds user profiles by name, excluding blocked users
  findProfileUser(name: string, blockedUserIds: string[]): Promise<UserProfile[] | null> {
    return this.prisma.user.findMany({
      where: {
        name: { contains: name },
        id: { notIn: blockedUserIds },
      },
      select: {
        name: true,
        description: true,
        imageProfile: true,
      },
    });
  }

  // Finds a user by their email address
  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // Finds a user by their ID
  findUserById(id: string): Promise<FindUserByIdParams | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // Finds users by name, excluding blocked users
  findUserByName(name: string, blockedUserIds: string[]): Promise<FindUserByNameParams[] | null> {
    return this.prisma.user.findMany({
      where: {
        name: { contains: name },
        id: { notIn: blockedUserIds },
      },
      select: { name: true },
    });
  }

  // Updates user information based on user ID
  updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Blocks a user by creating a block record
  async blockUser(blockerId: string, blockedId: string): Promise<void> {
    await this.prisma.userBlocks.create({ data: { blockerId, blockedId } });
  }

  // Finds a block record between two users
  findUserBlockRecord(blockerId: string, blockedId: string): Promise<UserBlocks | null> {
    return this.prisma.userBlocks.findFirst({
      where: { blockerId, blockedId },
    });
  }

  // Deactivates a user by setting the isDeactivated flag to true
  async deactivateUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isDeactivated: true },  // Flag to indicate user is deactivated
    });
  }

  // Marks a user for deletion by setting the deletion date
  async markUserForDeletion(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { deleteScheduledAt: new Date() },  // Set the scheduled deletion date
    });
  }

  // Permanently deletes a user and their authentication records
  async deleteUser(userId: string): Promise<void> {
    await this.prisma.authentication.deleteMany({
      where: { userId }
    });
  
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  // Finds users scheduled for deletion before a specific date
  async findUsersScheduledForDeletion(thresholdDate: Date): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        deleteScheduledAt: {
          lte: thresholdDate,
        },
      },
    });
  }

  // Reactivates a user by setting the isDeactivated flag to false
  async reactivateUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isDeactivated: false },  // Flag to indicate user is reactivated
    });
  }
}
