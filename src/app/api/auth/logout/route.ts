// src/app/api/auth/logout/route.ts
import { clearSession, getSession } from '@/lib/session';

export async function POST() {
  const session = await getSession();

  if (session?.refreshToken) {
    await fetch(`${process.env.API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: `refreshToken=${session.refreshToken}` },
    }).catch(() => {}); // não bloqueia o logout local se a API falhar
  }

  await clearSession();
  return new Response(null, { status: 204 });
}
