import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

type DelegateKeys = {
    [K in keyof PrismaClient]: PrismaClient[K] extends {
        findMany: (...args: any[]) => any
    } ? K : never
}[keyof PrismaClient]

type DelegateType<T extends DelegateKeys> = PrismaClient[T]

export class DefaultRepository<T extends DelegateKeys> {
    protected repository: DelegateType<T>

    constructor(model: T) {
        this.repository = prisma[model]
    }

    async create(data: Prisma.Args<DelegateType<T>, 'create'>['data']) {
        return (this.repository as any).create({ data })
    }

    async findAll() {
        return (this.repository as any).findMany()
    }

    async findById(id: string) {
        return (this.repository as any).findUnique({ where: { id } })
    }

    async update(id: string, data: Prisma.Args<DelegateType<T>, 'update'>['data']) {
        return (this.repository as any).update({ where: { id }, data })
    }

    async delete(id: string) {
        return (this.repository as any).delete({ where: { id } })
    }
}