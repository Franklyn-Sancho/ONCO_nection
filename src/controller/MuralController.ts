import { FastifyReply, FastifyRequest } from "fastify";
import { IMuralService } from "../service/MuralService";
import { validateMural } from "../utils/muralValidations";
import {
  handleImageUpload,
  handleMultipartFormData,
} from "../service/FileService";
import { validateRequest } from "../utils/validateRequest";
import { z } from "zod";

export interface IMuralController {
  createMural(request: FastifyRequest, reply: FastifyReply): Promise<void>;
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
  constructor(private muralService: IMuralService) {}

  async createMural(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const muralSchema = z.object({
      body: z.string({ required_error: "body is required" }),
      image: z.array(z.any()).optional(),
    });
    try {
      const isValid = await validateRequest(request, reply, muralSchema);

      if (isValid) {
        const { userId } = request.user as any;
        const { body, image } = request.body as any;

        const base64Image = image
          ? image[0].data.toString("base64")
          : undefined;
        await handleImageUpload(request);

        await this.muralService.createMural({
          body,
          userId,
          image: base64Image,
        });
        reply.send({
          message: "Publicado com sucesso",
        });
      }
    } catch (error) {
      reply.status(500).send({
        error: `ocorreu o seguinte erro ${error}`,
      });
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
      const { userId } = request.user as any;
      console.log(userId);

      await this.muralService.addLikeMural(id, userId);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Ocorreu um erro na camada controller: ${error}`,
      });
    }
  }

  async removeLikeMural(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { userId } = request.user as any;

      await this.muralService.removeLikeMural(id, userId);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `error removing like from meeting: ${error}`,
      });
    }
  }

  async addCommentMural(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { userId } = request.user as any;
      const { content } = request.body as any;

      await this.muralService.addCommentMural(id, userId, content);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Ocorreu um erro na camada controller: ${error}`,
      });
    }
  }

  async removeCommentMural(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { userId } = request.user as any;

      await this.muralService.removeCommentMural(id, userId);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `error removing comment from meeting: ${error}`,
      });
    }
  }
}

/* await validateRequest(request, reply, muralValidations);
      const { body } = request.body as any;
      const { userId } = request.user as any;
      console.log(userId)

      await this.muralService.createMural({
        body,
        userId,
      });
      reply.send({
        message: "Publicado com sucesso",
      }); */
