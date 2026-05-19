"use client";

import { useState, useEffect, useCallback } from "react";
import type { Recipe } from "@/frontend/hooks/useRecipes";
import type { Cookbook } from "@/frontend/hooks/useCookbooks";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRecipes: number;
  totalCookbooks: number;
  lastRecipeCreatedAt: string | null; // ISO string
}

export interface DashboardData {
  stats: DashboardStats;
  recentRecipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Trả về thời gian tương đối bằng tiếng Việt */
export function formatRelativeTime(isoString: string | null): string {
  if (!isoString) return "Chưa có";

  const now = Date.now();
  const past = new Date(isoString).getTime();
  const diffMs = now - past;

  if (diffMs < 0) return "Vừa xong";

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Vừa xong";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} ngày trước`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} tháng trước`;

  return `${Math.floor(diffMonth / 12)} năm trước`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboard(): DashboardData {
  const [stats, setStats] = useState<DashboardStats>({
    totalRecipes: 0,
    totalCookbooks: 0,
    lastRecipeCreatedAt: null,
  });
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch song song recipes và cookbooks
      const [recipesRes, cookbooksRes] = await Promise.all([
        fetch("/api/recipes"),
        fetch("/api/cookbooks"),
      ]);

      if (!recipesRes.ok) throw new Error("Không thể tải công thức");
      if (!cookbooksRes.ok) throw new Error("Không thể tải cookbook");

      const recipes: Recipe[] = await recipesRes.json();
      const cookbooks: Cookbook[] = await cookbooksRes.json();

      // Sort recipes descending by created_at
      const sorted = [...recipes].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setStats({
        totalRecipes: recipes.length,
        totalCookbooks: cookbooks.length,
        lastRecipeCreatedAt: sorted[0]?.created_at ?? null,
      });

      // Lấy 3 recipes mới nhất
      setRecentRecipes(sorted.slice(0, 3));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi tải dữ liệu";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stats, recentRecipes, isLoading, error, refresh: fetchData };
}
