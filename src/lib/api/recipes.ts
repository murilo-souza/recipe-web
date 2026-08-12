import { apiFetch } from './server';
import type { RecipeSummaryResponse, RecipeResponse } from '@/lib/types/api';

export async function getAllRecipes(): Promise<RecipeSummaryResponse[]> {
  const res = await apiFetch('/api/recipe/get-all-recipes');
  if (!res.ok) throw new Error('Falha ao buscar receitas.');
  return res.json();
}

export async function getRecipeById(id: number): Promise<RecipeResponse | null> {
  const res = await apiFetch(`/api/recipe/get-recipe-by-id?recipeId=${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Falha ao buscar receita.');
  return res.json();
}
