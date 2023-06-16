import { FastifyReply, FastifyRequest } from "fastify";
import { ILikeService } from "../service/LikeService";

//interface de métodos do LikeController
export interface ILikeController {
  createLike(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  deleteLike(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

//Classe LikeController implementa a interface ILikeController
export class LikeController implements ILikeController {
  constructor(private likeService: ILikeService) {}

  //implementando o método para criar o like
  async createLike(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { meetingId, muralId } = request.body as any;
      const { userId: author } = request.user as any; //id do usuário autenticado

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

  async deleteLike(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { userId } = request.user as any;

      await this.likeService.deleteLike(id, userId);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Error removing like in LikeController: ${error}`,
      });
    }
  }
}
