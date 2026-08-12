import { apiFetch } from '@/lib/api/server';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const res = await apiFetch(`/api/recipe/update?recipeId=${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    return Response.json(
      { error: errorText || 'Erro ao atualizar receita.' },
      { status: res.status },
    );
  }

  return new Response(null, { status: 204 }); // lembra: UpdateRecipeAsync não retorna corpo
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await apiFetch(`/api/recipe/delete?recipeId=${id}`, { method: 'DELETE' });

  if (!res.ok) {
    return Response.json({ error: 'Erro ao excluir receita.' }, { status: res.status });
  }

  return new Response(null, { status: 204 });
}
