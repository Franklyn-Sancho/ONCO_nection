import request from "supertest";
import serverPromise from "../server";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";

const prisma = new PrismaClient();

let server: FastifyInstance;

describe("ChatAndMessageController", () => {
  let token = "";
  let token2 = "";
  let friendshipId = "";
  let chatId = "";

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

  beforeEach(async () => {
    const sendFriendship = await request(server.server)
      .post("/friendships")
      .send({
        addressedId: "cln8wl1bb0002c0ia18saphih",
      })
      .set("Authorization", `Bearer ${token}`);

    friendshipId = sendFriendship.body.friendshipId;

    const acceptedFriendship = await request(server.server)
      .put(`/friendships/${friendshipId}`)
      .send({
        status: "ACCEPTED",
      })
      .set("Authorization", `Bearer ${token2}`);

    chatId = acceptedFriendship.body.chatId;
  });

  afterAll(async () => {
    await prisma.friendship.deleteMany({});
    await prisma.chat.deleteMany({});
    server.close();
  });

  it("Should to send a message to user", async () => {
    const response = await request(server.server)
      .post(`/chat/${chatId}/message`)
      .send({
        content: "message de teste",
        recipientId: "cln8zucsq0002c0osg87hu37v"
      })
      .set("Authorization", `Bearer ${token}`);

    console.log(friendshipId)
    console.log(chatId);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      message: "Mensagem enviada com sucesso",
    });
  });
});
