import { FastifyInstance } from 'fastify';
import {
    createUser,
    authLogin
} from '../controllers/userControllers';

export async function userRoutes(app: FastifyInstance) {
    app.post('/', createUser);
    app.post('/login', authLogin);
}