import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

interface TokenPayload extends jwt.JwtPayload {
    id: number;
    name: string;
    iat: number;
    exp: number;
}

export async function verifyToken(req: FastifyRequest, res: FastifyReply) {
    const token = req.cookies.token;

    if (!token) {
        return res.code(401).send({ message: 'Usuário não autenticado. Realize o login!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string || 'token-secret') as TokenPayload;
        req.user = decoded;

    } catch (error) {
        return res.code(401).send({ message: 'Token inválido. Acesso negado.' });
    }
}