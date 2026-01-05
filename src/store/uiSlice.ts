import type { StateCreator } from "zustand";
import type { AppStore, UISlice } from "./types";

const initialUIState: Pick<
  UISlice,
  | "isFormModalOpen"
  | "isDetailModalOpen"
  | "editingRecipeId"
  | "viewingRecipeId"
  | "selectedCategory"
  | "showingFavorites"
  | "searchQuery"
> = {
  isFormModalOpen: false,
  isDetailModalOpen: false,
  editingRecipeId: null,
  viewingRecipeId: null,
  selectedCategory: "all",
  showingFavorites: false,
  searchQuery: "",
};

export const createUISlice: StateCreator<AppStore, [], [], UISlice> = (
  set
) => ({
  ...initialUIState,

  // Modal actions
  openFormModal: (recipeId) =>
    set({
      isFormModalOpen: true,
      editingRecipeId: recipeId ?? null,
    }),

  closeFormModal: () =>
    set({
      isFormModalOpen: false,
      editingRecipeId: null,
    }),

  openDetailModal: (recipeId) =>
    set({
      isDetailModalOpen: true,
      viewingRecipeId: recipeId,
    }),

  closeDetailModal: () =>
    set({
      isDetailModalOpen: false,
      viewingRecipeId: null,
    }),

  // Filter actions
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  toggleShowFavorites: () =>
    set((state) => ({ showingFavorites: !state.showingFavorites })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  // Reset
  resetUI: () => set(initialUIState),
});
