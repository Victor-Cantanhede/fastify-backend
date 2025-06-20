import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
}

const prisma = new PrismaClient();

/*=======================CREATE USER=======================*/
export async function createUser(req: FastifyRequest, res: FastifyReply) {
    const { name, email, password } = req.body as IUser;

    try {
        const hashedPassword = await bcryptjs.hash(password, 10);

        await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });
        res.code(201).send({ message: 'Usuário cadastrado com sucesso!' });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao cadastrar o usuário!', error: error as Error});
    }
}

/*=======================AUTH LOGIN=======================*/
export async function authLogin(req: FastifyRequest, res: FastifyReply) {
    const { email, password } = req.body as IUser;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.code(401).send({ message: 'E-mail inválido!' });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.code(401).send({ message: 'Senha inválida!' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name },
            process.env.JWT_SECRET as string || 'token-secret',
            { expiresIn: '1d' }
        );

        res.setCookie('token', token, {
            httpOnly: true,
            secure: false, // Use false para testar em ambiente de desenvolvimento
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 dia
        }).send({ message: 'Login efetuado com sucesso!' });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao realizar login!', error: error as Error });
    }
}