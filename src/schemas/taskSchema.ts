import { zod } from '../lib/validations/zod';

// BASETASK
const baseTaskSchema = zod.object({
    id: zod.number(),
    title: zod.string().min(3, 'O título deve ter no mínimo 3 caracteres!').max(30, 'O título deve ter no máximo 30 caracteres!'),
    description: zod.string().min(3, 'A descrição deve ter no mínimo 3 caracteres!').max(1500, 'A descrição deve ter no máximo 1500 caracteres!'),
    term: zod.string()
        .refine((val) => !isNaN(Date.parse(val)), { message: 'Data inválida!' })
        .transform((val) => new Date(val))
});

// CREATE
export const createTaskSchema = baseTaskSchema.partial();

// UPDATE
export const updateTaskSchema = baseTaskSchema.partial();