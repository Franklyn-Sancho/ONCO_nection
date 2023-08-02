import { FastifyReply, FastifyRequest } from "fastify";
import { IMeetingService } from "../service/MeetingService";
import { z } from "zod";
import { validateRequest } from "../utils/validateRequest";
import { handleImageUpload } from "../service/FileService";
import { ILikeController } from "./LikeController";
import { IMeetingRepository } from "../repository/MeetingRepository";
import { ICommentController } from "./CommentsController";

interface MeetingLikeRequestBody {
  meetingId: string;
}

//interface de métodos da classe MeetingController
export interface IMeetingController {
  createMeeting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  addLikeMeeting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  removeLikeMeeting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  addCommentMeeting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  removeCommentMeeting(request: FastifyRequest,reply: FastifyReply): Promise<void>;
}

//A classe MeetingController implementa a interface de métodos
export class MeetingController implements IMeetingController {
  constructor(
    private meetingService: IMeetingService,
    private likeController: ILikeController,
    private meetingRepository: IMeetingRepository,
    private commentController: ICommentController
  ) {}

  async createMeeting(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const meetingValidations = z.object({
      title: z.string({ required_error: "title is required" }),
      body: z.string({ required_error: "body is required" }),
    });

    try {
      const isValid = await validateRequest(request, reply, meetingValidations);

      if (isValid) {
        const { type, title, body, image } = request.body as any;
        const { userId } = request.user as any;

        const base64Image = image
          ? image[0].data.toString("base64")
          : undefined;
        await handleImageUpload(request);

        await this.meetingService.createMeeting({
          type,
          title,
          body,
          userId,
          image: base64Image,
        });
        reply.send({
          message: "Meeting criado com sucesso",
        });
      }
    } catch (error) {
      reply.code(500).send({
        error: error,
      });
    }
  }

  //função da camada controller para adicionar likes nas meetings
  async addLikeMeeting(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;

      const meeting = await this.meetingRepository.getMeetingById(id);
        
      if (!meeting) {
          throw new Error("Meeting não encontrado");
      }

      (request.body as MeetingLikeRequestBody).meetingId = id

      await this.likeController.createLike(request, reply);

    } catch (error) {
      console.log(request.params);
      reply.code(500).send({
        error: `Ocorreu um erro na camada de controle: ${error}`,
      });
    }
  }

  //método da camada de controle para remover like do meeting
  async removeLikeMeeting(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      
      (request.body as MeetingLikeRequestBody).meetingId = id

      await this.likeController.deleteLike(request, reply)

    } catch (error) {
      reply.code(500).send({
        error: `error removing like from meeting: ${error}`,
      });
    }
  }

  async addCommentMeeting(request: FastifyRequest, reply: FastifyReply) {
    const commentSchema = z.object({
      content: z.string({ required_error: "content is required" }),
    });

    try {
      const isValid = await validateRequest(request, reply, commentSchema);
      if (isValid) {
        const { id } = request.params as any;

        (request.body as MeetingLikeRequestBody).meetingId = id

        await this.commentController.addComment(request, reply)
      }
    } catch (error) {
      reply.code(500).send({
        error: `Ocorreu um erro na camada controller: ${error}`,
      });
    }
  }

  async removeCommentMeeting(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;

      (request.body as MeetingLikeRequestBody).meetingId = id

      await this.commentController.deleteComment(request, reply)
    } catch (error) {
      reply.code(500).send({
        error: `error removing comment from meeting: ${error}`,
      });
    }
  }
}