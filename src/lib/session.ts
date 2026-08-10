import { cookies } from 'next/headers';

const SESSION_COOKIE = 'session';

interface SessionData {
  accessToken: string;
  refreshToken: string;
  userName: string;
  email: string;
}

export async function setSession(data: SessionData) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function getTokenExpiry(accessToken: string): number | null {
  try {
    const payload = accessToken.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    return decoded.exp ? decoded.exp * 1000 : null; // exp vem em segundos, JS usa ms
  } catch {
    return null;
  }
}