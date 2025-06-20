import { FastifyInstance } from 'fastify';
import {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask
} from '../controllers/taskControllers';

export async function taskRoutes(app: FastifyInstance) {
    app.post('/', createTask);
    app.get('/', getAllTasks);
    app.put('/:id', updateTask);
    app.delete('/:id', deleteTask);
}