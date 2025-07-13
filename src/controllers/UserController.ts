import { Request, Response } from 'express'
import { UserRepository } from '../repositories/user-repository'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const userRepository = new UserRepository()
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret';
const JWT_EXPIRES_IN = '7d'

export class UserController {
    async create(req: Request, res: Response) {
        const { name, email, password } = req.body
        try {
            const hashedPassword = await bcrypt.hash(password,10)
            const existingUser = await userRepository.findByEmail(email)
            if (existingUser) {
                return res.status(200).json(existingUser)
            }
            const user = await userRepository.create({name, email, password: hashedPassword})
            return res.status(201).json(user)
        }catch(error) {
            return res.status(400).json({error: 'Erro ao criar usuario.'})

        }
    }

    async createWithGoogle(req: Request, res: Response) {
        const { token } = req.body

        try {
            const { OAuth2Client } = await import('google-auth-library')
            const client = new OAuth2Client()

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: [
                    process.env.GOOGLE_CLIENT_ID_IOS,
                    process.env.GOOGLE_CLIENT_ID_WEB,
                ],
            })
            const payload = ticket.getPayload()
            if (!payload) {
                return res.status(401).json({ error: 'Token inválido.' })
            }

            const { email, name, sub } = payload
            const existingUser = await userRepository.findByEmail(email)

            if (existingUser) {
                return res.status(200).json(existingUser)
            }

            const hashedPassword = await bcrypt.hash(sub, 10)
            const user = await userRepository.create({
                name,
                email,
                password: hashedPassword
            })

            return res.status(201).json(user)
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao autenticar com Google.' })
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body
        try {
            const user = await userRepository.findByEmail(email)
            if (!user) {
                return res.status(401).json({error:'Credentials invalids.'})
            }
            const isPasswordValid = await bcrypt.compare(password,user.password)
            if (!isPasswordValid) {
                return res.status(401).json({error:'Credentials invalids.'})
            }
            const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );
            return res.status(200).json({user, token: accessToken})
        }catch(error) {
            return res.status(400).json({error: 'Error ao realizar o login.' })
        }
    }

    async loginWithGoogle(req: Request, res: Response) {
        const { token } = req.body

        try {
            const { OAuth2Client } = await import('google-auth-library')
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            })

            const payload = ticket.getPayload()
            if (!payload) {
                return res.status(401).json({error:'Token invalido'})
            }

            const { email } = payload
            const user = await userRepository.findByEmail(email)

            if (!user) {
                return res.status(404).json({error:'Usuario nao encontrado'})
            }

            const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            return res.status(200).json({ user, token: accessToken })
        } catch (error) {
            return res.status(400).json({error: 'Erro ao autenticar o login.' })
        }
    }

    async getAll(req: Request, res: Response) {
        try{
            const users = await userRepository.findAll()
            return res.status(200).json(users)
        } catch (error) {
            return res.status(500).json({error: 'Erro ao buscar usuarios' })
        }
    }

    async getUserById(req: Request, res: Response) {
        const {id} = req.params
        try {
            const user = await userRepository.findById(id)
            if (!user) {
                return res.status(404).json({error: 'Usuario nao encontrado'})
            }
            return res.status(200).json(user)
        }catch (error) {
            return res.status(500).json({error: 'Erro ao buscar usuario' })
        }
    }

    async changePassword(req: Request, res: Response) {
        const {id} = req.params
        const { currentPassword, newPassword } = req.body

        try {
            const user = await userRepository.findById(id)
            if (!user) {
                return res.status(404).json({error: 'Usuario nao encontrado'})
            }
            const passwordMatch = await bcrypt.compare(currentPassword, user.password)
            if (!passwordMatch) {
                return res.status(400).json({ error: 'Senha atual incorreta' })
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10)
            await userRepository.updatePassword(Number(id), hashedNewPassword)

            return res.status(200).json({ message: 'Senha atualizada com sucesso' })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Erro ao trocar a senha' })
        }
    }

        async changeUserName(req: Request, res: Response) {
            const { id } = req.params
            const { name } = req.body

            if (!name) {
                return res.status(400).json({ error: 'Nome é obrigatório' })
            }

            try {
                const user = await userRepository.findById(id)
                if (!user) {
                    return res.status(404).json({ error: 'Usuário não encontrado' })
                }
                user.name = name
                const updatedUser = await userRepository.update(id,user)

                return res.status(200).json(updatedUser)
            } catch (error) {
                console.error(error)
                return res.status(500).json({ error: 'Erro ao alterar nome do usuário' })
            }
        }



}
