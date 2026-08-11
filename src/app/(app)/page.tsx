import { getAllRecipes } from '@/lib/api/recipes';
import { getSession } from '@/lib/session';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {User} from 'lucide-react'

export default async function HomePage() {
  const [session, recipes] = await Promise.all([getSession(), getAllRecipes()]);

  return (
    <div className="min-h-screen bg-zinc-900 px-8 sm:px-16 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-zinc-700 flex items-center justify-center" >
            <User className="h-8 w-8 text-zinc-400 m-auto" />

          </div>
          <h2 className="text-white text-2xl font-semibold">Olá, {session?.userName}</h2>
        </div>
        <Button className="bg-indigo-500 hover:bg-indigo-600 h-auto px-6 py-3.5 rounded-[10px]">
          <Link href="/recipes/new">+ Nova Receita</Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-3">
          <h1 className="text-white text-[28px] font-semibold">Suas Receitas</h1>
          <span className="text-zinc-400 text-base">Total {recipes.length}</span>
        </div>
      </div>

      <RecipeGrid recipes={recipes} />
    </div>
  );
}