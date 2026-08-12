import { notFound } from 'next/navigation';
import { getRecipeById } from '@/lib/api/recipes';
import { getAllCategories } from '@/lib/api/categories';
import { RecipeForm } from '@/components/recipes/RecipeForm';
import type { RecipeFormInput } from '@/lib/validations/recipe';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipeId = Number(id);

  const [recipe, categories] = await Promise.all([getRecipeById(recipeId), getAllCategories()]);

  if (!recipe) {
    notFound();
  }

  const defaultValues: RecipeFormInput = {
    title: recipe.title,
    description: recipe.description,
    categoryId: recipe.categoryId,
    image: recipe.image,
    ingredients: recipe.ingredients,
    prepareSteps: recipe.prepareSteps
      .sort((a, b) => a.position - b.position)
      .map((step) => step.description),
  };

  return (
    <div className="min-h-screen bg-zinc-900 px-8 py-10 sm:px-16">
      <div className="animate-fade-in-up mb-2 flex items-center gap-4">
        <Link
          href={`/recipes/${recipeId}`}
          aria-label="Voltar para a receita"
          className="group flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800/60 text-zinc-400 transition-all duration-300 hover:border-indigo-500/40 hover:bg-zinc-800 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        </Link>
        <div>
          <span className="text-xs font-medium tracking-wider text-indigo-400 uppercase">
            Editar receita
          </span>
        </div>
      </div>
      <RecipeForm categories={categories} recipeId={recipe.id} defaultValues={defaultValues} />
    </div>
  );
}
