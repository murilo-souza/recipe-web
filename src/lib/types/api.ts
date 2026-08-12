export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  userName: string;
  email: string;
}

export interface RecipeSummaryResponse {
  id: number;
  title: string;
  description: string;
  image: string | null;
  categoryId: number;
  createdAt: string;
}

export interface PrepareStepItem {
  id: number;
  description: string;
  position: number;
}

export interface RecipeResponse {
  id: number;
  title: string;
  description: string;
  image: string | null;
  categoryId: number;
  ingredients: string[];
  prepareSteps: PrepareStepItem[];
  createdAt: string;
}

export interface CreateRecipeRequest {
  title: string;
  description: string;
  categoryId: number;
  image: string | null;
  ingredients: string[];
  prepareSteps: string[];
}

export interface CategoryResponse {
  id: number;
  name: string;
}