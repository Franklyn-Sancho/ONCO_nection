import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let server: FastifyInstance;

describe("MeetingController", () => {
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

  it("Should create a new meeting", async () => {
    const response = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        title: "title",
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
      console.log(token)

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      message: "Meeting criado com sucesso",
    });
  });

  it("Should to return title error validation", async () => {
    const response = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        /* title: "title", */
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
      console.log(token)

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
        /* body: "body", */
      })
      .set("Authorization", `Bearer ${token}`);
      console.log(token)

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
        /* body: "body", */
      })
      /* .set("Authorization", `Bearer ${token}`);
      console.log(token) */

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      error: "Falha na autenticação",
    });
  });
});
