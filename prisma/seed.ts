import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criação de um usuário sem senha
  const user = await prisma.user.create({
    data: {
      name: "clarinha",
      email: "clairinha@email.com",
    },
  });

  // Criação de uma autenticação para o usuário com senha
  const authentication = await prisma.authentication.create({
    data: {
      userId: user.id,
      provider: "email",
      password: "12345", // Certifique-se de que o campo 'password' está correto e existe no modelo Authentication
      // Se o providerId for necessário para OAuth, você pode adicionar aqui.
    },
  });

  // Criação de uma reunião
  const meeting = await prisma.meetings.create({
    data: {
      title: "conversa teste",
      body: "conversa teste",
      userId: user.id,
      createdAt: new Date("2022-11-10T16:56:05.622Z"), // Use `new Date()` para garantir o formato correto
    },
  });

  console.log("User created:", user);
  console.log("Authentication created:", authentication);
  console.log("Meeting created:", meeting);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

