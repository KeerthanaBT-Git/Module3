import { clsx } from "clsx";
import { useAppStore } from "../../store";
import type { Recipe } from "../../types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: () => void;
}

export function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  // Zustand state and actions
  const isFavorite = useAppStore((state) =>
    state.favorites.includes(recipe.id)
  );
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const openDetailModal = useAppStore((state) => state.openDetailModal);
  const openFormModal = useAppStore((state) => state.openFormModal);

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
          className={clsx(
            "absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all",
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-600 hover:bg-white"
          )}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>

        {/* Category badge */}
        <span className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 text-xs font-medium rounded capitalize">
          {recipe.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
          {recipe.title}
        </h3>

        {recipe.description && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
          {totalTime > 0 && (
            <span className="flex items-center gap-1">⏱️ {totalTime} min</span>
          )}
          <span className="flex items-center gap-1">
            👥 {recipe.servings} servings
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <button
            onClick={() => openDetailModal(recipe.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            View
          </button>
          <button
            onClick={() => openFormModal(recipe.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
