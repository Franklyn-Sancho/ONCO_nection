import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import serverPromise from "../server";

const prisma = new PrismaClient();

let server: FastifyInstance;

describe("LikeController", () => {
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
    await prisma.likes.deleteMany({});
    server.close();
  });

  it("Should create a new like on meeting", async () => {
    // Primeiro, crie um novo meeting e obtenha o meetingId
    const meetingResponse = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        title: "title",
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
    const meetingId = meetingResponse.body.meetingId;
    console.log(meetingId);

    // Em seguida, use o meetingId para criar um novo comentário
    const likesResponse = await request(server.server)
      .post(`/meetings/${meetingId}/likes`)
      .set("Authorization", `Bearer ${token}`)
      .send({})

      expect(likesResponse.status).toBe(204);
  });

  it("Should create a new like on mural", async () => {
    // Primeiro, crie um novo meeting e obtenha o meetingId
    const meetingResponse = await request(server.server)
      .post("/mural/create")
      .send({
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
    const muralId = meetingResponse.body.muralId;
    console.log(muralId);

    // Em seguida, use o meetingId para criar um novo comentário
    const likesResponse = await request(server.server)
      .post(`/mural/${muralId}/likes`)
      .set("Authorization", `Bearer ${token}`)
      .send({})

      expect(likesResponse.status).toBe(204);
  });


  it("should to return a error page not found", async() => {
    const response = await request(server.server)
      .post("/meeting/1/likes")
      .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(404);
  })
});
