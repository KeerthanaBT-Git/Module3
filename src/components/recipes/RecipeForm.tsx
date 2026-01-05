import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import {
  CATEGORIES,
  type Recipe,
  type RecipeFormData,
  type Ingredient,
} from "../../types/recipe";

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: (data: RecipeFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const emptyIngredient: Ingredient = { name: "", amount: 0, unit: "" };

export function RecipeForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: RecipeFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [category, setCategory] = useState(initialData?.category || "dinner");
  const [prepTime, setPrepTime] = useState(initialData?.prep_time || 0);
  const [cookTime, setCookTime] = useState(initialData?.cook_time || 0);
  const [servings, setServings] = useState(initialData?.servings || 4);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients.length
      ? initialData.ingredients
      : [{ ...emptyIngredient }]
  );
  const [instructions, setInstructions] = useState<string[]>(
    initialData?.instructions.length ? initialData.instructions : [""]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Filter out empty ingredients and instructions
    const validIngredients = ingredients.filter(
      (ing) => ing.name.trim() && ing.amount > 0
    );
    const validInstructions = instructions.filter((inst) => inst.trim());

    await onSubmit({
      title,
      description,
      image_url: imageUrl,
      category,
      prep_time: prepTime,
      cook_time: cookTime,
      servings,
      ingredients: validIngredients,
      instructions: validInstructions,
    });
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { ...emptyIngredient }]);
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipe Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="e.g., Classic Pancakes"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input min-h-[80px]"
            placeholder="A brief description of your recipe..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="input"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prep Time (min)
            </label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(Number(e.target.value))}
              className="input"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cook Time (min)
            </label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(Number(e.target.value))}
              className="input"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servings
            </label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="input"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Ingredients
          </label>
          <button
            type="button"
            onClick={addIngredient}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add Ingredient
          </button>
        </div>

        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="number"
                value={ingredient.amount || ""}
                onChange={(e) =>
                  updateIngredient(index, "amount", Number(e.target.value))
                }
                className="input w-20"
                placeholder="Qty"
                step="0.25"
                min="0"
              />
              <input
                type="text"
                value={ingredient.unit}
                onChange={(e) =>
                  updateIngredient(index, "unit", e.target.value)
                }
                className="input w-24"
                placeholder="Unit"
              />
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
                className="input flex-1"
                placeholder="Ingredient name"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="px-3 text-red-500 hover:text-red-700"
                disabled={ingredients.length === 1}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Instructions
          </label>
          <button
            type="button"
            onClick={addInstruction}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add Step
          </button>
        </div>

        <div className="space-y-2">
          {instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2">
              <span className="flex items-center justify-center w-8 h-10 bg-gray-100 rounded text-sm font-medium text-gray-600">
                {index + 1}
              </span>
              <input
                type="text"
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                className="input flex-1"
                placeholder={`Step ${index + 1}...`}
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="px-3 text-red-500 hover:text-red-700"
                disabled={instructions.length === 1}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Recipe"
            : "Create Recipe"}
        </Button>
      </div>
    </form>
  );
}
