import { apiFetch } from '@/lib/api/server';
import type { CreateRecipeRequest } from '@/lib/types/api';

export async function POST(req: Request) {
  const body: CreateRecipeRequest = await req.json();

  const res = await apiFetch('/api/recipe/create', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    return Response.json({ error: errorText || 'Erro ao criar receita.' }, { status: res.status });
  }

  return Response.json(await res.json(), { status: 201 });
}
