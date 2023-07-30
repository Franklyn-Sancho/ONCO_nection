import { Comments, Likes, Mural, PrismaClient } from "@prisma/client";
import { LikeRepository } from "./LikeRepository";
import { CommentsRepository } from "./CommentsRepository";

/* const prisma = new PrismaClient(); */

export interface CreateMuralData {
  body: string;
  userId: string;
  image?: string;
}

//interface repository mural
export interface IMuralRepository {
  createMural(data: CreateMuralData): Promise<Mural>;
  getMuralsIfFriends(userId: string): Promise<Mural[]>;
  addLikeInMural(muralId: string, authorId: string): Promise<Likes>;
  removeLikeInMural(id: string, userId: string): Promise<Likes>;
  addCommentInMural(muralId: string, userId: string, content: string
  ): Promise<Comments>;
  removeCommentInMural(id: string, userId: string): Promise<Comments>;
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
  async createMural(data: CreateMuralData) {
    return await this.prisma.mural.create({
      data, //a estrutura do data está no parâmetro da função {body, userId}
    });
  }

  //repositório para retornar os murais entre amigos
  async getMuralsIfFriends(userId: string) {
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
          in: friendIds, //retorna os murais postados pelos amigos do requesterId
        },
      },
    });
  }

  //implementando o método de adicionar like no mural
  async addLikeInMural(muralId: string, authorId: string) {
    return await this.likeRepository.createLike({
      muralId,
      author: authorId, //author recebe o id do usuário
    });
  }

  //implementando o método de remover like do mural
  async removeLikeInMural(id: string, userId: string) {
    const like = await this.likeRepository.getLikeById(id);

    //controle de acesso, apenas o próprio usuário pode remover seu like
    if (like.author !== userId) {
      throw new Error("Acessa negado");
    }

    return await this.likeRepository.deleteLike(id);
  }

  //implementando o método de adicinar comentário no mural
  async addCommentInMural(muralId: string, userId: string, content: string
  ): Promise<Comments> {
    return await this.commentRepository.createComment({
      muralId,
      userId,
      content,
    });
  }

  //implementando o método para remover comentários do mural
  async removeCommentInMural(id: string, userId: string): Promise<Comments> {
    const comment = await this.commentRepository.getCommentById(id);

    //apenas o usuário pode remover o próprio like
    if (comment.userId !== userId) {
      throw new Error("Acesso negado");
    }
    return await this.commentRepository.deleteComment(id);
  }
}
