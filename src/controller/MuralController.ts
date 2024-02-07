import { FastifyReply, FastifyRequest } from "fastify";
import { IMuralService } from "../service/MuralService";
import { handleImageUpload } from "../service/FileService";
import { validateRequest } from "../utils/validateRequest";
import { z } from "zod";
import { ILikeController } from "./LikeController";
import { ICommentController } from "./CommentsController";
import { CreateMuralData, MuralParams } from "../types/muralTypes";
import { UserParams } from "../types/usersTypes";
import { LikeParams } from "../types/likesTypes";
import { CommentParams } from "../types/commentTypes";

export interface IMuralController {
  createMural(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  updateMural(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  deleteMural(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getMuralByIdIfFriends(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  getMuralsIfFriends(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  getLikeByMural(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  countLikesByMural(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  countCommentsByMural(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  getCommentByMural(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
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
    private commentController: ICommentController
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
        const { userId } = request.user as UserParams;
        const { body } = request.body as CreateMuralData;

        const subDir = "mural"

        const base64Image = await handleImageUpload(request, subDir);

        const mural = await this.muralService.createMural({
          body,
          userId,
          image: base64Image,
        });
        reply.send({
          message: "Mural was published successfully",
          muralId: mural.id,
        });
      }
    } catch (error) {
      reply.status(500).send({
        error: `an error has occurred: ${error}`,
      });
    }
  }

  async getMuralByIdIfFriends(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { muralId } = request.params as MuralParams;
      const { userId } = request.user as UserParams;

      const result = await this.muralService.getMuralByIdIfFriends(
        muralId,
        userId
      );

      reply.code(200).send(result);
    } catch (error) {}
  }

  async updateMural(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const muralValidations = z.object({
      type: z.string().optional(),
    });

    try {
      const isValid = await validateRequest(request, reply, muralValidations);

      if (isValid) {
        const { muralId } = request.params as MuralParams;
        const { body } = request.body as CreateMuralData;

        const { userId } = request.user as UserParams;

        await this.muralService.updateMural(muralId, body, userId);
        reply.code(200).send({
          message: "mural was updated successfully",
        });
      }
    } catch (error) {
      reply.code(400).send(error);
    }
  }

  async deleteMural(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { muralId } = request.params as MuralParams;
      const { userId } = request.user as UserParams;

      const mural = await this.muralService.deleteMural(muralId, userId);
      reply.code(200).send({
        message: "mural was deleted successfully",
        muralId: mural.id,
      });
    } catch (error) {
      reply.code(500).send(error);
    }
  }

  //método que retorna os murais de amigos
  async getMuralsIfFriends(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { userId } = request.user as UserParams;
      const murals = await this.muralService.getMuralsIfFriends(userId);
      reply.send(murals);
    } catch (error) {
      reply.code(500).send({
        error,
      });
    }
  }

  async getLikeByMural(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { muralId } = request.params as MuralParams;
      const { userId } = request.user as UserParams;

      const like = await this.muralService.getLikeByMural(muralId, userId);

      if (like) {
        reply.code(200).send({
          message: "Like encontrado com sucesso",
          like: like,
        });
      } else {
        reply.code(200).send({
          message: "Like não encontrado",
          like: false,
        });
      }
    } catch (error) {
      reply.code(500).send({
        error: `Erro ao buscar like no LikeController: ${error}`,
      });
    }
  }

  async countLikesByMural(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { muralId } = request.params as MuralParams;
      const { userId: author } = request.user as UserParams;

      const likes = await this.muralService.countLikesByMural(muralId, author);

      if (likes) {
        reply.code(200).send({
          like: likes,
        });
      } else {
        reply.code(200).send({
          like: 0,
        });
      }
    } catch (error) {
      reply.code(500).send({
        error: `Erro ao buscar like no LikeController: ${error}`,
      });
    }
  }

  async countCommentsByMural(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { muralId } = request.params as MuralParams;
      const { userId } = request.user as UserParams;

      const comments = await this.muralService.countCommentsByMural(
        muralId,
        userId
      );

      if (comments) {
        reply.code(200).send({
          comments: comments,
        });
      } else {
        reply.code(200).send({
          comments: 0,
        });
      }
    } catch (error) {
      reply.code(500).send({
        error: `Erro ao buscar like no LikeController: ${error}`,
      });
    }
  }

  async getCommentByMural(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { muralId } = request.params as MuralParams;

      const comment = await this.muralService.getCommentByMural(muralId);

      reply.code(200).send({
        results: comment,
      });
    } catch (error) {
      console.error("ocorreu um erro", error);
    }
  }

  async addLikeMural(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { muralId } = request.params as MuralParams;

      (request.body as MuralParams).muralId = muralId;

      await this.likeController.createLike(request, reply);
    } catch (error) {
      reply.code(500).send({
        error: `an error occurred in the control layer: ${error}`,
      });
    }
  }

  async removeLikeMural(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { likesId } = request.params as LikeParams;
      const { userId } = request.user as UserParams;

      /* (request.body as MuralParams).muralId = likesId; */

      await this.likeController.deleteLike(likesId, userId);
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
      const isValid = await validateRequest(request, reply, commentSchema);
      if (isValid) {
        const { muralId } = request.params as MuralParams;

        (request.body as MuralParams).muralId = muralId;

        await this.commentController.addComment(request, reply);
      }
    } catch (error) {
      reply.code(500).send({
        error: `an error occurred in the control layer: ${error}`,
      });
    }
  }

  async removeCommentMural(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { commentId } = request.params as CommentParams;

      (request.body as MuralParams).muralId = commentId;

      await this.commentController.deleteComment(request, reply);
    } catch (error) {
      reply.code(500).send({
        error: `error removing comment from mural: ${error}`,
      });
    }
  }
}
