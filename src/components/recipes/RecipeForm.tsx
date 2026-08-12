'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import {
  ImagePlus,
  Upload,
  ChefHat,
  ListOrdered,
  Loader2,
  ArrowRight,
  AlertCircle,
  Camera,
} from 'lucide-react';
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
  recipeId?: number; // presente = modo edição
  defaultValues?: RecipeFormInput;
}

export function RecipeForm({ categories, recipeId, defaultValues }: RecipeFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = Boolean(recipeId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormInput, unknown, RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: defaultValues ?? {
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

    const url = isEditing ? `/api/recipes/${recipeId}` : '/api/recipes';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSubmitError(data.error ?? 'Erro ao salvar receita.');
      return;
    }

    router.push(isEditing ? `/recipes/${recipeId}` : '/');
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulário de receita"
      className="space-y-10"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        {/* ─── Left column — Basic info ─── */}
        <fieldset className="min-w-0 space-y-6">
          <legend className="mb-1 flex w-full items-center gap-3 pb-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15">
              <ChefHat className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <span className="block text-base leading-tight font-semibold text-white">
                Informações básicas
              </span>
              <span className="text-xs text-zinc-500">Dados gerais da receita</span>
            </div>
          </legend>

          {/* Separator */}
          <div className="h-px bg-linear-to-t from-zinc-700/60 via-zinc-700/30 to-transparent" />

          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="flex items-center gap-1 text-sm font-medium text-zinc-300"
            >
              Título{' '}
              <span aria-hidden="true" className="text-indigo-400">
                *
              </span>
            </label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Ex: Bolo de chocolate da vovó"
              className="h-12 rounded-xl border border-zinc-700/50 bg-zinc-800/60 text-white transition-all duration-300 placeholder:text-zinc-500 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p
                id="title-error"
                role="alert"
                className="flex items-center gap-1 text-xs text-red-400"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="flex items-center gap-1 text-sm font-medium text-zinc-300"
            >
              Descrição{' '}
              <span aria-hidden="true" className="text-indigo-400">
                *
              </span>
            </label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Conte um pouco sobre esta receita..."
              rows={4}
              className="w-full resize-none rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-4 py-3 text-sm text-white transition-all duration-300 outline-none placeholder:text-zinc-500 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
              aria-required="true"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p
                id="description-error"
                role="alert"
                className="flex items-center gap-1 text-xs text-red-400"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label
              htmlFor="categoryId"
              className="flex items-center gap-1 text-sm font-medium text-zinc-300"
            >
              Categoria{' '}
              <span aria-hidden="true" className="text-indigo-400">
                *
              </span>
            </label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => {
                // Build items map so Select.Value renders the label (name) instead of the raw value (id)
                const itemsMap: Record<string, string> = {};
                for (const c of categories) {
                  itemsMap[String(c.id)] = c.name;
                }

                return (
                  <Select
                    value={field.value != null ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(val)}
                    items={itemsMap}
                  >
                    <SelectTrigger
                      id="categoryId"
                      className="h-12 w-full rounded-xl border border-zinc-700/50 bg-zinc-800/60 text-white transition-all duration-300 hover:border-zinc-600/50 hover:bg-zinc-800/80 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50 data-placeholder:text-zinc-500 [&_svg]:text-zinc-400"
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
                );
              }}
            />
            {errors.categoryId && (
              <p
                id="categoryId-error"
                role="alert"
                className="flex items-center gap-1 text-xs text-red-400"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <label
              className="flex items-center gap-2 text-sm font-medium text-zinc-300"
              id="image-label"
            >
              <Camera className="h-3.5 w-3.5 text-zinc-400" />
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
                      <div className="group relative overflow-hidden rounded-2xl border border-zinc-700/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={field.value}
                          alt="Prévia da receita"
                          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/70 via-black/20 to-transparent pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => open()}
                            className="h-auto cursor-pointer rounded-xl border-white/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                          >
                            <Upload className="mr-1.5 h-3.5 w-3.5" />
                            Trocar imagem
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => open()}
                        aria-labelledby="image-label"
                        className="group flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-700/50 bg-zinc-800/30 text-zinc-500 transition-all duration-300 hover:border-indigo-500/40 hover:bg-zinc-800/50 hover:text-zinc-300 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-700/40 transition-colors duration-300 group-hover:bg-indigo-500/15">
                          <ImagePlus
                            className="h-5 w-5 transition-colors duration-300 group-hover:text-indigo-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="text-center">
                          <span className="block text-sm font-medium">Clique para enviar</span>
                          <span className="mt-0.5 block text-xs text-zinc-600">
                            JPG, PNG ou WebP
                          </span>
                        </div>
                      </button>
                    )
                  }
                </CldUploadWidget>
              )}
            />
          </div>
        </fieldset>

        {/* ─── Right column — Ingredients & Steps ─── */}
        <fieldset className="min-w-0 space-y-6">
          <legend className="mb-1 flex w-full items-center gap-3 pb-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/15">
              <ListOrdered className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <span className="block text-base leading-tight font-semibold text-white">
                Ingredientes e preparo
              </span>
              <span className="text-xs text-zinc-500">Detalhes de como preparar</span>
            </div>
          </legend>

          {/* Separator */}
          <div className="h-px bg-linear-to-t from-zinc-700/60 via-zinc-700/30 to-transparent" />

          <div className="space-y-2">
            <Controller
              name="ingredients"
              control={control}
              render={({ field }) => (
                <DynamicListInput
                  label="Ingredientes"
                  placeholder="Ex: 2 xícaras de farinha de trigo"
                  items={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.ingredients && (
              <p role="alert" className="flex items-center gap-1 text-xs text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.ingredients.message}
              </p>
            )}
          </div>

          {/* Spacer between the two lists */}
          <div className="h-px bg-linear-to-t from-transparent via-zinc-700/30 to-transparent" />

          <div className="space-y-2">
            <Controller
              name="prepareSteps"
              control={control}
              render={({ field }) => (
                <DynamicListInput
                  label="Modo de Preparo"
                  placeholder="Ex: Pré-aqueça o forno a 180°C"
                  items={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.prepareSteps && (
              <p role="alert" className="flex items-center gap-1 text-xs text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.prepareSteps.message}
              </p>
            )}
          </div>
        </fieldset>
      </div>

      {/* Error banner */}
      {submitError && (
        <div className="animate-fade-in-up flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <p role="alert" className="text-sm text-red-400">
            {submitError}
          </p>
        </div>
      )}

      {/* Submit section */}
      <div className="flex items-center justify-between border-t border-zinc-800/60 pt-6">
        <p className="hidden text-xs text-zinc-600 sm:block">
          Campos com <span className="text-indigo-400">*</span> são obrigatórios
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="ml-auto flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-linear-to-t from-indigo-500 to-purple-600 px-8 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.01] hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/35 active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-indigo-500/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              {isEditing ? 'Salvar alterações' : 'Salvar receita'}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
