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

export function RecipeCard({ recipe, index = 0 }: { recipe: RecipeSummaryResponse; index?: number }) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group relative flex flex-col rounded-2xl bg-zinc-800/60 border border-zinc-700/50 overflow-hidden 
                 hover:border-indigo-500/40 hover:shadow-[0_8px_40px_-12px_rgba(99,102,241,0.25)] 
                 transition-all duration-500 ease-out animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image container */}
      <div className="relative h-[180px] w-full overflow-hidden bg-zinc-900/50">
        {recipe.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-zinc-700/50 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors duration-500">
                <CookingPot className="h-7 w-7 text-zinc-500 group-hover:text-indigo-400 transition-colors duration-500" />
              </div>
            </div>
          </div>
        )}

        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Arrow icon that appears on hover */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center 
                        opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="text-white font-semibold text-base leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors duration-300">
          {recipe.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-auto">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <p className="text-zinc-500 text-sm">{timeAgo(recipe.createdAt)}</p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                      scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </Link>
  );
}