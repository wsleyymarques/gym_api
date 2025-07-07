import {PrismaClient} from "@prisma/client";
import {DefaultRepository} from "./default-repository";

const prisma = new PrismaClient()

export class UserRepository extends DefaultRepository<'user'>{constructor() {
    super('user');
}}