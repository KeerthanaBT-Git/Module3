import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createFavoritesSlice } from "./favoritesSlice";
import { createUISlice } from "./uiSlice";
import type { AppStore } from "./types";

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createFavoritesSlice(...a),
        ...createUISlice(...a),
      }),
      {
        name: "recipe-collection-store",
        // Only persist favorites, not UI state
        partialize: (state) => ({
          favorites: state.favorites,
        }),
      }
    ),
    {
      name: "RecipeCollectionStore",
      enabled: import.meta.env.DEV,
    }
  )
);

// Typed selectors for better performance
export const useFavorites = () => useAppStore((state) => state.favorites);
export const useIsFavorite = (recipeId: string) =>
  useAppStore((state) => state.favorites.includes(recipeId));
export const useSelectedCategory = () =>
  useAppStore((state) => state.selectedCategory);
export const useShowingFavorites = () =>
  useAppStore((state) => state.showingFavorites);

// Re-export types
export type { AppStore, FavoritesSlice, UISlice } from "./types";
