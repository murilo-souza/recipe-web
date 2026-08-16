// src/app/api/auth/forgot-password/route.ts
export async function POST(req: Request) {
  const body = await req.json();

  await fetch(`${process.env.API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  // sempre 200, espelhando o mesmo princípio do backend — não revela nada aqui também
  return Response.json({ success: true });
}
