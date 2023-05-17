import { FastifyReply, FastifyRequest } from "fastify";
import { MuralService } from "../service/MuralService";
import { Mural } from "@prisma/client";
import { z } from "zod";

export class MuralController {
  private muralService: MuralService;

  constructor() {
    this.muralService = new MuralService();
  }

  async create(
    request: FastifyRequest<{ Body: Mural }>,
    reply: FastifyReply
  ): Promise<void> {
    const muralValidation = z.object({
      title: z.string({ required_error: "title required" }),
      body: z.string({ required_error: "body required" }),
    });

    muralValidation.parse(request.body);
    try {
      const createdMural = await this.muralService.create(request.body);

      reply.status(201).send(createdMural);
    } catch {
      reply.status(500).send("Verifique seus Dados");
    }
  }

  async find(
    request: FastifyRequest<{ Params: Mural }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const findMural = await this.muralService.find(request.params);
      reply.status(201).send(findMural);
    } catch {
      reply.status(500).send("verifique o id");
    }
  }
}
