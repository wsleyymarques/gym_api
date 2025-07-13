import { PrismaClient } from '@prisma/client'
import { DefaultRepository } from './default-repository'

const prisma = new PrismaClient()

export class WorkoutExerciseRepository extends DefaultRepository<'workoutExercise'> {
    constructor() {
        super('workoutExercise')
    }

    async findAllByWorkoutId(workoutId: string) {
        return prisma.workoutExercise.findMany({
            where: { workoutId },
            include: {
                exercise: true
            },
            orderBy: { order: 'asc' }
        })
    }
}