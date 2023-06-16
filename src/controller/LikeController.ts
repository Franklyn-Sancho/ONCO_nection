import { FastifyReply, FastifyRequest } from "fastify";
import { ILikesService } from "../service/LikesService";

export interface ILikeController {
  addLike(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  deleteLike(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class LikeController implements ILikeController {
  constructor(private likeService: ILikesService) {}

  async addLike(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { meetingId, muralId } = request.body as any;
      const { userId: author } = request.user as any;

      await this.likeService.createLike({
        meetingId,
        muralId,
        author,
      });
      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Error adding like: ${error}`,
      });
    }
  }

  async deleteLike(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { userId } = request.user as any;

      await this.likeService.deleteLike(id, userId);
      /* console.log(userId); */

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Error removing like: ${error}`,
      });
    }
  }
}
