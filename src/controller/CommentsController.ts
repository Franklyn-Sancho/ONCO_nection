import { FastifyReply, FastifyRequest } from "fastify";
import { ICommentService } from "../service/CommentsService";
import { z } from "zod";
import { validateRequest } from "../utils/validateRequest";

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

        await this.commentService.addComment({
          content,
          meetingId,
          muralId,
          userId,
        });
        reply.code(201).send({
          message: "Comentário adicionado com sucesso"
        });
      }
    } catch (error) {
      reply.code(500).send({
        error: `Error adding comment: ${error}`,
      });
    }
  }

  async deleteComment(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;

      await this.commentService.deleteComment(id);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Error removing comment: ${error}`,
      });
    }
  }
}
