import { z } from 'zod';

export const forgotPasswordFormSchema = z.object({
  email: z.email('E-mail inválido'),
});

export type ForgotPasswordFormInput = z.input<typeof forgotPasswordFormSchema>;
