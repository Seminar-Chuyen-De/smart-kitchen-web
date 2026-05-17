"use client";

import { useState, useCallback } from "react";
import type { Recipe } from "@/frontend/hooks/useRecipes";

export interface Cookbook {
  cookbook_id: number;
  name: string;
  recipes?: Recipe[];
  created_at: string;
  _count?: { recipes: number };
}

// Mock data for dev
const MOCK_COOKBOOKS: Cookbook[] = [
  {
    cookbook_id: 1,
    name: "🍳 Bữa sáng nhanh",
    created_at: new Date().toISOString(),
    _count: { recipes: 5 },
    recipes: [],
  },
  {
    cookbook_id: 2,
    name: "🥗 Ăn healthy",
    created_at: new Date().toISOString(),
    _count: { recipes: 3 },
    recipes: [],
  },
  {
    cookbook_id: 3,
    name: "🍲 Món Việt truyền thống",
    created_at: new Date().toISOString(),
    _count: { recipes: 8 },
    recipes: [],
  },
];

export function useCookbooks() {
  const [cookbooks, setCookbooks] = useState<Cookbook[]>(MOCK_COOKBOOKS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCookbooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cookbooks");
      if (!res.ok) throw new Error("Không thể tải cookbook");
      const data: Cookbook[] = await res.json();
      setCookbooks(data);
    } catch {
      setError(null); // Keep mock in dev
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCookbook = useCallback(async (name: string): Promise<Cookbook | null> => {
    try {
      const res = await fetch("/api/cookbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Tạo cookbook thất bại");
      const cb: Cookbook = await res.json();
      setCookbooks((prev) => [cb, ...prev]);
      return cb;
    } catch {
      const mockCb: Cookbook = {
        cookbook_id: Date.now(),
        name,
        created_at: new Date().toISOString(),
        _count: { recipes: 0 },
        recipes: [],
      };
      setCookbooks((prev) => [mockCb, ...prev]);
      return mockCb;
    }
  }, []);

  const updateCookbook = useCallback(async (id: number, name: string): Promise<void> => {
    setCookbooks((prev) => prev.map((cb) => cb.cookbook_id === id ? { ...cb, name } : cb));
    try {
      await fetch(`/api/cookbooks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    } catch { /* rollback in prod */ }
  }, []);

  const deleteCookbook = useCallback(async (id: number): Promise<void> => {
    setCookbooks((prev) => prev.filter((cb) => cb.cookbook_id !== id));
    try {
      await fetch(`/api/cookbooks/${id}`, { method: "DELETE" });
    } catch { /* rollback in prod */ }
  }, []);

  const addRecipeToCookbook = useCallback(async (cookbookId: number, recipeId: number): Promise<void> => {
    setCookbooks((prev) =>
      prev.map((cb) =>
        cb.cookbook_id === cookbookId
          ? { ...cb, _count: { recipes: (cb._count?.recipes ?? 0) + 1 } }
          : cb
      )
    );
    try {
      await fetch(`/api/cookbooks/${cookbookId}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });
    } catch { /* rollback */ }
  }, []);

  const removeRecipeFromCookbook = useCallback(async (cookbookId: number, recipeId: number): Promise<void> => {
    setCookbooks((prev) =>
      prev.map((cb) =>
        cb.cookbook_id === cookbookId
          ? {
              ...cb,
              _count: { recipes: Math.max(0, (cb._count?.recipes ?? 0) - 1) },
              recipes: cb.recipes?.filter((r) => r.recipe_id !== recipeId),
            }
          : cb
      )
    );
    try {
      await fetch(`/api/cookbooks/${cookbookId}/recipes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });
    } catch { /* rollback */ }
  }, []);

  return {
    cookbooks,
    isLoading,
    error,
    fetchCookbooks,
    createCookbook,
    updateCookbook,
    deleteCookbook,
    addRecipeToCookbook,
    removeRecipeFromCookbook,
  };
}
