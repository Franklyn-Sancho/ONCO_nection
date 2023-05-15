import { PrismaClient, User} from "@prisma/client";

const prisma = new PrismaClient()

export class MeetingRepository {
    constructor(
        public title: string,
        public body: string,
        public userId: User,
    ) {}

    async save(): Promise<void> {
        await prisma.meetings.create({
            data: {
                title: this.title,
                body: this.body,
                userId: this.userId.id
            }
        })
    }
}
