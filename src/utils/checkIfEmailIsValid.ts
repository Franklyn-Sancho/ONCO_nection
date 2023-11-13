import { PrismaClient } from "@prisma/client";

//prisma object instance
const prisma = new PrismaClient();

export async function checkIfEmailIsValid(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return !!user
}
