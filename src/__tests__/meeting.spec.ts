import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let server: FastifyInstance;

describe("MeetingController", () => {
  let token = "";
  let token2 = "";

  beforeAll(async () => {
    server = await serverPromise;
    const response = await request(server.server).post("/user/login").send({
      email: "test1@email.com",
      password: "12345",
    });
    token = response.body.token;

    const response2 = await request(server.server).post("/user/login").send({
      email: "rachel@email.com",
      password: "12345",
    });
    token2 = response2.body.token;
  });

  afterAll(async () => {
    await prisma.meetings.deleteMany({});
    server.close();
  });

  it("Should create a new meeting", async () => {
    const response = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        title: "title",
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("meetingId");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Meeting criado com sucesso");
  });

  it("Should update a meeting", async () => {
    const createResponse = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        title: "title",
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);

    const meetingId = createResponse.body.meetingId;

    // Atualiza o meeting
    const updateResponse = await request(server.server)
      .put(`/meetings/${meetingId}/update`)
      .send({
        type: "new type",
        title: "new title",
        body: "new body",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toStrictEqual({
      message: "Meeting atualizado com sucesso",
    });
  });

  it("Should delete a meeting", async () => {
    // Cria um novo meeting
    const createResponse = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        title: "title",
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);

    const meetingId = createResponse.body.meetingId;

    const deleteResponse = await request(server.server)
      .delete(`/meetings/${meetingId}/delete`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toStrictEqual({
      message: "meeting deletado com sucesso",
    });
  });

  it("Should to return title error validation", async () => {
    const response = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: title is required",
    });
  });

  it("Should to return body error validation", async () => {
    const response = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        title: "title",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: body is required",
    });
  });

  it("Should not create a meeting without an authenticated user", async () => {
    const response = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        title: "title",
      });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      error: "Unauthorized",
      message: "falha de autenticação",
      statusCode: 401,
    });
  });

  it("Should not allow user to delete another user's meeting", async () => {
    // Cria um novo comentário usando a primeira conta de usuário
    const createResponse = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        title: "title",
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);

    const meetingId = createResponse.body.meetingId;

    const removeResponse = await request(server.server)
      .delete(`/meetings/${meetingId}/delete`)
      .set("Authorization", `Bearer ${token2}`);

    expect(removeResponse.status).toBe(403);
    expect(removeResponse.body).toStrictEqual({
      error: "Forbidden",
      message: "Você não tem permissão para excluir esse conteúdo",
      statusCode: 403,
    });
  });
});
