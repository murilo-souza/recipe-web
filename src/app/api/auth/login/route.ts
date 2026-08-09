import { setSession } from '@/lib/session';
import type { LoginRequest, AuthResponse } from '@/lib/types/api';

export async function POST(req: Request) {
  const body: LoginRequest = await req.json();

  const apiRes = await fetch(`${process.env.API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!apiRes.ok) {
    const errorText = await apiRes.text();
    return Response.json({ error: errorText || 'Credenciais inválidas' }, { status: apiRes.status });
  }

  const data: AuthResponse = await apiRes.json();

  await setSession({
    accessToken: data.accessToken,
    userName: data.userName,
    email: data.email,
  });

  return Response.json({ userName: data.userName, email: data.email });
}