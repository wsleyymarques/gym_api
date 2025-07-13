import { Request, Response } from 'express'
import { WorkoutRepository } from '../repositories/workout-repository'

const workoutRepository = new WorkoutRepository()

export class WorkoutController {
    async create(req: Request, res: Response) {
        const { name, description, imageUrl, userId } = req.body

        try {
            const workout = await workoutRepository.create({
                name,
                description,
                imageUrl,
                userId
            })

            return res.status(201).json(workout)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Erro ao criar treino' })
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const workouts = await workoutRepository.findAll()
            return res.status(200).json(workouts)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Erro ao buscar treinos' })
        }
    }

    async getWorkoutById(req: Request, res: Response) {
        const { id } = req.params

        try {
            const workout = await workoutRepository.findById(id)
            if (!workout) {
                return res.status(404).json({ error: 'Treino não encontrado' })
            }

            return res.status(200).json(workout)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Erro ao buscar treino por ID' })
        }
    }
}