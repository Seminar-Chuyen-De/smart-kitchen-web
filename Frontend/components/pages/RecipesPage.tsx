"use client";

import { useState, useEffect } from "react";
import { Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { useRecipes } from "@/frontend/hooks/useRecipes";
import { RecipeList } from "@/frontend/components/recipe/RecipeList";
import type { Recipe } from "@/frontend/hooks/useRecipes";

export function RecipesPage() {
  const { recipes, isLoading, fetchRecipes, deleteRecipe } = useRecipes();
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchRecipes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = recipes.filter((r) => {
    const matchSearch = !search || r.recipes_name.toLowerCase().includes(search.toLowerCase());
    const matchSource = filterSource === "all" || r.source_type === filterSource;
    return matchSearch && matchSource;
  });

  const handleDelete = async (recipe: Recipe) => {
    setDeleteTarget(recipe);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteRecipe(deleteTarget.recipe_id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">📖 Công thức của tôi</h1>
          <p className="text-zinc-400 text-sm mt-1">{recipes.length} công thức</p>
        </div>
        <Link href="/dashboard/recipes/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Tạo công thức
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm công thức..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 text-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-300 focus:outline-none focus:border-brand-500 text-sm"
        >
          <option value="all">Tất cả nguồn</option>
          <option value="AI_GENERATED">🤖 AI Generated</option>
          <option value="MANUAL">✏️ Thủ công</option>
          <option value="IMPORTED">📥 Imported</option>
        </select>
      </div>

      {/* Recipe List */}
      <RecipeList
        recipes={filtered}
        isLoading={isLoading}
        onDelete={handleDelete}
      />

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative glass-card p-6 max-w-sm w-full space-y-4">
            <h3 className="font-semibold text-white text-lg">Xóa công thức?</h3>
            <p className="text-zinc-400 text-sm">
              Bạn có chắc muốn xóa <span className="text-white font-medium">"{deleteTarget.recipes_name}"</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Xóa
              </button>
              <button onClick={() => setDeleteTarget(null)} className="btn-ghost text-sm">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
