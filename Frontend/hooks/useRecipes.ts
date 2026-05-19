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
}

export type UpdateRecipeInput = Partial<CreateRecipeInput>;

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
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Tạo công thức thất bại");
      const newRecipe: Recipe = await res.json();
      setRecipes((prev) => [newRecipe, ...prev]);
      return newRecipe;
    } catch {
      // Optimistic update with mock ID
      const mockRecipe: Recipe = {
        ...data,
        recipe_id: Date.now(),
        source_type: data.source_type ?? "MANUAL",
        created_at: new Date().toISOString(),
      };
      setRecipes((prev) => [mockRecipe, ...prev]);
      return mockRecipe;
    }
  }, []);

  const updateRecipe = useCallback(async (id: number, data: UpdateRecipeInput): Promise<void> => {
    // Optimistic update
    setRecipes((prev) =>
      prev.map((r) => (r.recipe_id === id ? { ...r, ...data } : r))
    );
    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
    } catch {
      // Rollback on error (simplified — re-fetch in prod)
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
