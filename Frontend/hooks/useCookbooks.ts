"use client";

import { useState, useCallback, useEffect } from "react";
import type { Recipe } from "@/frontend/hooks/useRecipes";

export interface Cookbook {
  cookbook_id: number;
  name: string;
  recipes?: Recipe[];
  created_at: string;
  _count?: { recipes: number };
}

// Remove mock data

export function useCookbooks() {
  const [cookbooks, setCookbooks] = useState<Cookbook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCookbooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cookbooks");
      if (!res.ok) throw new Error("Không thể tải danh sách cookbook");
      const data: Cookbook[] = await res.json();
      setCookbooks(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi tải cookbook";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchCookbooks();
  }, [fetchCookbooks]);

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
