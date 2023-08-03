import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let server: FastifyInstance;

describe("CommentsController", () => {
  let token = "";
  let token2 = ""

  beforeAll(async () => {
    server = await serverPromise;
    const response = await request(server.server).post("/user/login").send({
      email: "test1@email.com",
      password: "12345",
    });
    token = response.body.token;

    const response2 = await request(server.server).post("/user/login").send({
      email: "rachel@email.com",
      password: "12345"
    })
    token2 = response2.body.token
  });


  afterAll(async () => {
    await prisma.comments.deleteMany({});
    server.close();
  });

  it("Should to create a new comment on meeting", async () => {
    const response = await request(server.server)
      .post("/meetings/clip1obpm0001c0jo4ffw5bm4/comments")
      .send({
        content: "teste de comentário no meeting",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      message: "Comentário adicionado com sucesso",
    });
  });

  it("Should to create a new comment on mural", async () => {
    const response = await request(server.server)
      .post("/mural/clkiw8h110001c0shj62cvqy7/comments")
      .send({
        content: "teste de comentário no mural",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      message: "Comentário adicionado com sucesso",
    });
  });

  it("Should to return content error validation on meeting", async () => {
    const response = await request(server.server)
      .post("/meetings/clip1obpm0001c0jo4ffw5bm4/comments")
      .send({})
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: content is required",
    });
  });

  it("Should to return content error validation on mural", async () => {
    const response = await request(server.server)
      .post("/mural/clklga0ke0001c0irn55f0w5e/comments")
      .send({})
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: content is required",
    });
  });

  it("Should to return an authentication error", async () => {
    const response = await request(server.server)
      .post("/meetings/clip1obpm0001c0jo4ffw5bm4/comments")
      .send({
        content: "texto de teste",
      });
    /* .set("Authorization", `Bearer ${token}`);*/

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      error: "Falha na autenticação",
    });
  });

  it("Should to return an authentication error", async () => {
    const response = await request(server.server)
      .post("/mural/clklga0ke0001c0irn55f0w5e/comments")
      .send({
        content: "texto de teste",
      });
    /* .set("Authorization", `Bearer ${token}`);*/

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      error: "Falha na autenticação",
    });
  });

  it("Should to create and remove comment on meeting", async () => {
    const CreateResponse = await request(server.server)
      .post("/meetings/clip1obpm0001c0jo4ffw5bm4/comments")
      .send({
        content: "teste de comentário no meeting",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(CreateResponse.status).toBe(201);
    expect(CreateResponse.body).toHaveProperty("commentId");
    expect(CreateResponse.body).toHaveProperty("message");
    expect(CreateResponse.body.message).toBe(
      "Comentário adicionado com sucesso"
    );

    const commentId = CreateResponse.body.commentId;

    const removeResponse = await request(server.server)
      .delete(`/meetings/${commentId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(removeResponse.status).toBe(204);
  });

  it("Should not allow user to delete another user's comment", async () => {
    // Cria um novo comentário usando a primeira conta de usuário
    const createResponse = await request(server.server)
      .post("/meetings/clip1obpm0001c0jo4ffw5bm4/comments")
      .send({
        content: "teste de comentário no meeting",
      })
      .set("Authorization", `Bearer ${token}`);
  
    // Extrai o ID do comentário criado
    const commentId = createResponse.body.commentId;
  
    // Tenta excluir o comentário usando a segunda conta de usuário
    const removeResponse = await request(server.server)
    .delete(`/meetings/${commentId}/comments`)
    .set("Authorization", `Bearer ${token2}`)
  
    // Verifica se a operação falhou
    expect(removeResponse.status).toBe(500);
    expect(removeResponse.body).toStrictEqual({
      "error": "Error removing comment: Error: Você não tem permissão para excluir esse comentário"
    });
  });
});
