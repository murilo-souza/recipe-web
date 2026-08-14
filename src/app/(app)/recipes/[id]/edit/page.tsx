import { notFound } from 'next/navigation';
import { getRecipeById } from '@/lib/api/recipes';
import { getAllCategories } from '@/lib/api/categories';
import { RecipeForm } from '@/components/recipes/RecipeForm';
import type { RecipeFormInput } from '@/lib/validations/recipe';
import { ReturnButton } from '@/app/(app)/components/ReturnButton';

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
    <div className="noise-overlay min-h-screen bg-zinc-900 px-8 py-10 sm:px-16">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/6 blur-3xl" />
        <div className="absolute right-1/3 bottom-1/4 h-72 w-72 rounded-full bg-purple-500/4 blur-3xl" />
      </div>
      <div className="animate-fade-in-up mb-2 flex items-center gap-4">
        <ReturnButton href={`/recipes/${recipeId}`} tooltip="Voltar para os detalhes" />
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
