import { getAllCategories } from '@/lib/api/categories';
import { RecipeForm } from '@/components/recipes/RecipeForm';

export default async function NewRecipePage() {
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen bg-zinc-900 px-8 sm:px-16 py-10">
      <h1 className="text-white text-2xl font-semibold mb-8">Criar receita</h1>
      <RecipeForm categories={categories} />
    </div>
  );
}