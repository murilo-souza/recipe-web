// src/lib/api/server.ts
import { cookies } from 'next/headers';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const sessionRaw = cookieStore.get('session')?.value;
  const session = sessionRaw ? JSON.parse(sessionRaw) : null;

  const res = await fetch(`${process.env.API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      ...options.headers,
    },
    cache: 'no-store', // dados de receita mudam com frequência, não faz sentido cachear
  });

  return res;
}