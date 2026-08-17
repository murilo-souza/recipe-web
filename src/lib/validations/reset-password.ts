import { z } from 'zod';

export const resetPasswordFormSchema = z
  .object({
    password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormInput = z.input<typeof resetPasswordFormSchema>;
