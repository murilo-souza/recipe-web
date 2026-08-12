import { apiFetch } from './server';
import type { ChatMessageResponse } from '@/lib/types/api';

export async function getChatMessages(recipeId: number): Promise<ChatMessageResponse[]> {
  const res = await apiFetch(`/api/recipes/${recipeId}/messages`);
  if (!res.ok) throw new Error('Falha ao buscar mensagens.');
  return res.json();
}