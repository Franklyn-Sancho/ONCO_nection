import { FastifyInstance } from "fastify";
import { authenticate } from "../plugins/authenticate";
import { userController } from "../utils/providers";

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

  fastify.get(
    "/user/:id",
   /*  { preHandler: [authenticate] }, */
    userController.findUserById.bind(userController)
  );

  fastify.post(
    "/user/blockuser/:blockedId",
    { preHandler: [authenticate] },
    userController.blockUser.bind(userController)
  );
}
