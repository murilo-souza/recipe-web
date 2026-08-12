import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRecipeById } from '@/lib/api/recipes';
import { Button } from '@/components/ui/button';
import { DeleteRecipeButton } from '@/components/recipes/DeleteRecipeButton';
import { getChatMessages } from '@/lib/api/chat';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { MobileChatDrawer } from '@/components/chat/MobileChatDrawer';
import { ArrowLeft, FileText, ListOrdered, Pencil, UtensilsCrossed } from 'lucide-react';
import { DetailCard } from '@/components/recipes/DetailCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(Number(id));
  const messages = await getChatMessages(Number(id));

  if (!recipe) {
    notFound();
  }

  return (
    <div className="bg-zinc-900 relative noise-overlay lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-500/4 rounded-full blur-3xl" />
      </div>

      {/* Left column: recipe details — scrollable */}
      <div className="flex-1 relative z-10 min-h-screen lg:min-h-0 lg:overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4 animate-fade-in-up">
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
              <span className="text-xs text-indigo-400 font-medium uppercase tracking-wider">Receita</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{recipe.title}</h1>
            </div>
          </div>

          {/* Image (if exists) */}
          {recipe.image && (
            <div className="rounded-2xl overflow-hidden border border-zinc-700/50 animate-fade-in-up delay-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
          )}

          {/* Description card */}
          <DetailCard
            icon={<FileText className="w-4 h-4 text-indigo-400" />}
            label="Descrição"
            delay="delay-200"
          >
            <p className="text-zinc-300 text-sm leading-relaxed">{recipe.description}</p>
          </DetailCard>

          {/* Ingredients card */}
          <DetailCard
            icon={<UtensilsCrossed className="w-4 h-4 text-emerald-400" />}
            label="Ingredientes"
            count={recipe.ingredients.length}
            delay="delay-300"
          >
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <span className="flex shrink-0 items-center justify-center w-6 h-6 rounded-lg mt-0.5
                                   bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-zinc-300 text-sm leading-relaxed">{ingredient}</span>
                </li>
              ))}
            </ul>
          </DetailCard>

          {/* Steps card */}
          <DetailCard
            icon={<ListOrdered className="w-4 h-4 text-purple-400" />}
            label="Modo de Preparo"
            count={recipe.prepareSteps.length}
            delay="delay-400"
          >
            <ol className="space-y-3">
              {recipe.prepareSteps
                .sort((a, b) => a.position - b.position)
                .map((step) => (
                  <li key={step.id} className="flex items-start gap-3 group">
                    <span className="flex shrink-0 items-center justify-center w-7 h-7 rounded-lg mt-0.5
                                     bg-gradient-to-br from-purple-500/15 to-indigo-500/15 border border-purple-500/20 
                                     text-purple-400 text-xs font-bold">
                      {step.position}
                    </span>
                    <span className="text-zinc-300 text-sm leading-relaxed pt-1">{step.description}</span>
                  </li>
                ))}
            </ol>
          </DetailCard>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2 pb-4 animate-fade-in-up delay-500">
            <Link href={`/recipes/${recipe.id}/edit`} className="flex-1">
              <Button
                variant="outline"
                className="w-full h-auto py-3.5 rounded-xl border-zinc-700/50 bg-zinc-800/60 text-zinc-300 
                           hover:bg-zinc-800 hover:text-white hover:border-indigo-500/40
                           transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Editar receita
              </Button>
            </Link>
            <div className="flex-1">
              <DeleteRecipeButton recipeId={recipe.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Right column: chat panel — fixed on desktop, hidden on mobile */}
      <div className="hidden lg:flex w-[480px] shrink-0 h-screen border-l border-zinc-700/40 bg-zinc-800/40 backdrop-blur-sm relative z-10">
        <ChatPanel recipeId={recipe.id} initialMessages={messages} />
      </div>

      {/* Mobile: floating chat button + drawer */}
      <MobileChatDrawer recipeId={recipe.id} initialMessages={messages} />
    </div>
  );
}

