import { z } from 'zod';

export const zod = z;

export const handleZodError = (error: z.ZodError) => {
    return { message: 'Dados inválidos!', errors: error.flatten().fieldErrors };
};