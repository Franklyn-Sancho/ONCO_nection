import { FastifyReply, FastifyRequest } from "fastify";
import { ILikeService } from "../service/LikeService";
import { LikeParams, LikesTypes } from "../types/likesTypes";
import { UserParams } from "../types/usersTypes";

//interface de métodos do LikeController
export interface ILikeController {
  createLike(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  deleteLike(likesId: string, userId: string): Promise<void>;
}

//Classe LikeController implementa a interface ILikeController
export class LikeController implements ILikeController {
  constructor(private likeService: ILikeService) {}

  //implementando o método para criar o like
  async createLike(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { meetingId, muralId } = request.body as LikesTypes;

      const { userId: author } = request.user as UserParams;

      const like = await this.likeService.createLike({
        meetingId,
        muralId,
        author,
      });
      reply.code(201).send({
        message: "like adicionado com sucesso",
        likeId: like.id
      });
    } catch (error) {
      reply.code(500).send({
        error: `Error adding like in LikeController: ${error}`,
      });
    }
  }

  /* async deleteLike(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { likesId } = request.params as LikeParams;
      const { userId } = request.user as UserParams;

      await this.likeService.deleteLike(likesId, userId);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Error removing like in LikeController: ${error}`,
      });
    }
  } */

  async deleteLike(likesId: string, userId: string) {
    try {
      await this.likeService.deleteLike(likesId, userId);
    } catch (error) {
      throw new Error(`Error removing like in LikeController: ${error}`);
    }
  }
}
