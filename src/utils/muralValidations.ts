// utils/muralValidator.ts
import * as z from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { validateRequest } from "./validateRequest";

const muralSchema = z.object({
  body: z.string({ required_error: "body is required" }),
  image: z.array(z.any()).optional(),
});

export async function validateMural(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await validateRequest(request, reply, muralSchema);
}
