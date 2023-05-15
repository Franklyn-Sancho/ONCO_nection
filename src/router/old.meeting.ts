import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

interface IdParams {
  id: string;
}

export async function meetingsRouter(fastify: FastifyInstance) {
  /**
   * rota para os foruns de discussão
   */

  //Rota que retorna todos as discussões
  fastify.get("/meetings", async (request, reply) => {
    const meetings = await prisma.meetings.findMany({
      orderBy: {
        title: "desc",
      },
    });

    if (meetings.length == 0) {
      throw new Error("Não há nenhum encontro publicado :(");
    }

    reply.status(201).send({ content: meetings });
  });

  //Rota que retorna discussão por Id
  fastify.get<{ Params: IdParams }>("/meetings/:id", async (request, reply) => {
    const { id } = request.params;
    const findMeetingsForId = await prisma.meetings.findUnique({
      where: {
        id: String(id),
      },
      select: {
        title: true,
        body: true,
        createdAt: true,
      },
    });

    if (!findMeetingsForId) {
      throw new Error("Nenhum artigo encontrado com esse id");
    }

    reply.status(201).send({ content: findMeetingsForId });
  });

  //Rota para postar um novo encontro
  fastify.post("/meetings/new", async (request, reply) => {
    const newMeetingValidation = z.object({
      title: z.string({ required_error: "Titulo Obrigatório" }),
      body: z.string({ required_error: "Texto obrigatório" }),
    });

    const { title, body } = newMeetingValidation.parse(request.body);

    try {
      const createNewMeeting = await prisma.meetings.create({
        data: {
          title,
          body,
          userId: request.user.id,
        },
      });
      reply.status(200).send({
        success: "Publicado com sucesso",
        content: createNewMeeting,
      });
    } catch {
      
      reply.status(500).send({
        failed: "Erro ao públicar! verifique seus dados",
      });
    }
  });

  fastify.put<{ Params: IdParams }>(
    "/meetings/:id/edit",
    async (request, reply) => {
      const { id } = request.params;

      const meetingUpdateValidation = z.object({
        title: z.optional(z.string()),
        body: z.optional(z.string()),
      });

      const { title, body } = meetingUpdateValidation.parse(request.body);

      let findMeetings = await prisma.meetings.findUnique({
        where: {
          id,
        },
      });

      if (findMeetings) {
        const meetingsUpdate = await prisma.meetings.update({
          where: {
            id,
          },
          data: {
            title,
            body,
          },
        });
        reply.status(200).send({
          success: "Post Successfully Updated",
          content: meetingsUpdate,
        });
      } else {
        reply.status(401).send({
          failed: "Ocorreu algum erro, verifique os dados",
        });
      }
    }
  );

  fastify.delete<{ Params: IdParams }>(
    "/meeting/:id",
    async (request, reply) => {
      const { id } = request.params;
      const deleteMeeting = await prisma.meetings.delete({
        where: {
          id: String(id),
        },
      });
      return { deleteMeeting };
    }
  );
}
