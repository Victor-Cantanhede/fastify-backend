import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUser(req: FastifyRequest, res: FastifyReply) {
    const { name, email, password } = req.body as {
        name: string;
        email: string;
        password: string;
    };

    try {
        const user = await prisma.user.create({
            data: { name, email, password }
        });
        res.code(201).send({ message: 'Usuário cadastrado com sucesso!' });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao cadastrar o usuário!', error: error as Error});
    }
}