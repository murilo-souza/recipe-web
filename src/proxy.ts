import { NextResponse, type NextRequest } from 'next/server';
import { getTokenExpiry } from '@/lib/session';

const SESSION_COOKIE = 'session';
const REFRESH_MARGIN_MS = 60 * 1000; // renova 1 minuto antes de vencer

export async function proxy(req: NextRequest) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE);

  if (!sessionCookie) return NextResponse.next();

  let session;
  try {
    session = JSON.parse(sessionCookie.value);
  } catch {
    return NextResponse.next();
  }

  const expiry = getTokenExpiry(session.accessToken);
  const isExpiringSoon = expiry !== null && expiry - Date.now() < REFRESH_MARGIN_MS;

  if (!isExpiringSoon) return NextResponse.next();

  const refreshRes = await fetch(`${process.env.API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
       Cookie: `refreshToken=${session.refreshToken}`,
    },
  });

  if (!refreshRes.ok) {
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  const data = await refreshRes.json();
  const setCookieHeader = refreshRes.headers.get('set-cookie');
  const newRefreshTokenMatch = setCookieHeader?.match(/refreshToken=([^;]+)/);
  const newRefreshToken = newRefreshTokenMatch
    ? decodeURIComponent(newRefreshTokenMatch[1])
    : session.refreshToken;

  const updatedSession = {
    ...session,
    accessToken: data.accessToken,
    refreshToken: newRefreshToken,
  };

  const response = NextResponse.next();
  response.cookies.set(SESSION_COOKIE, JSON.stringify(updatedSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};