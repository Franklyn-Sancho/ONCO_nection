import { FastifyReply, FastifyRequest } from "fastify";
import { IMuralService } from "../service/MuralService";
import { handleImageUpload } from "../service/FileService";
import { validateRequest } from "../utils/validateRequest";
import { z } from "zod";
import { ILikeController } from "./LikeController";
import { ICommentController } from "./CommentsController";

interface MuralRequestBody {
  muralId: string,
  body: string;
  image?: any[];
}

export interface IMuralController {
  createMural(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  updateMural(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  deleteMural(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getMurals(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  addLikeMural(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  removeLikeMural(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  addCommentMural(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  removeCommentMural(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
}

export class MuralController implements IMuralController {
  constructor(
    private muralService: IMuralService,
    private likeController: ILikeController,
    private commentController: ICommentController,
    ) {}

  async createMural(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const muralValidations = z.object({
      body: z.string({ required_error: "body is required" }),
      image: z.array(z.any()).optional(),
    });
    try {
      const isValid = await validateRequest(request, reply, muralValidations);

      if (isValid) {
        const { userId } = request.user as any
        const { body, image } = request.body as any;

        const base64Image = image
          ? image[0].data.toString("base64")
          : undefined;
        await handleImageUpload(request);

        const mural = await this.muralService.createMural({
          body,
          userId,
          image: base64Image,
        });
        reply.send({
          message: "Mural publicado com sucesso",
          muralId: mural.id,
        });
      }
    } catch (error) {
      reply.status(500).send({
        error: `ocorreu o seguinte erro ${error}`,
      });
    }
  }

  async updateMural(request: FastifyRequest, reply: FastifyReply): Promise<void> {
      
    try {
      const {id} = request.params as any
      const { body } = request.body as any
      const { userId } = request.user as any

      await this.muralService.updateMural(id, body, userId)
      reply.code(200).send({
        message: "mural atualizado com sucesso"
      })
    }
    catch (error) {
      reply.code(400).send(error)
    }
  }

  async deleteMural(request: FastifyRequest, reply: FastifyReply): Promise<void> {
      
    try {
      const {id} = request.params as any
      const {userId} = request.user as any

      await this.muralService.deleteMural(id, userId)
      reply.code(200).send({
        message: "mural deletado com sucesso"
      })
    }
    catch (error) {
      reply.code(500).send(error)
    }
  }

  //método que retorna os murais de amigos
  async getMurals(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { userId } = request.user as any;
      const murals = await this.muralService.getMurals(userId);
      reply.send(murals);
    } catch (error) {
      reply.code(500).send({
        error,
      });
    }
  }

  async addLikeMural(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;

      (request.body as MuralRequestBody).muralId = id

      await this.likeController.createLike(request, reply);

    } catch (error) {
      reply.code(500).send({
        error: `Ocorreu um erro na camada de controle: ${error}`,
      });
    }
  }

  async removeLikeMural(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      
      (request.body as MuralRequestBody).muralId = id

      await this.likeController.deleteLike(request, reply)
    } catch (error) {
      reply.code(500).send({
        error: `error removing like from mural: ${error}`,
      });
    }
  }

  async addCommentMural(request: FastifyRequest, reply: FastifyReply) {
    const commentSchema = z.object({
      content: z.string({ required_error: "content is required" }),
    });
  
    try {
      const isValid = await validateRequest(request, reply, commentSchema)
      if (isValid) {
        const { id } = request.params as any;

        (request.body as MuralRequestBody).muralId = id

        await this.commentController.addComment(request, reply)

      }
    } catch (error) {
      reply.code(500).send({
        error: `Ocorreu um erro na camada controller: ${error}`,
      });
    }
  }

  async removeCommentMural(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      (request.body as MuralRequestBody).muralId = id

      await this.commentController.deleteComment(request, reply)
    } catch (error) {
      reply.code(500).send({
        error: `error removing comment from mural: ${error}`,
      });
    }
  }
}

