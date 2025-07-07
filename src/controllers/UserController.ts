import { Request, Response } from 'express'
import { UserRepository } from '../repositories/user-repository'
import bcrypt from 'bcrypt'

const userRepository = new UserRepository()

export class UserController {
    async create(req: Request, res: Response) {
        const { name, email, password } = req.body
        try {
            const hashedPassword = await bcrypt.hash(password,10)
            const user = await userRepository.create({name, email, password: hashedPassword})
            return res.status(201).json(user)
        }catch(error) {
            return res.status(400).json({error: 'Erro ao criar usuario.'})

        }
    }
}
