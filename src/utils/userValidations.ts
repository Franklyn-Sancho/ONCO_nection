//utils validations with Zod 
import { z } from "zod";
import { checkIfEmailIsValidAuthentication, checkIfEmailIsValidRegister } from "./checkIfEmailIsValid";

//Zod register user validations 
export const userRegisterValidade = z.object({
  name: z.string({ required_error: "nome requerido" }),
  email: z
    .string({ required_error: "email requerido" })
    .email()
    //this refine call the checkIfEmailIsValid => ./checkIfEmailIsValid.ts
    .refine(async (e) => {
      return await checkIfEmailIsValidRegister(e);
    }, "verifique seus dados"),
  password: z.string({ required_error: "senha requerida" }),
});

//Zod authentications user validations 
export const userAutenticateValidade = z.object({
  email: z
    .string({ required_error: "email requerido" })
    .email()
    .refine(async (e) => {
      //this refine call the checkIfEmailIsValid => ./checkIfEmailIsValid.ts
      return await checkIfEmailIsValidAuthentication(e);
    }, "verifique seus dados"),
  password: z.string({ required_error: "senha requerida" }),
});
