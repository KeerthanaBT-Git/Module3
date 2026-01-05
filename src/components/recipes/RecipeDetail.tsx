import { Button } from "../ui/Button";
import { useServingCalculator } from "../../hooks/useServingCalculator";
import { useAppStore } from "../../store";
import type { Recipe } from "../../types/recipe";

interface RecipeDetailProps {
  recipe: Recipe;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const closeDetailModal = useAppStore((state) => state.closeDetailModal);
  const openFormModal = useAppStore((state) => state.openFormModal);

  const {
    currentServings,
    adjustedIngredients,
    increaseServings,
    decreaseServings,
    resetServings,
  } = useServingCalculator({
    initialServings: recipe.servings,
    ingredients: recipe.ingredients,
  });

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  const isAdjusted = currentServings !== recipe.servings;

  const handleEdit = () => {
    closeDetailModal();
    openFormModal(recipe.id);
  };

  return (
    <div className="space-y-6">
      {/* Image */}
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-lg"
        />
      )}

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full capitalize">
          {recipe.category}
        </span>
        {recipe.prep_time && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            🔪 Prep: {recipe.prep_time} min
          </span>
        )}
        {recipe.cook_time && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            🍳 Cook: {recipe.cook_time} min
          </span>
        )}
        {totalTime > 0 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            ⏱️ Total: {totalTime} min
          </span>
        )}
      </div>

      {/* Description */}
      {recipe.description && (
        <p className="text-gray-600">{recipe.description}</p>
      )}

      {/* Serving adjuster */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <span className="font-medium text-gray-700">Servings:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={decreaseServings}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          >
            −
          </button>
          <span className="w-16 text-center font-semibold">
            {currentServings}
          </span>
          <button
            onClick={increaseServings}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          >
            +
          </button>
        </div>
        {isAdjusted && (
          <button
            onClick={resetServings}
            className="text-sm text-primary-600 hover:underline"
          >
            Reset to {recipe.servings}
          </button>
        )}
      </div>

      {/* Ingredients */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Ingredients
        </h3>
        <ul className="space-y-2">
          {adjustedIngredients.map((ingredient, index) => {
            // Format number: show decimals only if needed
            const formattedAmount =
              ingredient.amount % 1 === 0
                ? ingredient.amount.toString()
                : ingredient.amount.toFixed(2).replace(/\.?0+$/, "");

            return (
              <li key={index} className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>
                  <strong>{formattedAmount}</strong> {ingredient.unit}{" "}
                  {ingredient.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Instructions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Instructions
        </h3>
        <ol className="space-y-4">
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <p className="text-gray-700 pt-1">{instruction}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="secondary" onClick={closeDetailModal}>
          Close
        </Button>
        <Button onClick={handleEdit}>Edit Recipe</Button>
      </div>
    </div>
  );
}
