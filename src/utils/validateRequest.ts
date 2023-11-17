import { FastifyReply, FastifyRequest } from "fastify";
import * as z from "zod";

export async function validateRequest(
    request: FastifyRequest, 
    reply: FastifyReply,
    validationSchema: z.ZodSchema<any>
    ) {
  try {
    await validationSchema.parseAsync(request.body);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = error.errors.map((e) => e.message).join(", ");
      reply.code(400).send({
        message: `an error has occurred : ${validationError}`,
      });
      return false;
    }
    throw error;
  }
}