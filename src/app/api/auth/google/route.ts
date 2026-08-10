import { setSession } from '@/lib/session';
import type { AuthResponse } from '@/lib/types/api';

export async function POST(req: Request) {
  const { idToken } = await req.json();

  const apiRes = await fetch(`${process.env.API_URL}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!apiRes.ok) {
    const errorText = await apiRes.text();
    return Response.json({ error: errorText || 'Falha na autenticação.' }, { status: apiRes.status });
  }

  const data: AuthResponse = await apiRes.json();

  await setSession({
    accessToken: data.accessToken,
    userName: data.userName,
    email: data.email,
  });

  return Response.json({ userName: data.userName, email: data.email });
}