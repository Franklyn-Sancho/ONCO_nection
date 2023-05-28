import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let server: FastifyInstance;

describe("UserController", () => {
  beforeAll(async () => {
    server = await serverPromise;
    await prisma.user.create({
        data: {
            name: 'Teste User Autentication',
            email: "test-autentication@example.com",
            password: 'password',
        }
    })
  });

  afterAll(async () => {
    server.close();
    await prisma.user.delete({
        where: {
            email: 'test-autentication@example.com'
        }
    })
  });



  it("Should authenticate a user", async () => {
    const response = await request(server.server).post("/user/login").send({
        email: "test-autentication@example.com",
        password: 'password',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('token')
  });
});