import { useMemo, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginForm } from "./components/auth/LoginForm";
import { Header } from "./components/layout/Header";
import { CategoryFilter } from "./components/ui/CategoryFilter";
import { SearchInput } from "./components/ui/SearchInput";
import { Modal } from "./components/ui/Modal";
import { ToastContainer } from "./components/ui/Toast";
import { RecipeList } from "./components/recipes/RecipeList";
import { RecipeForm } from "./components/recipes/RecipeForm";
import { RecipeDetail } from "./components/recipes/RecipeDetail";
import { useRecipes } from "./hooks/useRecipes";
import { useToast } from "./hooks/useToast";
import { useAppStore } from "./store";
import type { RecipeFormData } from "./types/recipe";

function RecipeApp() {
  const { isAuthenticated } = useAuth();
  const { toasts, dismissToast, success, error: showError } = useToast();

  // Zustand state
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);
  const showingFavorites = useAppStore((state) => state.showingFavorites);
  const favorites = useAppStore((state) => state.favorites);
  const searchQuery = useAppStore((state) => state.searchQuery);

  // Modal state from Zustand
  const isFormModalOpen = useAppStore((state) => state.isFormModalOpen);
  const isDetailModalOpen = useAppStore((state) => state.isDetailModalOpen);
  const editingRecipeId = useAppStore((state) => state.editingRecipeId);
  const viewingRecipeId = useAppStore((state) => state.viewingRecipeId);
  const closeFormModal = useAppStore((state) => state.closeFormModal);
  const closeDetailModal = useAppStore((state) => state.closeDetailModal);

  // Fetch recipes using our custom hook
  const { recipes, loading, error, createRecipe, updateRecipe, deleteRecipe } =
    useRecipes({ category: selectedCategory });

  // Find the recipe being edited or viewed
  const editingRecipe = useMemo(
    () => recipes.find((r) => r.id === editingRecipeId),
    [recipes, editingRecipeId]
  );

  const viewingRecipe = useMemo(
    () => recipes.find((r) => r.id === viewingRecipeId),
    [recipes, viewingRecipeId]
  );

  // Filter recipes
  const displayedRecipes = useMemo(() => {
    let filtered = recipes;

    // Filter by favorites
    if (showingFavorites) {
      filtered = filtered.filter((r) => favorites.includes(r.id));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.ingredients.some((ing) => ing.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [recipes, showingFavorites, favorites, searchQuery]);

  // Form submission handler
  const handleFormSubmit = useCallback(
    async (data: RecipeFormData) => {
      try {
        if (editingRecipeId) {
          const result = await updateRecipe(editingRecipeId, data);
          if (result) {
            success("Recipe updated successfully!");
            closeFormModal();
          } else {
            showError("Failed to update recipe");
          }
        } else {
          const result = await createRecipe(data);
          if (result) {
            success("Recipe created successfully!");
            closeFormModal();
          } else {
            showError("Failed to create recipe");
          }
        }
      } catch (err) {
        console.error(err);
        showError("An error occurred");
      }
    },
    [
      editingRecipeId,
      createRecipe,
      updateRecipe,
      closeFormModal,
      success,
      showError,
    ]
  );

  // Delete handler
  const handleDelete = useCallback(
    async (recipeId: string) => {
      const recipe = recipes.find((r) => r.id === recipeId);
      if (
        recipe &&
        window.confirm(`Are you sure you want to delete "${recipe.title}"?`)
      ) {
        const result = await deleteRecipe(recipeId);
        if (result) {
          success("Recipe deleted successfully!");
        } else {
          showError("Failed to delete recipe");
        }
      }
    },
    [recipes, deleteRecipe, success, showError]
  );

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="w-full md:w-80">
            <SearchInput />
          </div>
          <div className="flex-1 overflow-x-auto">
            <CategoryFilter
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Status indicators */}
        {(showingFavorites || searchQuery) && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            {showingFavorites && "❤️ Showing favorites"}
            {showingFavorites && searchQuery && " • "}
            {searchQuery && `🔍 Searching for "${searchQuery}"`}
            {" • "}
            {displayedRecipes.length} recipe(s) found
          </div>
        )}

        {/* Recipe List */}
        <RecipeList
          recipes={displayedRecipes}
          loading={loading}
          error={error}
          onDelete={handleDelete}
        />
      </main>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={editingRecipe ? "Edit Recipe" : "Add New Recipe"}
        size="xl"
      >
        <RecipeForm
          initialData={editingRecipe}
          onSubmit={handleFormSubmit}
          onCancel={closeFormModal}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        title={viewingRecipe?.title || "Recipe Details"}
        size="lg"
      >
        {viewingRecipe && <RecipeDetail recipe={viewingRecipe} />}
      </Modal>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <RecipeApp />
    </AuthProvider>
  );
}

export default App;
