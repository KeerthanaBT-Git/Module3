import { clsx } from "clsx";
import { CATEGORIES, type RecipeCategory } from "../../types/recipe";

interface CategoryFilterProps {
  selected: RecipeCategory | "all";
  onChange: (category: RecipeCategory | "all") => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const allCategories: (RecipeCategory | "all")[] = ["all", ...CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize",
            selected === category
              ? "bg-primary-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {category === "all" ? "🍽️ All" : getCategoryEmoji(category)}{" "}
          {category}
        </button>
      ))}
    </div>
  );
}

function getCategoryEmoji(category: RecipeCategory): string {
  const emojis: Record<RecipeCategory, string> = {
    breakfast: "🍳",
    lunch: "🥗",
    dinner: "🍝",
    dessert: "🍰",
    snack: "🍿",
  };
  return emojis[category];
}
