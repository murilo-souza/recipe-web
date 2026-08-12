import { apiFetch } from '@/lib/api/server';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const res = await apiFetch(`/api/recipe/delete?recipeId=${id}`, { method: 'DELETE' });

  if (!res.ok) {
    return Response.json({ error: 'Erro ao excluir receita.' }, { status: res.status });
  }

  return new Response(null, { status: 204 });
}