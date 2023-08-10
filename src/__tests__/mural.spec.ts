import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";

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
        password: "12345"
      })
      token2 = response2.body.token
    });
  
    afterAll((done) => {
      server.close(done);
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
        expect(response.body.message).toBe(
          "Mural publicado com sucesso"
        );
    });
  
    it("Should update a mural", async () => {
      // Cria um novo meeting
      const createResponse = await request(server.server)
        .post("/mural/create")
        .send({
          body: "mural test update",
        })
        .set("Authorization", `Bearer ${token}`);
    
      // Extrai o ID do meeting criado
      const muralId = createResponse.body.muralId;

      console.log(muralId)
    
      // Atualiza o meeting
      const updateResponse = await request(server.server)
        .put(`/mural/${muralId}/update`)
        .send({
          body: "novo mural teste update",
        })
        .set("Authorization", `Bearer ${token}`);
    
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body).toStrictEqual({
        message: "mural atualizado com sucesso"
      });
    });
  
    it("Should delete a mural", async () => {
      // Cria um novo meeting
      const createResponse = await request(server.server)
        .post("/mural/create")
        .send({
          body: "body",
        })
        .set("Authorization", `Bearer ${token}`);
    
      // Extrai o ID do meeting criado
      const muralId = createResponse.body.muralId

      console.log(muralId)
    
      // Atualiza o meeting
      const deleteResponse = await request(server.server)
        .delete(`/mural/${muralId}/delete`)
        .set("Authorization", `Bearer ${token}`);
    
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toStrictEqual({
        message: "mural deletado com sucesso"
      });
    });
  
    it("Should to return body error validation", async () => {
      const response = await request(server.server)
        .post("/mural/create")
        .send({
          /* body: "body", */
        })
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        message: "Ocorreu um erro: body is required",
      });
    });
  
    it("Should not create a meeting without an authenticated user", async () => {
      const response = await request(server.server)
        .post("/mural/create")
        .send({
          body: "body",
        })
        /* .set("Authorization", `Bearer ${token}`);*/
  
      expect(response.status).toBe(401);
      expect(response.body).toStrictEqual({
        error: "Unauthorized",
        message: "falha na autenticação",
        statusCode: 401,
      });
    });

    it("Should not allow user to delete another user's mural", async () => {
      // Cria um novo comentário usando a primeira conta de usuário
      const createResponse = await request(server.server)
        .post("/mural/create")
        .send({
          body: "body",
        })
        .set("Authorization", `Bearer ${token}`);
    
      // Extrai o ID do meeting criado
      const muralId = createResponse.body.muralId;
  
      // Tenta excluir o comentário usando a segunda conta de usuário
      const removeResponse = await request(server.server)
      .delete(`/mural/${muralId}/delete`)
      .set("Authorization", `Bearer ${token2}`)
    
      // Verifica se a operação falhou
      expect(removeResponse.status).toBe(403);
      expect(removeResponse.body).toStrictEqual({
        error: "Forbidden",
        message: "Você não tem permissão para excluir este conteúdo",
        statusCode: 403,
      });
    });
  });
  