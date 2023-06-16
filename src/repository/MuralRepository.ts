import { Comments, Likes, Mural, PrismaClient } from "@prisma/client";
import { LikeRepository } from "./LikeRepository";
import { CommentsRepository } from "./CommentsRepository";

/* const prisma = new PrismaClient(); */

//Um mural será a publicação entre amigos na linha do tempo

//interface repository mural
export interface IMuralRepository {
  createMural(data: { body: string; userId: string }): Promise<Mural>;
  getMurals(userId: string): Promise<Mural[]>;
  addLikeMural(muralId: string, authorId: string): Promise<Likes>;
  removeLikeMural(id: string, userId: string): Promise<Likes>;
  addCommentMural(
    muralId: string,
    userId: string,
    content: string
  ): Promise<Comments>;
  removeCommentMural(id: string, userId: string): Promise<Comments>;
}

//MeetingRepository class implement interface
export class MuralRepository implements IMuralRepository {
  private prisma: PrismaClient;
  private likeRepository: LikeRepository;
  private commentRepository: CommentsRepository;

  //instancia do Prisma Client no constructor
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.likeRepository = new LikeRepository(prisma);
    this.commentRepository = new CommentsRepository(prisma);
  }

  //função responsável por criar um novo mural
  async createMural(data: { body: string; userId: string }) {
    try {
      return await this.prisma.mural.create({
        data, //a estrutura do data está no parâmetro da função
      });
    } catch (error) {
      throw new Error(`Error creating mural: ${error}`);
    }
  }

  //repositório para retornar os murais entre amigos
  async getMurals(userId: string) {
    const friends = await this.prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addressedId: userId }],
        status: "ACCEPTED",
      },
      select: {
        requesterId: true,
        addressedId: true,
      },
    });

    const friendIds = friends.map((friendship) =>
      friendship.requesterId === userId
        ? friendship.addressedId
        : friendship.requesterId
    );

    return this.prisma.mural.findMany({
      where: {
        userId: {
          in: friendIds,
        },
      },
    });
  }

  //implementando o método de adicionar like no mural
  async addLikeMural(muralId: string, authorId: string): Promise<Likes> {
    try {
      return await this.likeRepository.createLike({
        muralId,
        author: authorId,
      });
    } catch (error) {
      throw new Error(`Error adding like in MuralRepository: ${error}`);
    }
  }

  //implementando o método de remover like do mural
  async removeLikeMural(id: string, userId: string): Promise<Likes> {
    try {
      const like = await this.likeRepository.getLikeById(id);

      //controle de acesso, apenas o próprio usuário pode remover seu like
      if (like.author !== userId) {
        throw new Error("Nenhum Like foi encontrado");
      }

      return await this.likeRepository.deleteLike(id);
    } catch (error) {
      throw new Error(`Error removing like in MuralRepository: ${error}`);
    }
  }

  //implementando o método de adicinar comentário no mural
  async addCommentMural(
    muralId: string,
    userId: string,
    content: string
  ): Promise<Comments> {
    try {
      return await this.commentRepository.createComment({
        muralId,
        userId,
        content,
      });
    } catch (error) {
      throw new Error(`Error adding comment in MuralRepository: ${error}`);
    }
  }

  //implementando o método para remover comentários do mural
  async removeCommentMural(id: string, userId: string): Promise<Comments> {
    try {
      
       const comment = await this.commentRepository.getCommentById(id)

        if(comment.userId !== userId) {
          throw new Error("Acesso negado")
        }
      return await this.commentRepository.deleteComment(id);
    } catch (error) {
      throw new Error(`Error removing comment in MuralRepository: ${error}`);
    }
  }
}
