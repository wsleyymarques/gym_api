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
        console.log('[UserController:create] Dados recebidos:', { name, email });

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const existingUser = await userRepository.findByEmail(email);

            if (existingUser) {
                console.log('[UserController:create] Usuário já existe:', email);
                return res.status(200).json(existingUser);
            }

            const user = await userRepository.create({ name, email, password: hashedPassword });
            console.log('[UserController:create] Usuário criado com sucesso:', user.id);
            return res.status(201).json(user);
        } catch (error) {
            console.error('[UserController:create] Erro ao criar usuário:', error);
            return res.status(400).json({ error: 'Erro ao criar usuario.' });
        }
    }

    async createWithGoogle(req: Request, res: Response) {
        const { token } = req.body;
        console.log('[UserController:createWithGoogle] Token recebido:', token);

        try {
            const { OAuth2Client } = await import('google-auth-library');
            const client = new OAuth2Client();

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: [
                    process.env.GOOGLE_CLIENT_ID_IOS,
                    process.env.GOOGLE_CLIENT_ID_WEB,
                ],
            });

            const payload = ticket.getPayload();
            if (!payload) {
                console.warn('[UserController:createWithGoogle] Payload inválido.');
                return res.status(401).json({ error: 'Token inválido.' });
            }

            const { email, name, sub } = payload;
            console.log('[UserController:createWithGoogle] Payload:', { email, name });

            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                console.log('[UserController:createWithGoogle] Usuário já existe:', email);
                return res.status(200).json(existingUser);
            }

            const hashedPassword = await bcrypt.hash(sub, 10);
            const user = await userRepository.create({ name, email, password: hashedPassword });

            console.log('[UserController:createWithGoogle] Usuário criado via Google:', user.id);
            return res.status(201).json(user);
        } catch (error) {
            console.error('[UserController:createWithGoogle] Erro:', error);
            return res.status(400).json({ error: 'Erro ao autenticar com Google.' });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        console.log('[UserController:login] Tentando login para:', email);

        try {
            const user = await userRepository.findByEmail(email);
            if (!user) {
                console.warn('[UserController:login] Usuário não encontrado:', email);
                return res.status(401).json({ error: 'Credentials invalids.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.warn('[UserController:login] Senha inválida para:', email);
                return res.status(401).json({ error: 'Credentials invalids.' });
            }

            const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            console.log('[UserController:login] Login bem-sucedido:', user.id);
            return res.status(200).json({ user, token: accessToken });
        } catch (error) {
            console.error('[UserController:login] Erro ao logar:', error);
            return res.status(400).json({ error: 'Error ao realizar o login.' });
        }
    }

    async loginWithGoogle(req: Request, res: Response) {
        const { token } = req.body;
        console.log('[UserController:loginWithGoogle] Token recebido:', token);

        try {
            const { OAuth2Client } = await import('google-auth-library');
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) {
                console.warn('[UserController:loginWithGoogle] Payload inválido.');
                return res.status(401).json({ error: 'Token invalido' });
            }

            const { email } = payload;
            console.log('[UserController:loginWithGoogle] Email extraído do token:', email);

            const user = await userRepository.findByEmail(email);
            if (!user) {
                console.warn('[UserController:loginWithGoogle] Usuário não encontrado:', email);
                return res.status(404).json({ error: 'Usuario nao encontrado' });
            }

            const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            console.log('[UserController:loginWithGoogle] Login via Google bem-sucedido:', user.id);
            return res.status(200).json({ user, token: accessToken });
        } catch (error) {
            console.error('[UserController:loginWithGoogle] Erro ao autenticar:', error);
            return res.status(400).json({ error: 'Erro ao autenticar o login.' });
        }
    }

    async getAll(req: Request, res: Response) {
        console.log('[UserController:getAll] Buscando todos os usuários');
        try {
            const users = await userRepository.findAll();
            return res.status(200).json(users);
        } catch (error) {
            console.error('[UserController:getAll] Erro:', error);
            return res.status(500).json({ error: 'Erro ao buscar usuarios' });
        }
    }

    async getUserById(req: Request, res: Response) {
        const { id } = req.params;
        console.log('[UserController:getUserById] ID recebido:', id);

        try {
            const user = await userRepository.findById(id);
            if (!user) {
                console.warn('[UserController:getUserById] Usuário não encontrado:', id);
                return res.status(404).json({ error: 'Usuario nao encontrado' });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error('[UserController:getUserById] Erro:', error);
            return res.status(500).json({ error: 'Erro ao buscar usuario' });
        }
    }

    async changePassword(req: Request, res: Response) {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;
        console.log('[UserController:changePassword] ID:', id);

        try {
            const user = await userRepository.findById(id);
            if (!user) {
                console.warn('[UserController:changePassword] Usuário não encontrado:', id);
                return res.status(404).json({ error: 'Usuario nao encontrado' });
            }

            const passwordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!passwordMatch) {
                console.warn('[UserController:changePassword] Senha atual incorreta para:', id);
                return res.status(400).json({ error: 'Senha atual incorreta' });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await userRepository.updatePassword(id, hashedNewPassword);

            console.log('[UserController:changePassword] Senha atualizada para:', id);
            return res.status(200).json({ message: 'Senha atualizada com sucesso' });
        } catch (error) {
            console.error('[UserController:changePassword] Erro:', error);
            return res.status(500).json({ error: 'Erro ao trocar a senha' });
        }
    }

    async changeUserName(req: Request, res: Response) {
        const { id } = req.params;
        const { name } = req.body;
        console.log('[UserController:changeUserName] ID:', id, 'Novo nome:', name);

        if (!name) {
            console.warn('[UserController:changeUserName] Nome não fornecido');
            return res.status(400).json({ error: 'Nome é obrigatório' });
        }

        try {
            const user = await userRepository.findById(id);
            if (!user) {
                console.warn('[UserController:changeUserName] Usuário não encontrado:', id);
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            user.name = name;
            const updatedUser = await userRepository.update(id, user);

            console.log('[UserController:changeUserName] Nome atualizado para:', id);
            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error('[UserController:changeUserName] Erro:', error);
            return res.status(500).json({ error: 'Erro ao alterar nome do usuário' });
        }
    }
}