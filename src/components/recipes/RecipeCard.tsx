import Link from 'next/link';
import type { RecipeSummaryResponse } from '@/lib/types/api';
import { CookingPot } from 'lucide-react';

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Adicionada hoje';
  if (days === 1) return 'Adicionada há 1 dia';
  if (days < 7) return `Adicionada há ${days} dias`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return 'Adicionada há 1 semana';
  return `Adicionada há ${weeks} semanas`;
}

export function RecipeCard({ recipe }: { recipe: RecipeSummaryResponse }) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="flex flex-col gap-3 rounded-[10px] bg-zinc-700 p-4 hover:bg-zinc-600 transition-colors"
    >
      <div className="h-[140px] w-full rounded-lg bg-zinc-800 overflow-hidden">
        {recipe.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-zinc-400 text-sm">
            <CookingPot className="h-10 w-10 mr-2" />
          </div>
        )}
      </div>
      <div>
        <h3 className="text-white font-semibold text-base">{recipe.title}</h3>
        <p className="text-zinc-400 text-sm mt-1">{timeAgo(recipe.createdAt)}</p>
      </div>
    </Link>
  );
}