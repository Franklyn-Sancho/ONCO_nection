import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let server: FastifyInstance;


describe("CommentsController", () => {
  let token = "";

  beforeAll(async () => {
    server = await serverPromise;
    const response = await request(server.server).post("/user/login").send({
      email: "test1@email.com",
      password: "12345",
    });
    token = response.body.token;
  });

  afterAll(async () => {
    await prisma.comments.deleteMany({});
    server.close();
  });

  it("Should a new comment on meeting", async () => {
    const response = await request(server.server)
      .post("/meetings/clip1obpm0001c0jo4ffw5bm4/comments")
      .send({
        content: "teste de comentário no meeting"
      })
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      message: "Comentário adicionado com sucesso",
    });
  });

  it("Should a new comment on mural", async () => {
    const response = await request(server.server)
      .post("/mural/clkiw8h110001c0shj62cvqy7/comments")
      .send({
        content: "teste de comentário no mural"
      })
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      message: "Comentário adicionado com sucesso",
    });
  });

  it("Should to return content error validation on meeting", async () => {
    const response = await request(server.server)
      .post("/meetings/clip1obpm0001c0jo4ffw5bm4/comments")
      .send({
        
      })
      .set("Authorization", `Bearer ${token}`);
      console.log(token)

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: content is required",
    });
  });

  it("Should to return content error validation on mural", async () => {
    const response = await request(server.server)
      .post("/mural/clklga0ke0001c0irn55f0w5e/comments")
      .send({
        
      })
      .set("Authorization", `Bearer ${token}`);
      console.log(token)

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: content is required",
    });
  });

  it("Should not create a comment without an authenticated user on meeting", async () => {
    const response = await request(server.server)
      .post("/meetings/clip1obpm0001c0jo4ffw5bm4/comments")
      .send({
        content: "texto de teste"
      })
      /* .set("Authorization", `Bearer ${token}`);
      console.log(token) */

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      error: "Falha na autenticação",
    });
  });

  it("Should not create a comment without an authenticated user on mural", async () => {
    const response = await request(server.server)
      .post("/mural/clklga0ke0001c0irn55f0w5e/comments")
      .send({
        body: "texto de teste"
      })
      /* .set("Authorization", `Bearer ${token}`);
      console.log(token) */

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      error: "Falha na autenticação",
    });
  });
});
