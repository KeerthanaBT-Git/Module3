import { useState, useCallback, useMemo } from "react";
import type { Ingredient } from "../types/recipe";

interface UseServingCalculatorOptions {
  initialServings: number;
  ingredients: Ingredient[];
}

interface UseServingCalculatorReturn {
  currentServings: number;
  multiplier: number;
  adjustedIngredients: Ingredient[];
  increaseServings: () => void;
  decreaseServings: () => void;
  setServings: (servings: number) => void;
  resetServings: () => void;
}

export function useServingCalculator({
  initialServings,
  ingredients,
}: UseServingCalculatorOptions): UseServingCalculatorReturn {
  const [currentServings, setCurrentServings] = useState(initialServings);

  const multiplier = currentServings / initialServings;

  const adjustedIngredients = useMemo(() => {
    return ingredients.map((ingredient) => ({
      ...ingredient,
      amount: Number((ingredient.amount * multiplier).toFixed(2)),
    }));
  }, [ingredients, multiplier]);

  const increaseServings = useCallback(() => {
    setCurrentServings((prev) => prev + 1);
  }, []);

  const decreaseServings = useCallback(() => {
    setCurrentServings((prev) => Math.max(1, prev - 1));
  }, []);

  const setServings = useCallback((servings: number) => {
    setCurrentServings(Math.max(1, servings));
  }, []);

  const resetServings = useCallback(() => {
    setCurrentServings(initialServings);
  }, [initialServings]);

  return {
    currentServings,
    multiplier,
    adjustedIngredients,
    increaseServings,
    decreaseServings,
    setServings,
    resetServings,
  };
}
