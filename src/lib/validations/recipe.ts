// src/lib/validations/recipe.ts
import { z } from 'zod';

export const recipeFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(150),
  description: z.string().min(1, 'Descrição é obrigatória').max(500),
  categoryId: z.coerce.number({ message: 'Selecione uma categoria' }).positive('Selecione uma categoria'),
  image: z.string().nullable(),
  ingredients: z.array(z.string()).min(1, 'Adicione ao menos um ingrediente'),
  prepareSteps: z.array(z.string()).min(1, 'Adicione ao menos um passo do modo de preparo'),
});

// Tipo de ENTRADA (o que os inputs realmente produzem, antes da coerção)
export type RecipeFormInput = z.input<typeof recipeFormSchema>;

// Tipo de SAÍDA (o que você recebe depois de validado/coagido — o que vai pro backend)
export type RecipeFormValues = z.output<typeof recipeFormSchema>;