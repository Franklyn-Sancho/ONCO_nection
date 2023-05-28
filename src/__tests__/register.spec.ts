import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let server: FastifyInstance;

describe("UserController", () => {
  beforeAll(async () => {
    server = await serverPromise;
  });

  afterAll((done) => {
    server.close(done);
  });

  it("Should create a user", async () => {
    const response = await request(server.server).post("/user/register").send({
      name: "Test User Register",
      email: "test-register@example.com",
      password: "password",
    });

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      message: "Registro feito com sucesso",
    });

    await prisma.user.delete({
      where: {
        email: "test@example.com",
      },
    });
  });

  it("Should to return validation error", async () => {
    const response = await request(server.server).post("/user/register").send({
      email: "rachel@email.com",
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: nome requerido",
    });
  });

  it("Should to return email error", async () => {
    const response = await request(server.server).post("/user/register").send({
      name: "clarinha",
      email: "clarinha@email.com",
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: verifique seus dados",
    });
  });
});
