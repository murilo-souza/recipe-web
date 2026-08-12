import { getAllRecipes } from '@/lib/api/recipes';
import { getSession } from '@/lib/session';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Plus, ChefHat, Sparkles } from 'lucide-react';

export default async function HomePage() {
  const [session, recipes] = await Promise.all([getSession(), getAllRecipes()]);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="min-h-screen bg-zinc-900 relative noise-overlay">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-zinc-800/60">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-5">
            <div className="flex items-center justify-between">
              {/* Logo & branding */}
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-white hidden sm:block">
                  Receitas de Família
                </span>
              </div>

              {/* User area */}
              <div className="flex items-center gap-4 animate-fade-in delay-200">
                <Link href="/recipes/new">
                  <Button className="bg-indigo-500 hover:bg-indigo-400 h-auto px-5 py-2.5 rounded-xl text-sm font-medium 
                                     shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Receita
                  </Button>
                </Link>
                <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center 
                                hover:border-indigo-500/40 transition-colors duration-300 cursor-pointer">
                  <User className="h-5 w-5 text-zinc-400" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero / greeting section */}
        <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-10 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse-soft" />
                <span className="text-sm text-indigo-400 font-medium">{greeting}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                {session?.userName ? (
                  <>
                    Olá, <span className="gradient-text">{session.userName}</span>
                  </>
                ) : (
                  'Suas Receitas'
                )}
              </h1>
              <p className="text-zinc-400 mt-2 text-base">
                {recipes.length === 0
                  ? 'Comece a criar sua coleção de receitas.'
                  : `Você tem ${recipes.length} ${recipes.length === 1 ? 'receita salva' : 'receitas salvas'}.`}
              </p>
            </div>

            {/* Stats pill */}
            {recipes.length > 0 && (
              <div className="flex items-center gap-6 animate-fade-in-up delay-200">
                <div className="flex items-center gap-3 glass rounded-2xl px-5 py-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                    <ChefHat className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white leading-none">{recipes.length}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {recipes.length === 1 ? 'Receita' : 'Receitas'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
        </div>

        {/* Recipe grid section */}
        <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-8 pb-16">
          {recipes.length > 0 && (
            <div className="flex items-center justify-between mb-6 animate-fade-in-up delay-300">
              <h2 className="text-lg font-semibold text-zinc-300">Todas as receitas</h2>
            </div>
          )}
          <RecipeGrid recipes={recipes} />
        </section>
      </div>
    </div>
  );
}