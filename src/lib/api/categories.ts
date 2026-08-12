import { apiFetch } from './server';
import type { CategoryResponse } from '@/lib/types/api';

export async function getAllCategories(): Promise<CategoryResponse[]> {
  const res = await apiFetch('/api/categories/get-all');
  if (!res.ok) throw new Error('Falha ao buscar categorias.');
  return res.json();
}
