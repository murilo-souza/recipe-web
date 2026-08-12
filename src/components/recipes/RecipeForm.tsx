'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DynamicListInput } from './DynamicListInput';
import { RecipeFormInput, recipeFormSchema, type RecipeFormValues } from '@/lib/validations/recipe';
import type { CategoryResponse } from '@/lib/types/api';

interface RecipeFormProps {
  categories: CategoryResponse[];
}

export function RecipeForm({ categories }: RecipeFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormInput, unknown, RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: undefined,
      image: '',
      ingredients: [],
      prepareSteps: [],
    },
  });

  async function onSubmit(values: RecipeFormValues) {
    setSubmitError(null);

    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSubmitError(data.error ?? 'Erro ao salvar receita.');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulário de receita"
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Coluna esquerda — Informações básicas */}
        <fieldset className="space-y-6 min-w-0">
          <legend className="w-full pb-2 mb-2 text-base font-semibold text-slate-100 border-b border-zinc-700">
            Informações básicas
          </legend>

          <div className="space-y-3">
            <label htmlFor="title" className="text-sm font-semibold text-slate-100">
              Título <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Digite o título da sua receita"
              className="rounded bg-zinc-700 border-indigo-400"
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p id="title-error" role="alert" className="text-red-500 text-xs">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label htmlFor="description" className="text-sm font-semibold text-slate-100">
              Descrição <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Dê uma descrição para sua receita"
              rows={3}
              className="w-full rounded border border-indigo-400 bg-zinc-700 px-2.5 py-2 text-sm text-white placeholder:text-zinc-400 resize-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 transition-shadow"
              aria-required="true"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" role="alert" className="text-red-500 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label htmlFor="categoryId" className="text-sm font-semibold text-slate-100">
              Categoria <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value != null ? String(field.value) : ''}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger
                    id="categoryId"
                    className="w-full rounded bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 data-placeholder:text-indigo-200 [&_svg]:text-indigo-200"
                    aria-required="true"
                    aria-invalid={!!errors.categoryId}
                    aria-describedby={errors.categoryId ? 'categoryId-error' : undefined}
                  >
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p id="categoryId-error" role="alert" className="text-red-500 text-xs">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-100" id="image-label">
              Imagem
            </label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={(result) => {
                    if (typeof result.info === 'object' && result.info?.secure_url) {
                      field.onChange(result.info.secure_url);
                    }
                  }}
                >
                  {({ open }) =>
                    field.value ? (
                      <div className="relative rounded-md overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={field.value}
                          alt="Prévia da receita"
                          className="h-40 w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => open()}
                            className="border-white text-white hover:bg-white/20 hover:text-white"
                          >
                            Trocar imagem
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => open()}
                        aria-labelledby="image-label"
                        className="w-full h-32 rounded-md border-2 border-dashed border-indigo-400/60 bg-zinc-700/50 flex flex-col items-center justify-center gap-2 text-zinc-400 hover:border-indigo-400 hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
                      >
                        <ImagePlus className="w-6 h-6" aria-hidden="true" />
                        <span className="text-sm">Clique para enviar uma imagem</span>
                      </button>
                    )
                  }
                </CldUploadWidget>
              )}
            />
          </div>
        </fieldset>

        {/* Coluna direita — Ingredientes e preparo */}
        <fieldset className="space-y-6 min-w-0">
          <legend className="w-full pb-2 mb-2 text-base font-semibold text-slate-100 border-b border-zinc-700">
            Ingredientes e preparo
          </legend>

          <div className="space-y-1.5">
            <Controller
              name="ingredients"
              control={control}
              render={({ field }) => (
                <DynamicListInput
                  label="Ingredientes"
                  placeholder="Digite um ingrediente e adicione"
                  items={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.ingredients && (
              <p role="alert" className="text-red-500 text-xs">{errors.ingredients.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Controller
              name="prepareSteps"
              control={control}
              render={({ field }) => (
                <DynamicListInput
                  label="Modo de Preparo"
                  placeholder="Digite um passo e adicione"
                  items={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.prepareSteps && (
              <p role="alert" className="text-red-500 text-xs">{errors.prepareSteps.message}</p>
            )}
          </div>
        </fieldset>
      </div>

      {submitError && (
        <p role="alert" className="text-red-500 text-sm">
          {submitError}
        </p>
      )}

      <div className="flex justify-end pt-4 border-t border-zinc-700">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-indigo-600 hover:bg-indigo-700 px-10 py-4 h-auto"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar receita'}
        </Button>
      </div>
    </form>
  );
}