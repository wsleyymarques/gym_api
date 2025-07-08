import {PrismaClient} from "@prisma/client";
import {DefaultRepository} from "./default-repository";

const prisma = new PrismaClient()

export class UserRepository extends DefaultRepository<'user'>{
    constructor() {
        super('user');
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: {email}
        });
    }
}