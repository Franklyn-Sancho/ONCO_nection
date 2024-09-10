import { prisma } from "../config/providers";


export async function checkIfEmailIsValid(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return !!user
}
