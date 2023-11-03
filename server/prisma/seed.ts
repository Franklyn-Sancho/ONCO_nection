import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "clarinha",
      email: "clairinha@email.com",
      password: "12345",
    },
  });

  const meetings = await prisma.meetings.create({
    data: {
      title: "conversa teste",
      body: "conversa teste",
      userId: user.id,
      createdAt: "2022-11-10T16:56:05.622Z",
    },
  });
}

main();
