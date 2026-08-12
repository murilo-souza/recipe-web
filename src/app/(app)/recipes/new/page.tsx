import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { getAllCategories } from '@/lib/api/categories';
import { RecipeForm } from '@/components/recipes/RecipeForm';

export default async function NewRecipePage() {
  const categories = await getAllCategories();

  return (
    <div className="noise-overlay relative min-h-screen bg-zinc-900">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-purple-500/6 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-violet-500/4 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="animate-fade-in-up mb-10 flex items-center gap-4">
          <Link
            href="/"
            aria-label="Voltar para a home"
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800/60 text-zinc-400 transition-all duration-300 hover:border-indigo-500/40 hover:bg-zinc-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </Link>
          <div>
            <div className="mb-0.5 flex items-center gap-2">
              <Sparkles className="animate-pulse-soft h-3.5 w-3.5 text-indigo-400" />
              <span className="text-xs font-medium tracking-wider text-indigo-400 uppercase">
                Nova receita
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Criar receita</h1>
          </div>
        </div>

        {/* Form */}
        <div className="animate-fade-in-up delay-200">
          <RecipeForm categories={categories} />
        </div>
      </div>
    </div>
  );
}
