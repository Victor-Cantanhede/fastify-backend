import { FastifyInstance } from 'fastify';
import {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask
} from '../controllers/taskControllers';
import { verifyToken } from '../middlewares/auth';

export async function taskRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyToken); // Middleware

    app.post('/', createTask);
    app.get('/', getAllTasks);
    app.put('/:id', updateTask);
    app.delete('/:id', deleteTask);
}