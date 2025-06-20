import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

interface ParamsType {
    id: number;
}

const prisma = new PrismaClient();

/*=======================CREATE TASK=======================*/
export async function createTask(req: FastifyRequest, res: FastifyReply) {
    const { title, description, term, status, userId } = req.body as {
        title: string;
        description: string;
        term: Date;
        status: boolean;
        userId: number;
    };

    try {
        const task = await prisma.task.create({
            data: { title, description, term: new Date(term), status, userId }
        });
        res.code(201).send({ message: 'Tarefa cadastrada com sucesso!' });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao cadastrar tarefa!', error: error as Error });
    }
}

/*=======================GET TASK=======================*/
export async function getAllTasks(req: FastifyRequest, res: FastifyReply) {
    const tasks = await prisma.task.findMany();
    res.send(tasks);
}

/*=======================UPDATE TASK=======================*/
export async function updateTask(req: FastifyRequest<{ Params: ParamsType }>, res: FastifyReply) {
    const id = req.params.id;
    const data = req.body as any;

    try {
        const updated = await prisma.task.update({
            where: { id }, data
        });
        res.send({ message: 'Tarefa atualizada com sucesso!' });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao atualizar tarefa!', error: error as Error });
    }
}

/*=======================DELETE TASK=======================*/
export async function deleteTask(req: FastifyRequest<{ Params: ParamsType }>, res: FastifyReply) {
    const id = req.params.id;

    try {
        await prisma.task.delete({ where: { id } });
        res.code(204).send({ message: 'Tarefa deletada com sucesso!' });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao atualizar tarefa!', error: error as Error });
    }
}