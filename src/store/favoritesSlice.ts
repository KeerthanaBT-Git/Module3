import type { StateCreator } from "zustand";
import type { AppStore, FavoritesSlice } from "./types";

export const createFavoritesSlice: StateCreator<
  AppStore,
  [],
  [],
  FavoritesSlice
> = (set, get) => ({
  favorites: [],

  addFavorite: (recipeId) =>
    set((state) => ({
      favorites: [...state.favorites, recipeId],
    })),

  removeFavorite: (recipeId) =>
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== recipeId),
    })),

  toggleFavorite: (recipeId) => {
    const { favorites, addFavorite, removeFavorite } = get();
    if (favorites.includes(recipeId)) {
      removeFavorite(recipeId);
    } else {
      addFavorite(recipeId);
    }
  },

  isFavorite: (recipeId) => get().favorites.includes(recipeId),

  clearFavorites: () => set({ favorites: [] }),
});
