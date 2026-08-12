import type { RecipeSummaryResponse } from '@/lib/types/api';
import { RecipeCard } from './RecipeCard';
import { CookingPot, Plus } from 'lucide-react';
import Link from 'next/link';

export function RecipeGrid({ recipes }: { recipes: RecipeSummaryResponse[] }) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
        {/* Decorative background */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl scale-150" />
          <div className="relative w-24 h-24 rounded-3xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center animate-float">
            <CookingPot className="h-10 w-10 text-zinc-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-zinc-300 mb-2">Nenhuma receita ainda</h3>
        <p className="text-zinc-500 text-sm mb-6 text-center max-w-xs">
          Comece a salvar as receitas da sua família e nunca mais as perca.
        </p>
        <Link
          href="/recipes/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium 
                     transition-all duration-300 hover:shadow-[0_4px_20px_-4px_rgba(99,102,241,0.5)]"
        >
          <Plus className="w-4 h-4" />
          Criar primeira receita
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {recipes.map((recipe, i) => (
        <RecipeCard key={recipe.id} recipe={recipe} index={i} />
      ))}
    </div>
  );
}