import Link from 'next/link';
import type { RecipeSummaryResponse } from '@/lib/types/api';
import { CookingPot, Clock, ArrowUpRight } from 'lucide-react';

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

export function RecipeCard({
  recipe,
  index = 0,
}: {
  recipe: RecipeSummaryResponse;
  index?: number;
}) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group animate-fade-in-up relative flex flex-col overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800/60 transition-all duration-500 ease-out hover:border-indigo-500/40 hover:shadow-[0_8px_40px_-12px_rgba(99,102,241,0.25)]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image container */}
      <div className="relative h-45 w-full overflow-hidden bg-zinc-900/50">
        {recipe.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-zinc-800 to-zinc-900">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-700/50 transition-colors duration-500 group-hover:bg-indigo-500/20">
                <CookingPot className="h-7 w-7 text-zinc-500 transition-colors duration-500 group-hover:text-indigo-400" />
              </div>
            </div>
          </div>
        )}

        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-linear-to-br from-zinc-900/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Arrow icon that appears on hover */}
        <div className="absolute top-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-base leading-snug font-semibold text-white transition-colors duration-300 group-hover:text-indigo-300">
          {recipe.title}
        </h3>
        <div className="mt-auto flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-zinc-500" />
          <p className="text-sm text-zinc-500">{timeAgo(recipe.createdAt)}</p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute right-0 bottom-0 left-0 h-0.5 origin-left scale-x-0 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 transition-transform duration-500 group-hover:scale-x-100" />
    </Link>
  );
}
