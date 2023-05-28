import { FastifyInstance } from "fastify";
import UserController from "../controller/UserController";
import { authenticate } from "../plugins/authenticate";

const userController = new UserController()

//user router to register, login and test authentication router
export default async function userRouter(fastify: FastifyInstance) {

    fastify.get('/main' ,{onRequest: [authenticate]}, (request, reply) => {reply.send("bem vindo")})

    fastify.post("/user/register", userController.createUser.bind(userController)) //register
    fastify.post("/user/login", userController.authenticateUser.bind(userController)) //login
}

