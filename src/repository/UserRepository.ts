import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient()

//class user repository
export default class UserRepository {

    //repository layer create new user
    async createUser(user: User): Promise<User> {
        const createUser = await prisma.user.create({
            data: user,
        })
        return createUser
    }

    //repository layer find user by email
    async findByEmail(email: string): Promise<User | null> {
        const dbUser = await prisma.user.findUnique({
            where: {
                email,
            }
        })

        return dbUser;
    }
}

