import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

let server: FastifyInstance;

describe("UserController", () => {
  const prisma = new PrismaClient();

  beforeAll(async () => {
    server = await serverPromise;
    const hashedPassword = await bcrypt.hash("12345", 10);
    await prisma.user.create({
      data: {
        name: "Teste User Autentication",
        email: "test-authentication@example.com",
        password: hashedPassword,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        email: "test-authentication@example.com",
      },
    });
    server.close();
  });

  it("Should authenticate a user", async () => {
    const response = await request(server.server).post("/user/login").send({
      email: "test-authentication@example.com",
      password: "12345",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("Should to return validation error", async () => {
    const response = await request(server.server).post("/user/login").send({
      password: "password",
    });
  
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "an error has occurred: email is required",
    });
  });
  
  it("should to return a authentication error", async () => {
    const response = await request(server.server).post("/user/login").send({
      email: "test-authentication@example.com",
      password: "1234", //12345
    });
  
    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      error: "Email ou senha inválidos",
    });
  });

  it("Should to return user error not exist", async () => {
    const response = await request(server.server).post("/user/login").send({
      email: "test-authenticatio@example.com",
      password: "12345",
    });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Ocorreu um erro: verifique seus dados",
    });
  });
});


