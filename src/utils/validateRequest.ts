import { FastifyReply, FastifyRequest } from "fastify";
import * as z from "zod";

export async function validateRequest(
    request: FastifyRequest, 
    reply: FastifyReply,
    validationSchema: z.ZodSchema<any>
    ) {
  try {
    await validationSchema.parseAsync(request.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = error.errors.map((e) => e.message).join(", ");
      reply.status(400).send({
        message: `Ocorreu um erro: ${validationError}`,
      });
      return;
    }
    throw error;
  }
}