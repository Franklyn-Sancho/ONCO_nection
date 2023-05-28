import { FastifyInstance } from "fastify";
import { authenticate } from "../plugins/authenticate";
import { MuralController } from "../controller/MuralController";

const muralController = new MuralController();

//murals router to find and view 
export default async function muralRouter(fastify: FastifyInstance) {
  fastify.get(
    "/mural",
    {
      preHandler: [authenticate],
    },
    (request, reply) => {
      muralController.find.bind(muralController);
    }
  );

  fastify.get("/mural/:id", muralController.find.bind(muralController)) //find mural by id 

  fastify.post("/mural/create", muralController.create.bind(muralController)); //create a mural
}
