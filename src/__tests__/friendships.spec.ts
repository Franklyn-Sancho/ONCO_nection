import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let server: FastifyInstance;

describe("FriendshipsController", () => {
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
  
    /* afterAll(async () => {
        await prisma.friendship.deleteMany({});
        server.close();
      });
   */
    it("Should to send a friendship solicitation", async () => {
      const response = await request(server.server)
        .post("/friendships")
        .send({
            addressedId: "cln8wl1bb0002c0ia18saphih"
        })
        .set("Authorization", `Bearer ${token}`)
  
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        message: "Solicitação de amizade enviada",
      });
    });
  
    it("Should to accept a friendship solicitation", async () => {
      const response = await request(server.server)
        .put("/friendships/clniwvbs00001c0mh51s3ydmq")
        .send({
          status: "ACCEPTED"
        })
        .set("Authorization", `Bearer ${token2}`)
  
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        message: "Solicitação de amizade aceita",
      });
    });
  
    
  });