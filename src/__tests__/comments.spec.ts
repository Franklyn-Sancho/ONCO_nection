import request from "supertest";
import serverPromise from "../server";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let server: FastifyInstance;

describe("CommentsController", () => {
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
    await prisma.comments.deleteMany({});
    server.close();
  });

  it("Should create a new comment on meeting", async () => {
    // Primeiro, crie um novo meeting e obtenha o meetingId
    const meetingResponse = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        title: "title",
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
    const meetingId = meetingResponse.body.meetingId;
    console.log(meetingId);

    // Em seguida, use o meetingId para criar um novo comentário
    const commentResponse = await request(server.server)
      .post(`/meetings/${meetingId}/comments`)
      .send({
        content: "Comentário de teste",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(commentResponse.status).toBe(201);
    expect(commentResponse.body).toStrictEqual({
      commentId: commentResponse.body.commentId,
      message: "Comentário adicionado com sucesso",
    });
  });

  it("Should create a new comment on mural", async () => {
    // Primeiro, crie um novo meeting e obtenha o meetingId
    const meetingResponse = await request(server.server)
      .post("/mural/create")
      .send({
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
    const muralId = meetingResponse.body.muralId;
    console.log(muralId);

    // Em seguida, use o meetingId para criar um novo comentário
    const commentResponse = await request(server.server)
      .post(`/mural/${muralId}/comments`)
      .send({
        content: "Comentário de teste",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(commentResponse.status).toBe(201);
    expect(commentResponse.body).toStrictEqual({
      commentId: commentResponse.body.commentId,
      message: "Comentário adicionado com sucesso",
    });
  });

  it("Should to return content error validation on meeting", async () => {
    // Primeiro, crie um novo meeting e obtenha o meetingId
    const meetingResponse = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        title: "title",
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
    const meetingId = meetingResponse.body.meetingId;
    console.log(meetingId);

    // Em seguida, use o meetingId para criar um novo comentário
    const commentResponse = await request(server.server)
      .post(`/meetings/${meetingId}/comments`)
      .send({
        //content: "Comentário de teste",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(commentResponse.status).toBe(400);
    expect(commentResponse.body).toStrictEqual({
      message: "Ocorreu um erro: content is required",
    });
  });

  it("Should to return content error validation on mural", async () => {
    // Primeiro, crie um novo meeting e obtenha o meetingId
    const meetingResponse = await request(server.server)
      .post("/mural/create")
      .send({
        type: "type",
        title: "title",
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
    const muralId = meetingResponse.body.muralID;
    console.log(muralId);

    // Em seguida, use o meetingId para criar um novo comentário
    const commentResponse = await request(server.server)
      .post(`/mural/${muralId}/comments`)
      .send({
        //content: "Comentário de teste",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(commentResponse.status).toBe(400);
    expect(commentResponse.body).toStrictEqual({
      message: "Ocorreu um erro: content is required",
    });
  });

  it("Should to return an authentication error mural comment", async () => {
    const meetingResponse = await request(server.server)
      .post("/mural/create")
      .send({
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
    const muralId = meetingResponse.body.muralId;
    console.log(muralId);

    // Em seguida, use o meetingId para criar um novo comentário
    const commentResponse = await request(server.server)
      .post(`/mural/${muralId}/comments`)
      .send({
        content: "Comentário de teste",
      });
    /* .set("Authorization", `Bearer ${token}`); */

    expect(commentResponse.status).toBe(401);
    expect(commentResponse.body).toStrictEqual({
      message: "falha de autenticação",
      error: "Unauthorized",
      statusCode: 401,
    });
  });

  it("Should to return an authentication error meeting comment", async () => {
    const meetingResponse = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        title: "title",
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
    const meetingId = meetingResponse.body.meetingId;
    console.log(meetingId);

    // Em seguida, use o meetingId para criar um novo comentário
    const commentResponse = await request(server.server)
      .post(`/mural/${meetingId}/comments`)
      .send({
        content: "Comentário de teste",
      });
    /* .set("Authorization", `Bearer ${token}`); */

    expect(commentResponse.status).toBe(401);
    expect(commentResponse.body).toStrictEqual({
      message: "falha de autenticação",
      error: "Unauthorized",
      statusCode: 401,
    });
  });

  it("Should to create and remove comment on meeting", async () => {
    // Primeiro, crie um novo meeting e obtenha o meetingId
    const meetingResponse = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        title: "title",
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
    const meetingId = meetingResponse.body.meetingId;
    console.log(meetingId);

    // Em seguida, use o meetingId para criar um novo comentário
    const commentResponse = await request(server.server)
      .post(`/meetings/${meetingId}/comments`)
      .send({
        content: "Comentário de teste",
      })
      .set("Authorization", `Bearer ${token}`);

    const commentId = commentResponse.body.commentId;
    console.log(commentId);

    const removeResponse = await request(server.server)
      .delete(`/meetings/${commentId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(removeResponse.status).toBe(204);
  });

  it("Should to create and remove comment on mural", async () => {
    // Primeiro, crie um novo meeting e obtenha o meetingId
    const meetingResponse = await request(server.server)
      .post("/mural/create")
      .send({
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
    const muralId = meetingResponse.body.muralId;
    console.log(muralId);

    // Em seguida, use o meetingId para criar um novo comentário
    const commentResponse = await request(server.server)
      .post(`/mural/${muralId}/comments`)
      .send({
        content: "Comentário de teste",
      })
      .set("Authorization", `Bearer ${token}`);

    const commentId = commentResponse.body.commentId;
    console.log(commentId);

    const removeResponse = await request(server.server)
      .delete(`/mural/${commentId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(removeResponse.status).toBe(204);
  });

  it("Should not allow user to delete another user's meeting comment", async () => {
    // Primeiro, crie um novo meeting e obtenha o meetingId
    const meetingResponse = await request(server.server)
      .post("/meetings/create")
      .send({
        type: "type",
        title: "title",
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
    const meetingId = meetingResponse.body.meetingId;
    console.log(meetingId);

    // Em seguida, use o meetingId para criar um novo comentário
    const commentResponse = await request(server.server)
      .post(`/meetings/${meetingId}/comments`)
      .send({
        content: "Comentário de teste",
      })
      .set("Authorization", `Bearer ${token}`);

    const commentId = commentResponse.body.commentId;
    console.log(commentId);

    const removeResponse = await request(server.server)
      .delete(`/meetings/${commentId}/comments`)
      .set("Authorization", `Bearer ${token2}`)
      .send({});

    expect(removeResponse.status).toBe(401);
    expect(removeResponse.body).toStrictEqual({
      message: "falha de autenticação",
      error: "Unauthorized",
      statusCode: 401,
    })
  });

  it("Should not allow user to delete another user's mural comment", async () => {
    // Primeiro, crie um novo meeting e obtenha o meetingId
    const meetingResponse = await request(server.server)
      .post("/mural/create")
      .send({
        body: "body",
      })
      .set("Authorization", `Bearer ${token}`);
    const muralId = meetingResponse.body.muralId;
    console.log(muralId);

    // Em seguida, use o meetingId para criar um novo comentário
    const commentResponse = await request(server.server)
      .post(`/mural/${muralId}/comments`)
      .send({
        content: "Comentário de teste",
      })
      .set("Authorization", `Bearer ${token}`);

    const commentId = commentResponse.body.commentId;
    console.log(commentId);

    const removeResponse = await request(server.server)
      .delete(`/meetings/${commentId}/comments`)
      .set("Authorization", `Bearer ${token2}`)
      .send({});

    expect(removeResponse.status).toBe(401);
    expect(removeResponse.body).toStrictEqual({
      message: "falha de autenticação",
      error: "Unauthorized",
      statusCode: 401,
    })
  });
});
