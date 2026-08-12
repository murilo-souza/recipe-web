import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { getAllCategories } from '@/lib/api/categories';
import { RecipeForm } from '@/components/recipes/RecipeForm';

export default async function NewRecipePage() {
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen bg-zinc-900 relative noise-overlay">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-500/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-violet-500/4 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-14 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 animate-fade-in-up">
          <Link
            href="/"
            aria-label="Voltar para a home"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/50 
                       text-zinc-400 hover:text-white hover:border-indigo-500/40 hover:bg-zinc-800 
                       transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse-soft" />
              <span className="text-xs text-indigo-400 font-medium uppercase tracking-wider">Nova receita</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Criar receita</h1>
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