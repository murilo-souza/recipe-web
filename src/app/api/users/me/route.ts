import { apiFetch } from '@/lib/api/server';

export async function PUT(req: Request) {
  const body = await req.json();

  const res = await apiFetch('/api/user/me', {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    return Response.json(
      { error: errorText || 'Erro ao atualizar perfil.' },
      { status: res.status },
    );
  }

  return Response.json(await res.json());
}
