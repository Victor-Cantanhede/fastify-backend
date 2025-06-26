import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/database/db';
import { createTaskSchema, updateTaskSchema } from '../schemas/taskSchema';
import { zod, handleZodError } from '../lib/validations/zod';


interface ITaskInputs {
    title: string;
    description: string;
    term: Date;
}

interface ParamsType {
    id: number;
}

const paramsSchema = zod.object({
    id: zod.number().int().positive()
});

/*=======================CREATE TASK=======================*/
export async function createTask(req: FastifyRequest, res: FastifyReply) {
    if (!req.user) {
        return res.code(401).send({ message: 'Usuário não autenticado!' });
    }

    const user = req.user.id as number;
    const parsed = createTaskSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.code(400).send(handleZodError(parsed.error));
    }

    const { title, description, term } = parsed.data as ITaskInputs;

    try {
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                term,
                status: true,
                userId: user
            }
        });
        res.code(201).send({ message: 'Tarefa cadastrada com sucesso!', newTask });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao cadastrar tarefa!', error: error as Error });
    }
}

/*=======================GET TASK=======================*/
export async function getAllTasks(req: FastifyRequest, res: FastifyReply) {
    if (!req.user) {
        return res.code(401).send({ message: 'Usuário não autenticado!' });
    }

    const user = req.user.id as number;
    
    const tasks = await prisma.task.findMany({
        where: { userId: user }
    });
    res.send(tasks);
}

/*=======================UPDATE TASK=======================*/
export async function updateTask(req: FastifyRequest<{ Params: ParamsType }>, res: FastifyReply) {
    if (!req.user) {
        return res.code(401).send({ message: 'Usuário não autenticado!' });
    }

    const parsedParams = paramsSchema.safeParse(req.params);
    
    if (!parsedParams.success) {
        return res.code(400).send({ message: 'ID inválido!', errors: parsedParams.error.flatten().fieldErrors });
    }
    
    const parsed = updateTaskSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.code(400).send(handleZodError(parsed.error));
    }

    const userId = req.user.id;
    const id = req.params.id;
    const { title, description, term } = parsed.data as ITaskInputs;

    try {
        const updatedTask = await prisma.task.update({
            where: { id, userId: userId },
            data: { title, description, term }
        });
        res.send({ message: 'Tarefa atualizada com sucesso!', updatedTask });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao atualizar tarefa!', error: error as Error });
    }
}

/*=======================DELETE TASK=======================*/
export async function deleteTask(req: FastifyRequest<{ Params: ParamsType }>, res: FastifyReply) {
    if (!req.user) {
        return res.code(401).send({ message: 'Usuário não autenticado!' });
    }

    const parsedParams = paramsSchema.safeParse(req.params);
    
    if (!parsedParams.success) {
        return res.code(400).send(handleZodError(parsedParams.error));
    }

    const userId = req.user.id;
    const id = req.params.id;

    try {
        const deletedTask = await prisma.task.delete({ where: { id, userId: userId } });
        res.code(204).send({ message: 'Tarefa deletada com sucesso!', deletedTask });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao atualizar tarefa!', error: error as Error });
    }
}