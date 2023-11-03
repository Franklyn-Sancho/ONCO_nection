import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let server: FastifyInstance;

describe("FriendshipsController", () => {
  let token = "";
  let token2 = "";
  let token3 = "";
  let friendshipId = "";

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

    const response3 = await request(server.server).post("/user/login").send({
      email: "margaux@email.com",
      password: "12345",
    });
    token3 = response3.body.token;
  });

  beforeEach(async () => {
    const sendFriendship = await request(server.server)
      .post("/friendships")
      .send({
        addressedId: "cln8wl1bb0002c0ia18saphih",
      })
      .set("Authorization", `Bearer ${token}`);

    friendshipId = sendFriendship.body.friendshipId;

    await request(server.server)
      .put(`/friendships/${friendshipId}`)
      .send({
        status: "ACCEPTED",
      })
      .set("Authorization", `Bearer ${token2}`);
  });

  afterAll(async () => {
    await prisma.friendship.deleteMany({});
    await prisma.chat.deleteMany({})
    server.close();
  });

  it("Should to send a friendship solicitation", async () => {
    const response = await request(server.server)
      .post("/friendships")
      .send({
        addressedId: "cloegg7st0000c0rlhrhej8mx",
      })
      .set("Authorization", `Bearer ${token}`);

    const friendship = response.body.friendshipId;

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      message: "Solicitação de amizade enviada",
      friendshipId: friendship,
    });

    await prisma.friendship.deleteMany({});
  });

  it("addressed should to delete a friendship", async () => {
    const deleteFriendship = await request(server.server)
      .delete(`/friendship/${friendshipId}`)
      .set("Authorization", `Bearer ${token2}`);

    expect(deleteFriendship.status).toBe(200);
    expect(deleteFriendship.body).toStrictEqual({
      message: "Amizade desfeita com sucesso",
    });
  });

  it("requester should to delete a friendship", async () => {
    const deleteFriendship = await request(server.server)
      .delete(`/friendship/${friendshipId}`)
      .set("Authorization", `Bearer ${token2}`);

    expect(deleteFriendship.status).toBe(200);
    expect(deleteFriendship.body).toStrictEqual({
      message: "Amizade desfeita com sucesso",
    });
  });

  it("Shouldn't to delete a friendship with no authentication", async () => {
    const deleteFriendship = await request(server.server).delete(
      `/friendship/${friendshipId}`
    );

    expect(deleteFriendship.status).toBe(401);
    expect(deleteFriendship.body).toStrictEqual({
      error: "Unauthorized",
      message: "falha de autenticação",
      statusCode: 401,
    });
  });

  it("a third user shouldn't to be able delete a friendship", async () => {
    const deleteFriendship = await request(server.server)
      .delete(`/friendship/${friendshipId}`)
      .set("Authorization", `Bearer ${token3}`);

    expect(deleteFriendship.status).toBe(403);
    expect(deleteFriendship.body).toStrictEqual({
      error: "Forbidden",
      message: "Você não tem permissão para deletar esta amizade",
      statusCode: 403,
    });
  });
});
