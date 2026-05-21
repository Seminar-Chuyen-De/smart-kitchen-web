"use client";

import { useState, useCallback, useEffect } from "react";

// --- Types ---
export interface RecipeIngredient {
  ingredient_id: number;
  name: string;
  icon?: string;
  quantity?: number;
  unit?: string;
  note?: string;
}

export interface Step {
  step_id: number;
  step_number: number;
  instruction: string;
  tip?: string;
  time?: number;
}

export interface Tag {
  tag_id: number;
  name: string;
  emoji?: string;
  category?: string;
}

export interface Recipe {
  recipe_id: number;
  recipes_name: string;
  description?: string;
  image_recipe?: string;
  total_time?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  source_type?: "MANUAL" | "IMPORTED" | "AI_GENERATED";
  number_of_serves?: number;
  ingredients?: RecipeIngredient[];
  steps?: Step[];
  tags?: Tag[];
  created_at: string;
  updated_at?: string;
}

export interface CreateRecipeInput {
  recipes_name: string;
  description?: string;
  image_recipe?: string;
  total_time?: number;
  number_of_serves?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  source_type?: Recipe["source_type"];
  // Cho phép truyền steps & ingredients khi tạo recipe
  ingredients?: { ingredient_id?: number; name: string; quantity: string; unit: string; note: string }[];
  steps?: { instruction: string; tip: string; time: string }[];
}

export type UpdateRecipeInput = Partial<CreateRecipeInput> & {
  ingredients?: { ingredient_id?: number; name: string; quantity: string; unit: string; note: string }[];
  steps?: { instruction: string; tip: string; time: string }[];
};

// --- Hook ---
export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true); // true on mount so skeleton shows immediately
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async (query?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = query
        ? `/api/recipes?q=${encodeURIComponent(query)}`
        : "/api/recipes";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Không thể tải danh sách công thức");
      const data: Recipe[] = await res.json();
      setRecipes(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi tải công thức";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const createRecipe = useCallback(async (data: CreateRecipeInput): Promise<Recipe | null> => {
    // Map CreateRecipeInput (snake_case / form shape) → API payload (camelCase)
    const { ingredients, steps, ...meta } = data;

    const apiPayload: Record<string, unknown> = {
      recipesName:    meta.recipes_name,
      description:    meta.description,
      imageRecipe:    meta.image_recipe,
      totalTime:      meta.total_time,
      numberOfServes: meta.number_of_serves,
      calories:       meta.calories,
      protein:        meta.protein,
      carbs:          meta.carbs,
      fats:           meta.fats,
      sourceType:     meta.source_type ?? "MANUAL",
    };

    // Map ingredients nếu có
    if (ingredients && ingredients.length > 0) {
      apiPayload.ingredients = ingredients
        .filter((i) => i.name.trim())
        .map((i) => ({
          name:     i.name,
          quantity: i.quantity ? Number(i.quantity) : undefined,
          unit:     i.unit || undefined,
          note:     i.note || undefined,
        }));
    }

    // Map steps nếu có
    if (steps && steps.length > 0) {
      apiPayload.steps = steps
        .filter((s) => s.instruction.trim())
        .map((s, idx) => ({
          stepNumber:  idx + 1,
          instruction: s.instruction,
          tip:         s.tip || undefined,
          time:        s.time ? Number(s.time) : undefined,
        }));
    }

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });
      if (!res.ok) throw new Error("Tạo công thức thất bại");
      const newRecipe: Recipe = await res.json();
      setRecipes((prev) => [newRecipe, ...prev]);
      return newRecipe;
    } catch {
      // Optimistic update with mock ID (no steps/ingredients in fallback)
      const mockRecipe: Recipe = {
        recipes_name:    data.recipes_name,
        description:     data.description,
        image_recipe:    data.image_recipe,
        total_time:      data.total_time,
        number_of_serves: data.number_of_serves,
        calories:        data.calories,
        protein:         data.protein,
        carbs:           data.carbs,
        fats:            data.fats,
        recipe_id:       Date.now(),
        source_type:     data.source_type ?? "MANUAL",
        created_at:      new Date().toISOString(),
      };
      setRecipes((prev) => [mockRecipe, ...prev]);
      return mockRecipe;
    }
  }, []);

  const updateRecipe = useCallback(async (id: number, data: UpdateRecipeInput): Promise<void> => {
    // Optimistic update — chỉ spread metadata, KHÔNG spread ingredients/steps
    // vì shape của chúng khác với RecipeIngredient[] trong state
    const { ingredients: _ing, steps: _steps, ...metadataOnly } = data;
    setRecipes((prev) =>
      prev.map((r) => (r.recipe_id === id ? { ...r, ...metadataOnly } : r))
    );

    // Map sang camelCase + kiểu số để phù hợp với Backend schema
    const apiPayload: Record<string, unknown> = {
      recipesName:    data.recipes_name,
      description:    data.description,
      imageRecipe:    data.image_recipe,
      totalTime:      data.total_time,
      numberOfServes: data.number_of_serves,
      calories:       data.calories,
      protein:        data.protein,
      carbs:          data.carbs,
      fats:           data.fats,
    };

    // Map ingredients — chỉ những ingredient đã có ingredient_id
    if (data.ingredients) {
      const mapped = data.ingredients
        .filter((i) => i.name.trim() && i.ingredient_id)
        .map((i) => ({
          ingredientId: i.ingredient_id!,
          quantity: i.quantity ? Number(i.quantity) : undefined,
          unit: i.unit || undefined,
          note: i.note || undefined,
        }));
      if (mapped.length > 0) apiPayload.ingredients = mapped;
    }

    // Map steps — thêm stepNumber và parse time thành number
    if (data.steps) {
      const mapped = data.steps
        .filter((s) => s.instruction.trim())
        .map((s, idx) => ({
          stepNumber:  idx + 1,
          instruction: s.instruction,
          tip:         s.tip || undefined,
          time:        s.time ? Number(s.time) : undefined,
        }));
      if (mapped.length > 0) apiPayload.steps = mapped;
    }

    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
    } catch {
      // Rollback — re-fetch nếu cần
    }
  }, []);

  const deleteRecipe = useCallback(async (id: number): Promise<void> => {
    // Optimistic delete
    setRecipes((prev) => prev.filter((r) => r.recipe_id !== id));
    try {
      await fetch(`/api/recipes/${id}`, { method: "DELETE" });
    } catch {
      // Rollback would go here
    }
  }, []);

  return {
    recipes,
    isLoading,
    error,
    fetchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
}
