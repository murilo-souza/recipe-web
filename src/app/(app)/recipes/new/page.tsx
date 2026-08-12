import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getAllCategories } from '@/lib/api/categories';
import { RecipeForm } from '@/components/recipes/RecipeForm';

export default async function NewRecipePage() {
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen bg-zinc-900 px-8 sm:px-16 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          aria-label="Voltar para a home"
          className="flex items-center justify-center w-8 h-8 rounded-sm text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-white text-2xl font-semibold">Criar receita</h1>
      </div>
      <RecipeForm categories={categories} />
    </div>
  );
}