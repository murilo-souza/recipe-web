'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Upload, ChefHat, ListOrdered, Loader2, ArrowRight, AlertCircle, Camera } from 'lucide-react';
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* ─── Left column — Basic info ─── */}
        <fieldset className="space-y-6 min-w-0">
          <legend className="w-full pb-3 mb-1 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
              <ChefHat className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <span className="text-base font-semibold text-white block leading-tight">Informações básicas</span>
              <span className="text-xs text-zinc-500">Dados gerais da receita</span>
            </div>
          </legend>

          {/* Separator */}
          <div className="h-px bg-linear-to-t from-zinc-700/60 via-zinc-700/30 to-transparent" />

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-zinc-300 flex items-center gap-1">
              Título <span aria-hidden="true" className="text-indigo-400">*</span>
            </label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Ex: Bolo de chocolate da vovó"
              className="bg-zinc-800/60 border border-zinc-700/50 text-white placeholder:text-zinc-500 h-12 rounded-xl
                         focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all duration-300"
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p id="title-error" role="alert" className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-zinc-300 flex items-center gap-1">
              Descrição <span aria-hidden="true" className="text-indigo-400">*</span>
            </label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Conte um pouco sobre esta receita..."
              rows={4}
              className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 
                         resize-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 
                         transition-all duration-300"
              aria-required="true"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" role="alert" className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="categoryId" className="text-sm font-medium text-zinc-300 flex items-center gap-1">
              Categoria <span aria-hidden="true" className="text-indigo-400">*</span>
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
                      className="w-full h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-white 
                                 hover:border-zinc-600/50 hover:bg-zinc-800/80
                                 data-placeholder:text-zinc-500 [&_svg]:text-zinc-400
                                 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 
                                 transition-all duration-300"
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
              <p id="categoryId-error" role="alert" className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2" id="image-label">
              <Camera className="w-3.5 h-3.5 text-zinc-400" />
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
                      <div className="relative rounded-2xl overflow-hidden group border border-zinc-700/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={field.value}
                          alt="Prévia da receita"
                          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent 
                                        flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => open()}
                            className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white 
                                       rounded-xl px-4 py-2 h-auto text-sm cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5 mr-1.5" />
                            Trocar imagem
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => open()}
                        aria-labelledby="image-label"
                        className="w-full h-40 rounded-2xl border-2 border-dashed border-zinc-700/50 bg-zinc-800/30 
                                   flex flex-col items-center justify-center gap-3 
                                   text-zinc-500 hover:border-indigo-500/40 hover:text-zinc-300 hover:bg-zinc-800/50
                                   transition-all duration-300 cursor-pointer group
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-zinc-700/40 flex items-center justify-center
                                        group-hover:bg-indigo-500/15 transition-colors duration-300">
                          <ImagePlus className="w-5 h-5 group-hover:text-indigo-400 transition-colors duration-300" aria-hidden="true" />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-medium block">Clique para enviar</span>
                          <span className="text-xs text-zinc-600 mt-0.5 block">JPG, PNG ou WebP</span>
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
        <fieldset className="space-y-6 min-w-0">
          <legend className="w-full pb-3 mb-1 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
              <ListOrdered className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <span className="text-base font-semibold text-white block leading-tight">Ingredientes e preparo</span>
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
              <p role="alert" className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
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
              <p role="alert" className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.prepareSteps.message}
              </p>
            )}
          </div>
        </fieldset>
      </div>

      {/* Error banner */}
      {submitError && (
        <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 animate-fade-in-up">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p role="alert" className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      {/* Submit section */}
      <div className="flex items-center justify-between pt-6 border-t border-zinc-800/60">
        <p className="text-xs text-zinc-600 hidden sm:block">
          Campos com <span className="text-indigo-400">*</span> são obrigatórios
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="ml-auto h-12 px-8 rounded-xl bg-linear-to-t from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 
                     text-white text-sm font-semibold transition-all duration-300 cursor-pointer
                     shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-[0.99]
                     disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-indigo-500/20
                     flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              {isEditing ? 'Salvar alterações' : 'Salvar receita'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}