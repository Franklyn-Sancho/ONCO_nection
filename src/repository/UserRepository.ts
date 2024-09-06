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
  deleteUser(id: string): Promise<void>;
  deleteAccountUser(id: string, userId: string): Promise<void>;
}


export default class UserRepository implements IUserRepository {

  constructor(private prisma: PrismaClient) { }


  async registerUserWithEmail(user: UserBodyData, hashedPassword: string): Promise<User> {
    const processedImage = processImage(user.imageProfile);
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        imageProfile: processedImage,
      },
    });

    await this.prisma.authentication.create({
      data: {
        userId: newUser.id,
        provider: 'email',
        password: hashedPassword,
      },
    });

    return newUser;
  }

  async registerOrLoginUserWithGoogle(token: string): Promise<User> {
    // Obtém as informações do usuário do Google
    const userInfo = await getUserInfoFromGoogle(token);
  
    // Verifica se o usuário já existe no banco de dados
    let user = await this.prisma.user.findUnique({
      where: { email: userInfo.email },
    });
  
    if (!user) {
      // Se o usuário não existir, cria um novo usuário
      user = await this.prisma.user.create({
        data: {
          name: userInfo.name,
          email: userInfo.email,
          imageProfile: userInfo.picture,
        },
      });
    } else {
      // Se o usuário existir, atualize as informações do usuário (opcional)
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: userInfo.name,
          imageProfile: userInfo.picture,
        },
      });
    }
  
    // Insere ou atualiza as informações de autenticação
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
  


  findAuthenticationByUserIdAndProvider(userId: string, provider: string): Promise<Authentication | null> {
    return this.prisma.authentication.findFirst({
      where: { userId, provider },
    });
  }

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

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findUserById(id: string): Promise<FindUserByIdParams | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findUserByName(name: string, blockedUserIds: string[]): Promise<FindUserByNameParams[] | null> {
    return this.prisma.user.findMany({
      where: {
        name: { contains: name },
        id: { notIn: blockedUserIds },
      },
      select: { name: true },
    });
  }

  updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async blockUser(blockerId: string, blockedId: string): Promise<void> {
    await this.prisma.userBlocks.create({ data: { blockerId, blockedId } });
  }

  findUserBlockRecord(blockerId: string, blockedId: string): Promise<UserBlocks | null> {
    return this.prisma.userBlocks.findFirst({
      where: { blockerId, blockedId },
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
  
}