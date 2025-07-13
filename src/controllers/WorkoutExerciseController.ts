import { Request, Response } from 'express'
import { WorkoutExerciseRepository } from '../repositories/workout_exercise-repository'
import { WorkoutRepository } from '../repositories/workout-repository'
import { ExerciseRepository } from '../repositories/exercise-repository'

const workoutExerciseRepository = new WorkoutExerciseRepository()
const workoutRepository = new WorkoutRepository()
const exerciseRepository = new ExerciseRepository()

export class WorkoutExerciseController {
    async addExerciseToWorkout(req: Request, res: Response) {
        const workoutId = req.params.id
        const { exerciseId, order, sets, reps, restTime } = req.body

        try {
            const workout = await workoutRepository.findById(workoutId)
            if (!workout) {
                return res.status(404).json({ error: 'Treino não encontrado' })
            }

            const exercise = await exerciseRepository.findById(exerciseId)
            if (!exercise) {
                return res.status(404).json({ error: 'Exercício não encontrado' })
            }

            const workoutExercise = await workoutExerciseRepository.create({
                    workoutId,
                    exerciseId,
                    order,
                    sets,
                    reps,
                    restTime
            })

            return res.status(201).json(workoutExercise)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Erro ao adicionar exercício ao treino' })
        }
    }

    async getAllWorkoutExercise(req: Request, res: Response) {
        const workoutId = req.params.id

        try {
            const exercises = await workoutExerciseRepository.findAllByWorkoutId(workoutId)

            return res.status(200).json(exercises)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Erro ao buscar exercícios do treino' })
        }
    }
}