import { FastifyReply, FastifyRequest } from "fastify";
import { IMeetingService } from "../service/MeetingService";
import { z } from "zod";
import { validateRequest } from "../utils/validateRequest";
import { handleImageUpload } from "../service/FileService";
import { ILikeController } from "./LikeController";
import { IMeetingRepository } from "../repository/MeetingRepository";
import { ICommentController } from "./CommentsController";
import { BodyParams } from "../types/bodyTypes";
import { MeetingParams } from "../types/meetingTypes";

/* interface MeetingLikeRequestBody {
  meetingId: string;
} */

//interface de métodos da classe MeetingController
export interface IMeetingController {
  createMeeting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  updateMeeting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  deleteMeeting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  addLikeMeeting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  removeLikeMeeting(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  addCommentMeeting(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  removeCommentMeeting(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
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
        const { type, title, body } = (request.body as BodyParams).meeting || {
          type: "",
          title: "",
          body: "",
        };

        const { userId } = request.user as any;

        const base64Image = await handleImageUpload(request);

        const meeting = await this.meetingService.createMeeting({
          type,
          title,
          body,
          userId,
          image: base64Image,
        });
        reply.send({
          message: "Meeting criado com sucesso",
          meetingId: meeting.id,
        });
      }
    } catch (error) {
      console.log(request.user);
      reply.code(500).send({
        error: error,
      });
    }
  }

  async updateMeeting(request: FastifyRequest, reply: FastifyReply) {
    const meetingValidations = z.object({
      type: z.string().optional(),
      title: z.string().optional(),
      body: z.string().optional(),
    });

    try {
      /*  const isValid = await validateRequest(request, reply, meetingValidations); */

      /* if (isValid) { */
      const data = meetingValidations.parse(request.body);
      const { meetingId } = request.params as MeetingParams;
      const { userId } = request.user as any;

      await this.meetingService.updateMeeting(meetingId, data, userId);
      reply.code(200).send({
        message: "Meeting atualizado com sucesso",
      });
      /* } */
    } catch (error) {
      reply.code(500).send(error);
    }
  }

  async deleteMeeting(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { meetingId } = request.params as MeetingParams;
      const { userId } = request.user as any;

      await this.meetingService.deleteMeeting(meetingId, userId);

      reply.code(200).send({
        message: "meeting deletado com sucesso",
      });
    } catch (error) {
      reply.code(500).send(error);
    }
  }

  //função da camada controller para adicionar likes nas meetings
  async addLikeMeeting(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { meetingId } = request.params as MeetingParams;

      const meeting = await this.meetingRepository.getMeetingById(meetingId);

      if (!meeting) {
        throw new Error("Meeting não encontrado");
      }

      (request.body as MeetingParams).meetingId = meetingId;

      await this.likeController.createLike(request, reply);
    } catch (error) {
      reply.code(500).send({
        error: `Ocorreu um erro na camada de controle: ${error}`,
      });
    }
  }

  //método da camada de controle para remover like do meeting
  async removeLikeMeeting(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { meetingId } = request.params as MeetingParams;

      (request.body as MeetingParams).meetingId = meetingId;

      await this.likeController.deleteLike(request, reply);
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
        const { meetingId } = request.params as MeetingParams;

        (request.body as MeetingParams).meetingId = meetingId;

        await this.commentController.addComment(request, reply);
      }
    } catch (error) {
      reply.code(500).send({
        error: `Ocorreu um erro na camada controller: ${error}`,
      });
    }
  }

  async removeCommentMeeting(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { meetingId } = request.params as MeetingParams;

      (request.body as MeetingParams).meetingId = meetingId;

      await this.commentController.deleteComment(request, reply);
    } catch (error) {
      reply.code(500).send({
        error: `error removing comment from meeting: ${error}`,
      });
    }
  }
}
