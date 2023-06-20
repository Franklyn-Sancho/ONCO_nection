import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import serverPromise from "../server";

const prisma = new PrismaClient();

let server: FastifyInstance;

//EM CONSTRUÇÃO
describe("LikeController", () => {
  let token = "";
  let meetingId = "";

  beforeAll(async () => {
    server = await serverPromise;

    const response = await request(server.server).post("/user/login").send({
      email: "test1@email.com",
      password: "12345",
    });
    token = response.body.token;
    console.log(token);

  });

  afterAll(async () => {
    await prisma.likes.deleteMany({});
    server.close();
  });

  it("Should create a like", async () => {
    const response = await request(server.server)
      .post(`/meetings/clj4erwlp0001c0f1002hccen/likes`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it("should to return a error", async() => {
    const response = await request(server.server)
      .post("/meeting/1/likes")
      .set("Authorization", `Bearer ${token}`)
  })
});
