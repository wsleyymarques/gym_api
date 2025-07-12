import { PrismaClient } from '@prisma/client'
import { DefaultRepository } from './default-repository'

const prisma = new PrismaClient()

export class WorkoutExerciseRepository extends DefaultRepository<'workoutExercise'> {
    constructor() {
        super('workoutExercise')
    }

    async findAllByWorkoutId(workoutId: number) {
        return prisma.workoutExercise.findMany({
            where: { workoutId },
            include: {
                exercise: true // inclui os dados do exercício
            },
            orderBy: { order: 'asc' } // ordenação opcional por ordem do treino
        })
    }
}