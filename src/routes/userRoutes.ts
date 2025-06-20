import { FastifyInstance } from 'fastify';
import { createUser } from '../controllers/userControllers';

export async function userRoutes(app: FastifyInstance) {
    app.post('/', createUser);
}