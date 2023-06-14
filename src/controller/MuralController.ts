import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";
import { validateRequest } from "../utils/validateRequest";
import { IMuralService } from "../service/MuralService";

export interface IMuralController {
  createMural(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getMurals(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export class MuralController implements IMuralController {
  constructor(private muralService: IMuralService) {}

  async createMural(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const muralValidations = z.object({
      body: z.string({ required_error: "body is required" }),
    });

    try {
      await validateRequest(request, reply, muralValidations);
      const { body } = request.body as any;
      const { userId } = request.user as any;

      await this.muralService.createMural({
        body,
        userId,
      });
      reply.send({
        message: "Publicado com sucesso",
      });
    } catch (error) {
      console.log(request.user);
      reply.code(500).send({
        error: error,
      });
    }
  }

  //função da camada controller para adicionar likes nas meetings
  async getMurals(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { userId } = request.user as any;
      const murals = await this.muralService.getMurals(userId);
      reply.send(murals);
    } catch (error) {
      reply.code(500).send({
        error,
      });
    }
  }
}
