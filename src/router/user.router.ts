import { FastifyInstance } from "fastify";
import UserController from "../controller/UserController";
import { authenticate } from "../plugins/authenticate";

const userController = new UserController()

export default async function userRouter(fastify: FastifyInstance) {

    fastify.get('/main' ,{onRequest: [authenticate]}, (request, reply) => {reply.send("bem vindo")})

    fastify.post("/user/register", userController.createUser.bind(userController))
    fastify.post("/user/login", userController.authenticateUser.bind(userController))
}

