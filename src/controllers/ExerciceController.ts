import {ExerciseRepository} from "../repositories/exercise-repository";
import { Request, Response } from 'express'

const exerciseRepository = new ExerciseRepository()

export class ExerciseController {
    async create(req: Request, res: Response) {
      const {name, description,  muscleGroup, imageUrl, gifUrl} = req.body

        try {
            const exercise = await exerciseRepository.create({
                name,
                description,
                muscleGroup,
                imageUrl,
                gifUrl
            })

            return res.status(201).json(exercise)
        }catch(error){
          console.log(error)
            return res.status(500).json({error: 'Erro ao criar exercicio'})
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const exercise = await exerciseRepository.findAll()
            return res.status(200).json(exercise)
        }catch (error){
            console.log(error)
            return res.status(500).json({error: 'Erro ao getAllEXERCICIOS' })
        }
    }

 async getExerciseById(req: Request, res: Response) {
        const {id} = req.params
        try {
            const exercise = await exerciseRepository.findById(Number(id))
            if (!exercise) {
                return res.status(404).json({error:'Exercicio nao encontrado'})
            }
            return res.status(200).json(exercise)
        }catch (error){
            console.log(error)
            return res.status(500).json({error: 'Erro ao getidExercicio' })
        }
    }
}