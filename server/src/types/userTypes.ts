import { FastifyRequest } from "fastify";
import { BodyParams } from "./bodyTypes";

export interface UserRequest extends FastifyRequest {
  user: {
    userId: string;
  };
  params: {
    id: string;
  };
  body: BodyParams;
}
