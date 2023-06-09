import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

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

  afterAll((done) => {
    server.close(done);
  });

  it("Should a new comment on meeting", async () => {
    const response = await request(server.server)
      .post("/meeting/clip2ga270003c0xzs789g1ed/comments")
      .send({
        content: "teste de comentário"
      })
      .set("Authorization", `Bearer ${token}`);
      console.log(token)

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      message: "Comentário adicionado com sucesso",
    });
  });

  it("Should to return content error validation", async () => {
    const response = await request(server.server)
      .post("/meeting/clit2d2l60003c0u2jnp4fjxe/comments")
      .send({
        
      })
      .set("Authorization", `Bearer ${token}`);
      console.log(token)

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: content is required",
    });
  });

  it("Should not create a comment without an authenticated user", async () => {
    const response = await request(server.server)
      .post("/meeting/clit2d2l60003c0u2jnp4fjxe/comments")
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
});
