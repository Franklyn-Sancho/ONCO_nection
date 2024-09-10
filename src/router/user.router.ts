import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/authenticate";
import { userController } from "../utils/providers";
import { handleAuthenticate, handleRequestPasswordReset, handleResetPassword } from "../auth/email/emailAuthController";

//user router to register, login and test authentication router
export default async function userRouter(fastify: FastifyInstance) {
  fastify.get("/main", { onRequest: [authenticate] }, (request, reply) => {
    reply.send("bem vindo");
  });

  fastify.post(
    "/user/register",
    userController.registerWithEmail.bind(userController)
  );

  fastify.post("/user/login",
    handleAuthenticate
  );

  fastify.post(
    "/user/logout",
    { preHandler: [authenticate] },
    handleAuthenticate
  );

  fastify.get(
    "/confirm-email/:token",
    userController.handleConfirmEmail.bind(userController)
  );

  fastify.get(
    "/auth/reset-password/:token",
    userController.handleResetPasswordEmail.bind(userController)
);

  fastify.get(
    "/user/finduser/:name",

    { preHandler: [authenticate] },
    userController.findUserByName.bind(userController)
  );

  fastify.get(
    "/user/:id",
    /*{ preHandler: [authenticate] } */
    userController.findUserById.bind(userController)
  );

  fastify.get(
    "/user/profile/:name",

    { preHandler: [authenticate] },
    userController.findUserProfile.bind(userController)
  );

  fastify.post(
    "/user/blockuser/:blockedId",
    { preHandler: [authenticate] },
    userController.blockUser.bind(userController)
  );

  fastify.put("/user/deactivate",
    { preHandler: [authenticate] },
    userController.deactivateUserHandler.bind(userController));

  fastify.put("/user/mark-for-deletion",
    { preHandler: [authenticate] },
    userController.markUserForDeletionHandler.bind(userController));

  fastify.post("/user/process-scheduled-deletions",
    userController.permanentlyDeleteUserHandler.bind(userController)
  ); // Pode ser agendado ou chamado manualmente

  fastify.post('/request-password-reset', (request, reply) =>  handleRequestPasswordReset(request, reply));
  fastify.post('/reset-password', { preHandler: [authenticate] }, (request, reply) => handleResetPassword(request, reply));
}