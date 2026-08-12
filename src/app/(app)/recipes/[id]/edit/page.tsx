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

  const [recipe, categories] = await Promise.all([
    getRecipeById(recipeId),
    getAllCategories(),
  ]);

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
    <div className="min-h-screen bg-zinc-900 px-8 sm:px-16 py-10">
      <div className="flex items-center gap-4 animate-fade-in-up mb-2">
        <Link
          href={`/recipes/${recipeId}`}
          aria-label="Voltar para a receita"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/50 
                      text-zinc-400 hover:text-white hover:border-indigo-500/40 hover:bg-zinc-800 
                      transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
        </Link>
        <div>
          <span className="text-xs text-indigo-400 font-medium uppercase tracking-wider">Editar receita</span>
        </div>
      </div>
      <RecipeForm categories={categories} recipeId={recipe.id} defaultValues={defaultValues} />
    </div>
  );
}