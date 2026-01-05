import { RecipeCard } from "./RecipeCard";
import type { Recipe } from "../../types/recipe";

interface RecipeListProps {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  onDelete: (recipeId: string) => void;
}

export function RecipeList({
  recipes,
  loading,
  error,
  onDelete,
}: RecipeListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-lg mb-2">
          ⚠️ Error loading recipes
        </div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No recipes found
        </h3>
        <p className="text-gray-600">Start by adding your first recipe!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onDelete={() => onDelete(recipe.id)}
        />
      ))}
    </div>
  );
}
