import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient()

//* => adicionar funcionalidade para logar com o google!

//class user repository
export default class UserRepository {

    //repository layer create new user
    async create(user: User): Promise<User> {
        const createUser = await prisma.user.create({
            data: user,
        })
        return createUser
    }

    //repository layer find user
    async findByEmail(email: string): Promise<User | null> {
        const dbUser = await prisma.user.findUnique({
            where: {
                email,
            }
        })

        return dbUser;
    }

    async updateUser(id: string, data: Partial<User>): Promise<void> {
        await prisma.user.update({
            where: {id},
            data,
        })
    } 
}

