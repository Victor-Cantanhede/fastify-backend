import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import { userRoutes } from './routes/userRoutes';
import { taskRoutes } from './routes/taskRoutes';

const app = Fastify({ logger: true });
const PORT = process.env.PORT || 5000;

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