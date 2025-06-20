import '@fastify/cookie';

declare module 'fastify' {
    interface FastifyRequest {
        user?: {
            id: number;
            name: string;
            iat: number;
            exp: number;
        }
    }
}