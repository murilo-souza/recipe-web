import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRecipeById } from '@/lib/api/recipes';
import { Button } from '@/components/ui/button';
import { DeleteRecipeButton } from '@/components/recipes/DeleteRecipeButton';
import { getChatMessages } from '@/lib/api/chat';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { MobileChatDrawer } from '@/components/chat/MobileChatDrawer';
import { FileText, ListOrdered, Pencil, UtensilsCrossed } from 'lucide-react';
import { DetailCard } from '@/components/recipes/DetailCard';
import { ReturnButton } from '../../components/ReturnButton';

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
    <div className="noise-overlay relative flex flex-col bg-zinc-900 lg:h-screen lg:flex-row lg:overflow-hidden">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/6 blur-3xl" />
        <div className="absolute right-1/3 bottom-1/4 h-72 w-72 rounded-full bg-purple-500/4 blur-3xl" />
      </div>

      {/* Left column: recipe details — scrollable */}
      <div className="relative z-10 min-h-screen flex-1 lg:min-h-0 lg:overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-8 px-6 py-10 sm:px-10">
          {/* Header */}
          <div className="animate-fade-in-up flex items-center gap-4">
            <ReturnButton href="/" tooltip="Voltar para a home" />
            <div>
              <span className="text-xs font-medium tracking-wider text-indigo-400 uppercase">
                Receita
              </span>
              <h1 className="text-2xl leading-tight font-bold text-white sm:text-3xl">
                {recipe.title}
              </h1>
            </div>
          </div>

          {/* Image (if exists) */}
          {recipe.image && (
            <div className="animate-fade-in-up overflow-hidden rounded-2xl border border-zinc-700/50 delay-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={recipe.image}
                alt={recipe.title}
                className="h-64 w-full object-cover sm:h-80"
              />
            </div>
          )}

          {/* Description card */}
          <DetailCard
            icon={<FileText className="h-4 w-4 text-indigo-400" />}
            label="Descrição"
            delay="delay-200"
          >
            <p className="text-sm leading-relaxed text-zinc-300">{recipe.description}</p>
          </DetailCard>

          {/* Ingredients card */}
          <DetailCard
            icon={<UtensilsCrossed className="h-4 w-4 text-emerald-400" />}
            label="Ingredientes"
            count={recipe.ingredients.length}
            delay="delay-300"
          >
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i} className="group flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-400">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-zinc-300">{ingredient}</span>
                </li>
              ))}
            </ul>
          </DetailCard>

          {/* Steps card */}
          <DetailCard
            icon={<ListOrdered className="h-4 w-4 text-purple-400" />}
            label="Modo de Preparo"
            count={recipe.prepareSteps.length}
            delay="delay-400"
          >
            <ol className="space-y-3">
              {recipe.prepareSteps
                .sort((a, b) => a.position - b.position)
                .map((step) => (
                  <li key={step.id} className="group flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-purple-500/20 bg-linear-to-br from-purple-500/15 to-indigo-500/15 text-xs font-bold text-purple-400">
                      {step.position}
                    </span>
                    <span className="pt-1 text-sm leading-relaxed text-zinc-300">
                      {step.description}
                    </span>
                  </li>
                ))}
            </ol>
          </DetailCard>

          {/* Action buttons */}
          <div className="animate-fade-in-up flex gap-3 pt-2 pb-4 delay-500">
            <Link href={`/recipes/${recipe.id}/edit`} className="flex-1">
              <Button
                variant="outline"
                className="flex h-auto w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-zinc-700/50 bg-zinc-800/60 py-3.5 text-zinc-300 transition-all duration-300 hover:border-indigo-500/40 hover:bg-zinc-800 hover:text-white"
              >
                <Pencil className="h-4 w-4" />
                Editar receita
              </Button>
            </Link>
            <div className="flex-1">
              <DeleteRecipeButton recipeId={recipe.id} recipeTitle={recipe.title} />
            </div>
          </div>
        </div>
      </div>

      {/* Right column: chat panel — fixed on desktop, hidden on mobile */}
      <div className="relative z-10 hidden h-screen w-120 shrink-0 border-l border-zinc-700/40 bg-zinc-800/40 backdrop-blur-sm lg:flex">
        <ChatPanel recipeId={recipe.id} initialMessages={messages} />
      </div>

      {/* Mobile: floating chat button + drawer */}
      <MobileChatDrawer recipeId={recipe.id} initialMessages={messages} />
    </div>
  );
}
