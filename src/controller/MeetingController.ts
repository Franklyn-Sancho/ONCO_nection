import { FastifyReply, FastifyRequest } from "fastify";
import { IMeetingService } from "../service/MeetingService";
import { z } from "zod";
import { validateRequest } from "../utils/validateRequest";
import { handleImageUpload } from "../service/FileService";
import { ILikeController } from "./LikeController";
import { IMeetingRepository } from "../repository/MeetingRepository";
import { ICommentController } from "./CommentsController";
import { CreateMeetingData, MeetingParams } from "../types/meetingTypes";
import { UserParams } from "../types/usersTypes";
import { CommentParams } from "../types/commentTypes";
import { LikeParams } from "../types/likesTypes";


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
  ) { }

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
        const { type, title, body } = request.body as CreateMeetingData;

        const { userId } = request.user as UserParams;

        const subDir = "meetings"

        const base64Image = await handleImageUpload(request, subDir);

        const meeting = await this.meetingService.createMeeting({
          type,
          title,
          body,
          userId,
          image: base64Image,
        });
        reply.send({
          message: "meeting created successfullyo",
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
      const data = meetingValidations.parse(request.body);
      const { meetingId } = request.params as MeetingParams;
      const { userId } = request.user as UserParams;

      await this.meetingService.updateMeeting(meetingId, data, userId);
      reply.code(200).send({
        message: "meeting updated successfully",
      });
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
      const { userId } = request.user as UserParams;

      await this.meetingService.deleteMeeting(meetingId, userId);

      reply.code(200).send({
        message: "meeting deleted successfully",
      });
    } catch (error) {
      reply.code(500).send(error);
    }
  }

  //função da camada controller para adicionar likes nas meetings
  async addLikeMeeting(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { meetingId } = request.params as MeetingParams;

      (request.body as MeetingParams).meetingId = meetingId;

      const meeting = await this.meetingRepository.getMeetingById(meetingId);

      if (!meeting) {
        throw new Error("Meeting was not found");
      }

      await this.likeController.createLike(request, reply);
    } catch (error) {
      reply.code(500).send({
        error: `An error occurred in the control layer: ${error}`,
      });
    }
  }

  async removeLikeMeeting(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { likesId } = request.params as LikeParams;
      const { userId } = request.user as UserParams

      /* (request.body as MeetingParams).meetingId = likesId; */

      await this.likeController.deleteLike(likesId, userId);
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
        error: `An error occurred in the control layer: ${error}`,
      });
    }
  }

  async removeCommentMeeting(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { commentId } = request.params as CommentParams;

      (request.body as CommentParams).commentId = commentId;

      await this.commentController.deleteComment(request, reply);
    } catch (error) {
      reply.code(500).send({
        error: `error removing comment from meeting: ${error}`,
      });
    }
  }
}
