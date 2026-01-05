import type { RecipeCategory } from "../types/recipe";

// Favorites slice types
export interface FavoritesSlice {
  favorites: string[];
  addFavorite: (recipeId: string) => void;
  removeFavorite: (recipeId: string) => void;
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  clearFavorites: () => void;
}

// UI slice types
export interface UISlice {
  // Modal state
  isFormModalOpen: boolean;
  isDetailModalOpen: boolean;
  editingRecipeId: string | null;
  viewingRecipeId: string | null;

  // Filter state
  selectedCategory: RecipeCategory | "all";
  showingFavorites: boolean;
  searchQuery: string;

  // Modal actions
  openFormModal: (recipeId?: string) => void;
  closeFormModal: () => void;
  openDetailModal: (recipeId: string) => void;
  closeDetailModal: () => void;

  // Filter actions
  setSelectedCategory: (category: RecipeCategory | "all") => void;
  toggleShowFavorites: () => void;
  setSearchQuery: (query: string) => void;

  // Reset
  resetUI: () => void;
}

// Combined store type
export type AppStore = FavoritesSlice & UISlice;
