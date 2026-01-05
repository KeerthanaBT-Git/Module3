import { useAppStore } from "../../store";
import { useDebounce } from "../../hooks/useDebounce";
import { useEffect, useState } from "react";

export function SearchInput() {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);

  // Local state for immediate input feedback
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce the search query
  const debouncedQuery = useDebounce(localQuery, 300);

  // Update Zustand store when debounced value changes
  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

  return (
    <div className="relative">
      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Search recipes..."
        className="input pl-10"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>
      {localQuery && (
        <button
          onClick={() => {
            setLocalQuery("");
            setSearchQuery("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}
