import { useAuth } from "../../context/AuthContext";
import { useAppStore } from "../../store";
import { Button } from "../ui/Button";

export function Header() {
  const { username, logout } = useAuth();

  // Zustand state and actions
  const favorites = useAppStore((state) => state.favorites);
  const showingFavorites = useAppStore((state) => state.showingFavorites);
  const toggleShowFavorites = useAppStore((state) => state.toggleShowFavorites);
  const openFormModal = useAppStore((state) => state.openFormModal);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-gray-900">
            🍳 Recipe Collection
          </h1>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant={showingFavorites ? "primary" : "ghost"}
              onClick={toggleShowFavorites}
            >
              ❤️ Favorites {favorites.length > 0 && `(${favorites.length})`}
            </Button>

            <Button onClick={() => openFormModal()}>+ Add Recipe</Button>

            <div className="flex items-center gap-3 pl-4 border-l">
              <span className="text-gray-600 text-sm">
                Welcome, <strong>{username}</strong>
              </span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
