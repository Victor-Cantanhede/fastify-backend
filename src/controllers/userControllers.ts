import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/database/db';
import { createUserSchema, loginSchema } from '../schemas/userSchema';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';


/*=======================CREATE USER=======================*/
export async function createUser(req: FastifyRequest, res: FastifyReply) {    
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.code(400).send({ message: 'Dados inválidos!', errors: parsed.error.flatten().fieldErrors });
    }

    const { name, email, password } = parsed.data;

    try {
        const hashedPassword = await bcryptjs.hash(password, 10);

        await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });
        res.code(201).send({ message: 'Usuário cadastrado com sucesso!' });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao cadastrar o usuário!', error: error as Error});
    }
}

/*=======================AUTH LOGIN=======================*/
export async function authLogin(req: FastifyRequest, res: FastifyReply) {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.code(400).send({ message: 'Dados inválidos!', errors: parsed.error.flatten().fieldErrors });
    }

    const { email, password } = parsed.data;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.code(401).send({ message: 'E-mail inválido!' });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.code(401).send({ message: 'Senha inválida!' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name },
            process.env.JWT_SECRET as string || 'token-secret',
            { expiresIn: '1d' }
        );

        res.setCookie('token', token, {
            httpOnly: true,
            secure: false, // Use false para testar em ambiente de desenvolvimento
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 dia
        }).send({ message: 'Login efetuado com sucesso!' });

    } catch (error) {
        res.code(500).send({ message: 'Erro ao realizar login!', error: error as Error });
    }
}