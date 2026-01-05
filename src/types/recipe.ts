export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: "breakfast" | "lunch" | "dinner" | "dessert" | "snack";
  prep_time: number | null;
  cook_time: number | null;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  created_at: string;
  updated_at: string;
}

export type RecipeCategory = Recipe["category"];

export interface RecipeFormData {
  title: string;
  description: string;
  image_url: string;
  category: RecipeCategory;
  prep_time: number;
  cook_time: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
}

export const CATEGORIES: RecipeCategory[] = [
  "breakfast",
  "lunch",
  "dinner",
  "dessert",
  "snack",
];
