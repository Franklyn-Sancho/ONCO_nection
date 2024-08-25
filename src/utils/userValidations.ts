//utils validations with Zod 
import { z } from "zod";
import { checkIfEmailIsValid } from "./checkIfEmailIsValid";

//Zod register user validations 
export const userRegisterValidade = z.object({
  name: z.string({ required_error: "name is required" }),
  email: z
    .string({ required_error: "email is required" })
    .email()
    //this refine call the checkIfEmailIsValid => ./checkIfEmailIsValid.ts
    .refine(async (e) => {
      const result = !(await checkIfEmailIsValid(e)); 
      return result;
    }, "check your datas"),
  password: z.string({ required_error: "password is required" }),
});

//Zod authentications user validations 
export const userAutenticateValidade = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email()
    .refine(async (e) => {
      //this refine call the checkIfEmailIsValid => ./checkIfEmailIsValid.ts
      return await checkIfEmailIsValid(e);
    }, "check your details"),
  password: z.string({ required_error: "password is required" }),
});
