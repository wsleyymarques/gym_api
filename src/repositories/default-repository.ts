import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

type DelegateKeys = {
    [K in keyof PrismaClient]: PrismaClient[K] extends {
        findMany: any
    } ? K : never
}[keyof PrismaClient]

export class DefaultRepository<T extends DelegateKeys> {
    protected repository: PrismaClient[T]

    constructor(model: T) {
        this.repository = prisma[model]
    }

    async create(data: any) {
        return this.repository.create({ data })
    }

    async findAll() {
        return this.repository.findMany()
    }

    async findById(id: number) {
        return this.repository.findUnique({ where: { id } })
    }

    async update(id: number, data: any) {
        return this.repository.update({ where: { id }, data })
    }

    async delete(id: number) {
        return this.repository.delete({ where: { id } })
    }
}
