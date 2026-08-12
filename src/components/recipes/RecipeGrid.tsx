import type { RecipeSummaryResponse } from '@/lib/types/api';
import { RecipeCard } from './RecipeCard';
import { CookingPot, Plus } from 'lucide-react';
import Link from 'next/link';

export function RecipeGrid({ recipes }: { recipes: RecipeSummaryResponse[] }) {
  if (recipes.length === 0) {
    return (
      <div className="animate-fade-in-up flex flex-col items-center justify-center py-24">
        {/* Decorative background */}
        <div className="relative mb-8">
          <div className="absolute inset-0 scale-150 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="animate-float relative flex h-24 w-24 items-center justify-center rounded-3xl border border-zinc-700/50 bg-zinc-800/80">
            <CookingPot className="h-10 w-10 text-zinc-500" />
          </div>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-zinc-300">Nenhuma receita ainda</h3>
        <p className="mb-6 max-w-xs text-center text-sm text-zinc-500">
          Comece a salvar as receitas da sua família e nunca mais as perca.
        </p>
        <Link
          href="/recipes/new"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-indigo-400 hover:shadow-[0_4px_20px_-4px_rgba(99,102,241,0.5)]"
        >
          <Plus className="h-4 w-4" />
          Criar primeira receita
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe, i) => (
        <RecipeCard key={recipe.id} recipe={recipe} index={i} />
      ))}
    </div>
  );
}
