import { apiFetch } from '@/lib/api/server';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const res = await apiFetch(`/api/recipes/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    return Response.json(
      { error: errorText || 'Erro ao enviar mensagem.' },
      { status: res.status },
    );
  }

  return Response.json(await res.json());
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await apiFetch(`/api/recipes/${id}/messages`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorText = await res.text();
    return Response.json(
      { error: errorText || 'Erro ao deletar mensagem.' },
      { status: res.status },
    );
  }

  return new Response(null, { status: 204 });
}
