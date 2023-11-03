import { FastifyInstance } from "fastify";
import UserController from "../controller/UserController";
import { authenticate } from "../plugins/authenticate";

const userController = new UserController();

//user router to register, login and test authentication router
export default async function userRouter(fastify: FastifyInstance) {
  fastify.get("/main", { onRequest: [authenticate] }, (request, reply) => {
    reply.send("bem vindo");
  });

  fastify.post("/user/register", userController.register.bind(userController)); //register
  fastify.post("/user/login", userController.authenticate.bind(userController)); //login

  fastify.get(
    "/confirm-email/:token",
    userController.confirmEmail.bind(userController)
  );

  fastify.get(
    "/user/finduser/:name",
    { preHandler: [authenticate] },
    userController.findUserByName.bind(userController)
  );

  fastify.post(
    "/user/blockuser/:blockedId",
    { preHandler: [authenticate] },
    userController.blockUser.bind(userController)
  );
}
