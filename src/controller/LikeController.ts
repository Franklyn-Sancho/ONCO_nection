import { FastifyReply, FastifyRequest } from "fastify";
import { ILikeService } from "../service/LikeService";
import { UserRequest } from "../types/userTypes";

//interface de métodos do LikeController
export interface ILikeController {
  createLike(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  deleteLike(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

//Classe LikeController implementa a interface ILikeController
export class LikeController implements ILikeController {
  constructor(private likeService: ILikeService) {}

  //implementando o método para criar o like
  async createLike(request: UserRequest, reply: FastifyReply): Promise<void> {
    try {
      const { meetingId, muralId } = request.body.likes || {
        meetingId: null,
        muralId: null,
      };

      const { userId: author } = request.user;

      await this.likeService.createLike({
        meetingId,
        muralId,
        author,
      });
      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Error adding like in LikeController: ${error}`,
      });
    }
  }

  async deleteLike(request: UserRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { userId } = request.user;

      await this.likeService.deleteLike(id, userId);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Error removing like in LikeController: ${error}`,
      });
    }
  }
}
