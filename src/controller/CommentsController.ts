import { FastifyReply, FastifyRequest } from "fastify";
import { ICommentService } from "../service/CommentsService";
import { z } from "zod";
import { validateRequest } from "../utils/validateRequest";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export interface ICommentController {
  addComment(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  deleteComment(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class CommentController implements ICommentController {
  constructor(private commentService: ICommentService) {}

  async addComment(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const commentSchema = z.object({
      content: z.string({ required_error: "content is required" }),
    });

    try {
      const isValid = await validateRequest(request, reply, commentSchema);

      if (isValid) {
        const { meetingId, muralId, content } = request.body as any;
        const { userId } = request.user as any;

        const comment = await this.commentService.addComment({
          content,
          meetingId,
          muralId,
          userId,
        });
        reply.code(201).send({
          message: "Comentário adicionado com sucesso",
          commentId: comment.id,
        });
      }
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        reply.code(error.statusCode).send({
          error: error.message,
        });
      } else {
        reply.code(500).send({
          error: error,
        });
      }
    }
  }

  async deleteComment(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { userId } = request.user as any;

      await this.commentService.deleteComment(id, userId);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Error removing comment: ${error}`,
      });
    }
  }
}
