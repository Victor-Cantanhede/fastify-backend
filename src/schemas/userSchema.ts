import { zod } from '../lib/validations/zod';

export const createUserSchema = zod.object({
    name: zod.string().min(3, 'O nome deve ter no mínimo 3 caracteres!').max(60, 'O nome não pode ter mais de 60 caracteres!'),
    email: zod.string().email('E-mail inválido!'),
    password: zod.string().min(10, 'A senha deve ter no mínimo 10 caracteres').max(20, 'O nome deve ter no máximo 20 caracteres')
});

export const loginSchema = zod.object({
    email: zod.string().email('E-mail inválido!'),
    password: zod.string().min(10, 'A senha deve ter no mínimo 10 caracteres')
});