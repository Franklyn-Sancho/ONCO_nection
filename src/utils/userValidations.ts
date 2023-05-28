import { z } from "zod";
import { checkIfEmailIsValid } from "./checkIfEmailIsValid";

export const userValidade = z.object({
    name: z.string({ required_error: "nome requerido" }),
    email: z
      .string({ required_error: "email requerido" })
      .email()
      .refine(async (e) => {
        return await checkIfEmailIsValid(e);
      }, "verifique seus dados"),
    password: z.string({ required_error: "senha requerida" }),
  });