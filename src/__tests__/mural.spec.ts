import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let server: FastifyInstance;

describe("MuralController", () => {
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
    await prisma.mural.deleteMany({});
    server.close();
  });

  it("Should create a new mural", async () => {
    const response = await request(server.server)
      .post("/mural/create")
      .send({
        body: "mural body",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("muralId");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Mural was published successfully");
  });

  it("Should update a mural", async () => {
    // Cria um novo meeting
    const createResponse = await request(server.server)
      .post("/mural/create")
      .send({
        body: "mural test update",
      })
      .set("Authorization", `Bearer ${token}`);

    const muralId = createResponse.body.muralId;

    console.log(muralId);

    const updateResponse = await request(server.server)
      .put(`/mural/${muralId}/update`)
      .send({
        body: "novo mural teste update",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toStrictEqual({
      message: "mural was updated successfully",
    });
  });

  it("Should delete a mural", async () => {
    const createResponse = await request(server.server)
      .post("/mural/create")
      .send({
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);

    const muralId = createResponse.body.muralId;

    console.log(muralId);

    const deleteResponse = await request(server.server)
      .delete(`/mural/${muralId}/delete`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toStrictEqual({
      message: "mural was deleted successfully",
      muralId: muralId,
    });
  });

  it("Should to return body error validation", async () => {
    const response = await request(server.server)
      .post("/mural/create")
      .send({
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "an error has occurred : body is required",
    });
  });

  it("Should not create a mural without an authenticated user", async () => {
    const response = await request(server.server).post("/mural/create").send({
      body: "body",
    });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      error: "Unauthorized",
      message: "falha de autenticação",
      statusCode: 401,
    });
  });

  it("Should not allow user to delete another user's mural", async () => {
    const createResponse = await request(server.server)
      .post("/mural/create")
      .send({
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);

    const muralId = createResponse.body.muralId;

    const removeResponse = await request(server.server)
      .delete(`/mural/${muralId}/delete`)
      .set("Authorization", `Bearer ${token2}`);

    expect(removeResponse.status).toBe(403);
    expect(removeResponse.body).toStrictEqual({
      error: "Forbidden",
      message: "You do not have permission to delete this mural",
      statusCode: 403,
    });
  });
});
