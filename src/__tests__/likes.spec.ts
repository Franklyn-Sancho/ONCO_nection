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
    console.log(token);

  });

  afterAll(async () => {
    await prisma.likes.deleteMany({});
    server.close();
  });

  it("Should create a like on meeting", async () => {
    const response = await request(server.server)
      .post(`/meetings/clip1obpm0001c0jo4ffw5bm4/likes`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it("Should create a like on mural", async () => {
    const response = await request(server.server)
      .post(`/mural/clklga0ke0001c0irn55f0w5e/likes`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it("should to return a error page not found", async() => {
    const response = await request(server.server)
      .post("/meeting/1/likes")
      .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(404);
  })
});
