import { apiFetch } from '@/lib/api/server';

export async function POST(req: Request) {
  const body = await req.json();

  const res = await apiFetch('/api/chat/general', {
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
