import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import { userRoutes } from './routes/userRoutes';
import { taskRoutes } from './routes/taskRoutes';

const app = Fastify({ logger: true });
const PORT = process.env.PORT || 5000;

app.register(fastifyCors, {
    origin: process.env.FRONT_URL as string || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
});

app.register(fastifyCookie);
app.register(userRoutes, { prefix: '/users' });
app.register(taskRoutes, { prefix: '/tasks' });

app.listen({ port: PORT as number }, (error, address) => {
    if (error) {
        console.error(error);
        process.exit(1);
    }
    console.log(`Server running on ${address}`);
});