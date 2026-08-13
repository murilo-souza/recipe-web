import { apiFetch } from './server';
import type { UserResponse } from '@/lib/types/api';

export async function getCurrentUser(): Promise<UserResponse | null> {
  const res = await apiFetch('/api/user/me');
  if (!res.ok) return null;
  return res.json();
}
