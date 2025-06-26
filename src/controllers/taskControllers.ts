import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../database/db';

interface ParamsType {
    id: number;
}

interface TaskInput {
    title: string;
    description: string;
    term: Date;
}

/*=======================CREATE TASK=======================*/
export async function createTask(req: FastifyRequest, res: FastifyReply) {
    const user = req.user?.id as number;

    const { title, description, term } = req.body as TaskInput;

    if (!title || !description || !term) {
        return res.code(400).send({ message: 'Preencha todos os campos!' });
    }

    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                term: new Date(term),
                status: true,
                userId: user
            }
        });
        res.code(201).send({ message: 'Tarefa cadastrada com sucesso!' });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao cadastrar tarefa!', error: error as Error });
    }
}

/*=======================GET TASK=======================*/
export async function getAllTasks(req: FastifyRequest, res: FastifyReply) {
    const user = req.user?.id as number;

    const tasks = await prisma.task.findMany({
        where: { userId: user }
    });
    res.send(tasks);
}

/*=======================UPDATE TASK=======================*/
export async function updateTask(req: FastifyRequest<{ Params: ParamsType }>, res: FastifyReply) {
    const user = req.user?.id as number;

    const id = req.params.id;
    const data = req.body as TaskInput;

    try {
        const updated = await prisma.task.update({
            where: { id, userId: user }, data
        });
        res.send({ message: 'Tarefa atualizada com sucesso!' });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao atualizar tarefa!', error: error as Error });
    }
}

/*=======================DELETE TASK=======================*/
export async function deleteTask(req: FastifyRequest<{ Params: ParamsType }>, res: FastifyReply) {
    const user = req.user?.id as number;
    const id = req.params.id;

    try {
        await prisma.task.delete({ where: { id, userId: user } });
        res.code(200).send({ message: 'Tarefa deletada com sucesso!' });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao atualizar tarefa!', error: error as Error });
    }
}