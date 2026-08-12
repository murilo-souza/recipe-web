import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRecipeById } from '@/lib/api/recipes';
import { Button } from '@/components/ui/button';
import { DeleteRecipeButton } from '@/components/recipes/DeleteRecipeButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(Number(id));

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      {/* Coluna esquerda: detalhes */}
      <div className="flex-1 px-8 sm:px-16 py-10 space-y-6 max-w-3xl">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-white text-2xl">←</Link>
          <h1 className="text-white text-[22px] font-semibold">Detalhes da receita</h1>
        </div>

        <DetailCard label="TÍTULO">
          <p className="text-white text-sm">{recipe.title}</p>
        </DetailCard>

        <DetailCard label="DESCRIÇÃO">
          <p className="text-white text-sm">{recipe.description}</p>
        </DetailCard>

        <DetailCard label="INGREDIENTES">
          <ul className="space-y-1">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i} className="text-white text-sm">{ingredient}</li>
            ))}
          </ul>
        </DetailCard>

        <DetailCard label="MODO DE PREPARO">
          <ol className="space-y-1">
            {recipe.prepareSteps
              .sort((a, b) => a.position - b.position)
              .map((step) => (
                <li key={step.id} className="text-white text-sm">{step.position}. {step.description}</li>
              ))}
          </ol>
        </DetailCard>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 h-auto py-3.5">
            <Link href={`/recipes/${recipe.id}/edit`}>Editar receita</Link>
          </Button>
          <DeleteRecipeButton recipeId={recipe.id} />
        </div>
      </div>

      {/* Coluna direita: painel de chat — placeholder por enquanto */}
      <div className="hidden lg:flex w-[420px] bg-zinc-800 items-center justify-center">
        <p className="text-zinc-500 text-sm">Chat em construção</p>
      </div>
    </div>
  );
}

function DetailCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-zinc-700 border border-indigo-400 px-7 py-5.5 space-y-2.5">
      <div className="flex items-center gap-2.5">
        <span className="h-5 w-5 rounded-full bg-zinc-400 shrink-0" />
        <span className="text-white text-sm">{label}</span>
      </div>
      {children}
    </div>
  );
}