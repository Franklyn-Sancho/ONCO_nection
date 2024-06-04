import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { describe } from "node:test";

const prisma = new PrismaClient();

let server: FastifyInstance;

describe("UserController", () => {
  beforeAll(async () => {
    server = await serverPromise;
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        email: "test@email.com",
      },
    });
    server.close();
  });

  //This pass just if nodemailer is up (check utils/nodemailer.ts)
  it("Should create a user", async () => {
    const response = await request(server.server).post("/user/register").send({
      name: "Test User Register",
      email: "test@email.com",
      password: "password",
    });

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      message: "Registro feito com sucesso",
    });
  });

  it("Should to return validation error name required", async () => {
    const response = await request(server.server).post("/user/register").send({
      email: "test@email.com",
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: nome requerido, verifique seus dados",
    });
  });

  it("Should to return validation error name and email", async () => {
    const response = await request(server.server).post("/user/register").send({
      email: "clarinha@email.com",
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: nome requerido",
    });
  });
  it("Should to return validation password error", async () => {
    const response = await request(server.server).post("/user/register").send({
      name: "test",
      email: "test@email.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: senha requerida, verifique seus dados",
    });
  });

  it("should return an error if the email already exists", async () => {
    const response = await request(server.server).post("/user/register").send({
      name: "test1",
      email: "test1@email.com",
      password: "12345",
    });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: verifique seus dados",
    });
  });
});
