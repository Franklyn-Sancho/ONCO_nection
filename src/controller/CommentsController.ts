import { FastifyReply, FastifyRequest } from "fastify";
import { ICommentService } from "../service/CommentsService";
import { z } from "zod";
import { validateRequest } from "../utils/validateRequest";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { UserRequest } from "../types/userTypes";
import { NotFoundError } from "../errors/NotFoundError";

export interface ICommentController {
  addComment(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  deleteComment(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class CommentController implements ICommentController {
  constructor(private commentService: ICommentService) {}

  async addComment(request: UserRequest, reply: FastifyReply): Promise<void> {
    const commentSchema = z.object({
      content: z.string({ required_error: "content is required" }),
    });

    try {
      const isValid = await validateRequest(request, reply, commentSchema);

      if (isValid) {
        const { meetingId, muralId, content } = request.body.comment || {
          meetingId: null,
          muralId: null,
          content: "",
        };

        const { userId } = request.user;

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
        console.log(request.body.comment);
        reply.code(500).send({
          error: error,
        });
      }
    }
  }

  async deleteComment(request: UserRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { userId } = request.user;

      await this.commentService.deleteComment(id, userId);

      reply.code(204).send();
    } catch (error) {
      reply.code(500).send({
        error: `Error removing comment: ${error}`,
      });
    }
  }
}
