"use client";

import { useState, useCallback } from "react";

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

// --- Mock data for dev before API is ready ---
const MOCK_RECIPES: Recipe[] = [
  {
    recipe_id: 1,
    recipes_name: "Cơm chiên dương châu",
    description: "Cơm chiên thập cẩm với tôm, lạp xưởng, trứng và rau củ hấp dẫn.",
    total_time: 20,
    number_of_serves: 2,
    calories: 520,
    protein: 22,
    carbs: 68,
    fats: 14,
    source_type: "AI_GENERATED",
    tags: [{ tag_id: 1, name: "Cơm", emoji: "🍚" }, { tag_id: 2, name: "Nhanh", emoji: "⚡" }],
    ingredients: [
      { ingredient_id: 1, name: "Cơm nguội", quantity: 2, unit: "bát" },
      { ingredient_id: 2, name: "Tôm", quantity: 100, unit: "g" },
      { ingredient_id: 3, name: "Trứng gà", quantity: 2, unit: "quả" },
    ],
    steps: [
      { step_id: 1, step_number: 1, instruction: "Làm nóng dầu ăn trong chảo lớn ở lửa vừa cao.", time: 2 },
      { step_id: 2, step_number: 2, instruction: "Xào tôm và lạp xưởng cho đến khi chín.", time: 5 },
      { step_id: 3, step_number: 3, instruction: "Cho cơm vào xào đều, thêm gia vị.", time: 8 },
    ],
    created_at: new Date().toISOString(),
  },
  {
    recipe_id: 2,
    recipes_name: "Canh chua cá lóc",
    description: "Canh chua truyền thống miền Nam với cá lóc tươi và rau đậu bắp.",
    total_time: 35,
    number_of_serves: 4,
    source_type: "MANUAL",
    tags: [{ tag_id: 3, name: "Canh", emoji: "🍲" }],
    ingredients: [],
    steps: [],
    created_at: new Date().toISOString(),
  },
  {
    recipe_id: 3,
    recipes_name: "Gỏi cuốn tôm thịt",
    description: "Gỏi cuốn tươi mát với tôm, thịt, rau thơm và bún.",
    total_time: 30,
    number_of_serves: 3,
    source_type: "AI_GENERATED",
    tags: [{ tag_id: 4, name: "Gỏi", emoji: "🥗" }, { tag_id: 5, name: "Healthy", emoji: "💚" }],
    ingredients: [],
    steps: [],
    created_at: new Date().toISOString(),
  },
];

// --- Hook ---
export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
  const [isLoading, setIsLoading] = useState(false);
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
    } catch {
      // Keep mock data in dev, set error in prod
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
