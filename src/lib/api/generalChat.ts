import { apiFetch } from './server';
import type { GeneralChatMessageResponse } from '@/lib/types/api';

export async function getGeneralChatHistory(): Promise<GeneralChatMessageResponse[]> {
  const res = await apiFetch('/api/chat/general');
  if (!res.ok) return [];
  return res.json();
}
