import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export class MeetingRepository {
  constructor(public title: string, public body: string, public userId: User) {}

  async save(): Promise<void> {
    console.log(
      "Salvando dados no banco de dados:",
      this.title,
      this.body,
      this.userId.id
    );

    await prisma.meetings.create({
      data: {
        title: this.title,
        body: this.body,
        userId: this.userId.id,
      },
    });
  }
}
