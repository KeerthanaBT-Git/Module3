import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Recipe, RecipeFormData, RecipeCategory } from "../types/recipe";

interface UseRecipesOptions {
  category?: RecipeCategory | "all";
}

interface UseRecipesReturn {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  fetchRecipes: () => Promise<void>;
  createRecipe: (data: RecipeFormData) => Promise<Recipe | null>;
  updateRecipe: (id: string, data: RecipeFormData) => Promise<Recipe | null>;
  deleteRecipe: (id: string) => Promise<boolean>;
  getRecipeById: (id: string) => Promise<Recipe | null>;
}

export function useRecipes(options: UseRecipesOptions = {}): UseRecipesReturn {
  const { category = "all" } = options;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply category filter if not 'all'
      if (category !== "all") {
        query = query.eq("category", category);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setRecipes(data || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch recipes";
      setError(message);
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const createRecipe = useCallback(
    async (data: RecipeFormData): Promise<Recipe | null> => {
      try {
        setError(null);
        const { data: newRecipe, error: createError } = await supabase
          .from("recipes")
          .insert([data])
          .select()
          .single();

        if (createError) throw createError;

        // Add to local state
        setRecipes((prev) => [newRecipe, ...prev]);
        return newRecipe;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create recipe";
        setError(message);
        console.error("Error creating recipe:", err);
        return null;
      }
    },
    []
  );

  const updateRecipe = useCallback(
    async (id: string, data: RecipeFormData): Promise<Recipe | null> => {
      try {
        setError(null);
        const { data: updatedRecipe, error: updateError } = await supabase
          .from("recipes")
          .update(data)
          .eq("id", id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Update local state
        setRecipes((prev) =>
          prev.map((recipe) => (recipe.id === id ? updatedRecipe : recipe))
        );
        return updatedRecipe;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update recipe";
        setError(message);
        console.error("Error updating recipe:", err);
        return null;
      }
    },
    []
  );

  const deleteRecipe = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from("recipes")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      // Remove from local state
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete recipe";
      setError(message);
      console.error("Error deleting recipe:", err);
      return false;
    }
  }, []);

  const getRecipeById = useCallback(
    async (id: string): Promise<Recipe | null> => {
      try {
        const { data, error: fetchError } = await supabase
          .from("recipes")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        return data;
      } catch (err) {
        console.error("Error fetching recipe:", err);
        return null;
      }
    },
    []
  );

  // Fetch recipes on mount and when category changes
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    fetchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
  };
}
