import { z } from 'zod';

export const userFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(120),
  profileImage: z.string().nullable(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
