import { PrismaClient } from "@prisma/client";

//prisma object instance
const prisma = new PrismaClient();

//This utils function checks whether the e-mail exists in the database
export async function checkIfEmailIsValidRegister(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user === null;
}

export async function checkIfEmailIsValidAuthentication(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
}
