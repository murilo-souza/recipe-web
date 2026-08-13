import { getAllRecipes } from '@/lib/api/recipes';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, ChefHat, Sparkles, User } from 'lucide-react';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { getCurrentUser } from '@/lib/api/user';

export default async function HomePage() {
  const [recipes, user] = await Promise.all([getAllRecipes(), getCurrentUser()]);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="noise-overlay relative min-h-screen bg-zinc-900">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-72 w-72 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-zinc-800/60">
          <div className="mx-auto max-w-7xl px-6 py-5 sm:px-10 lg:px-14">
            <div className="flex items-center justify-between">
              {/* Logo & branding */}
              <div className="animate-fade-in flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                  <ChefHat className="h-5 w-5 text-white" />
                </div>
                <span className="hidden text-lg font-semibold text-white sm:block">Receitas</span>
              </div>

              {/* User area */}
              <div className="animate-fade-in flex items-center gap-4 delay-200">
                <Link href="/recipes/new">
                  <Button className="h-auto cursor-pointer gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:bg-indigo-400 hover:shadow-indigo-500/30">
                    <Plus className="h-4 w-4" />
                    Nova Receita
                  </Button>
                </Link>
                <Link
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-zinc-700/50 bg-zinc-800 transition-colors duration-300 hover:border-indigo-500/40"
                  href="/profile"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-zinc-400" />
                  )}
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>
        </header>

        {/* Hero / greeting section */}
        <section className="mx-auto max-w-7xl px-6 pt-10 pb-8 sm:px-10 lg:px-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="animate-fade-in-up">
              <div className="mb-1 flex items-center gap-2">
                <Sparkles className="animate-pulse-soft h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium text-indigo-400">{greeting}</span>
              </div>
              <h1 className="text-3xl leading-tight font-bold text-white sm:text-4xl">
                {user?.name ? (
                  <>
                    Olá, <span className="gradient-text">{user.name}</span>
                  </>
                ) : (
                  'Suas Receitas'
                )}
              </h1>
              <p className="mt-2 text-base text-zinc-400">
                {recipes.length === 0
                  ? 'Comece a criar sua coleção de receitas.'
                  : `Você tem ${recipes.length} ${recipes.length === 1 ? 'receita salva' : 'receitas salvas'}.`}
              </p>
            </div>

            {/* Stats pill */}
            {recipes.length > 0 && (
              <div className="animate-fade-in-up flex items-center gap-6 delay-200">
                <div className="glass flex items-center gap-3 rounded-2xl px-5 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15">
                    <ChefHat className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-2xl leading-none font-bold text-white">{recipes.length}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {recipes.length === 1 ? 'Receita' : 'Receitas'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
        </div>

        {/* Recipe grid section */}
        <section className="mx-auto max-w-7xl px-6 py-8 pb-16 sm:px-10 lg:px-14">
          {recipes.length > 0 && (
            <div className="animate-fade-in-up mb-6 flex items-center justify-between delay-300">
              <h2 className="text-lg font-semibold text-zinc-300">Todas as receitas</h2>
            </div>
          )}
          <RecipeGrid recipes={recipes} />
        </section>
      </div>
    </div>
  );
}
