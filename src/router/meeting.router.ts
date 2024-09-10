import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/authenticate";
import { meetingController } from "../utils/providers";
import { UserRequest } from "../types/userTypes";
import { commentMeetingCreate, createMeetingSchema, updateMeetingSchema } from "../schema/meeting.schema";
import { errorResponse, successResponse } from "../schema/commonResponse";

export function meetingRouter(
  fastify: FastifyInstance,
  options: any,
  done: () => void
) {

  fastify.post(
    "/meetings/create",
    {
      schema: {
        body: createMeetingSchema,
        response: {
          '200': successResponse, // Reference common response object
          '400': errorResponse, // Reference common response object
        },
      },
      preHandler: authenticate, // Pre-handler included within options
    },
    meetingController.createMeeting.bind(meetingController)
  );

  fastify.put(
    "/meetings/:meetingId/update",
    {
      schema: {
        body: updateMeetingSchema,
        response: {
          '200': successResponse, // Reference common response object
          '400': errorResponse, // Reference common response object
        },
      },
      preHandler: authenticate, // Pre-handler included within options
    },
    meetingController.updateMeeting.bind(meetingController)
  )

  fastify.delete(
    "/meetings/:meetingId/delete",
    {
      schema: {
        response: {
          '204': { type: 'object' }, // No content (204) for successful deletion
          '404': errorResponse, // Reference error response schema for meeting not found
        },
      },
      preHandler: authenticate,
    },
    meetingController.deleteMeeting.bind(meetingController)
  );

  fastify.post(
    "/meetings/:meetingId/likes",
    { preHandler: authenticate },
    meetingController.addLikeMeeting.bind(meetingController)
  );

  fastify.post(
    "/meetings/:meetingId/comments",
    {
      schema: {
        body: commentMeetingCreate, // Reference the commentSchema for comment details
        response: {
          '201': { type: 'object', properties: { message: { type: 'string' } } }, // Successful comment creation
          '400': errorResponse, // Reference error response schema
        },
      },
      preHandler: authenticate,
    },
    meetingController.addCommentMeeting.bind(meetingController)
  );

  fastify.delete(
    "/meetings/:likesId/likes",
    { preHandler: authenticate },
    async (request, reply) => {
      await meetingController.removeLikeMeeting(request, reply);
    }
  );

  fastify.delete(
    "/meetings/:commentId/comments",
    { preHandler: authenticate },
    async (request, reply) => {
      await meetingController.removeCommentMeeting(request, reply);
    }
  );

  done();
}
