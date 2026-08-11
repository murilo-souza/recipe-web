import type { RecipeSummaryResponse } from '@/lib/types/api';
import { RecipeCard } from './RecipeCard';

export function RecipeGrid({ recipes }: { recipes: RecipeSummaryResponse[] }) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
        <p className="text-lg">Você ainda não tem receitas salvas.</p>
        <p className="text-sm mt-1">Clique em &quot;+ Nova Receita&quot; para começar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}