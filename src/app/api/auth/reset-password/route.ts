// src/app/api/auth/reset-password/route.ts
export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${process.env.API_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return Response.json(
      { error: data.error ?? 'Não foi possível redefinir a senha.' },
      { status: res.status },
    );
  }

  return new Response(null, { status: 204 });
}
