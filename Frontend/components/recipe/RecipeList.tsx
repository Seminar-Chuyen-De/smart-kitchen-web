"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, Plus, ChefHat } from "lucide-react";
import { RecipeCard, RecipeCardSkeleton } from "@/frontend/components/recipe/RecipeCard";
import type { Recipe } from "@/frontend/hooks/useRecipes";

interface RecipeListProps {
  recipes: Recipe[];
  isLoading: boolean;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
  onAddToCookbook?: (recipe: Recipe) => void;
}

export function RecipeList({
  recipes,
  isLoading,
  onEdit,
  onDelete,
  onAddToCookbook,
}: RecipeListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <div className="flex gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="w-8 h-8 bg-zinc-800 rounded animate-pulse" />
            <div className="w-8 h-8 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="glass-card p-16 flex flex-col items-center gap-5 text-center">
        <div className="w-20 h-20 rounded-2xl bg-zinc-800 flex items-center justify-center">
          <ChefHat className="w-10 h-10 text-zinc-600" />
        </div>
        <div>
          <p className="text-xl font-semibold text-white">Chưa có công thức nào</p>
          <p className="text-zinc-400 text-sm mt-1">
            Hãy scan nguyên liệu hoặc tạo công thức đầu tiên của bạn!
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/scan" className="btn-primary flex items-center gap-2 text-sm">
            📸 Scan AI
          </Link>
          <Link href="/dashboard/recipes/new" className="btn-ghost flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            Tạo thủ công
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* View toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-all ${
              viewMode === "grid"
                ? "bg-brand-500/20 text-brand-300"
                : "text-zinc-500 hover:text-white"
            }`}
            title="Dạng lưới"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-all ${
              viewMode === "list"
                ? "bg-brand-500/20 text-brand-300"
                : "text-zinc-500 hover:text-white"
            }`}
            title="Dạng danh sách"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.recipe_id}
              recipe={recipe}
              onEdit={onEdit ? () => onEdit(recipe) : undefined}
              onDelete={onDelete ? () => onDelete(recipe) : undefined}
              onAddToCookbook={onAddToCookbook ? () => onAddToCookbook(recipe) : undefined}
            />
          ))}
        </div>
      ) : (
        // List view
        <div className="space-y-2">
          {recipes.map((recipe) => (
            <Link
              key={recipe.recipe_id}
              href={`/dashboard/recipes/${recipe.recipe_id}`}
              className="glass-card p-4 flex items-center gap-4 hover:border-brand-500/40 hover:bg-white/[0.06] transition-all duration-200 group block"
            >
              <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {recipe.image_recipe ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={recipe.image_recipe} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🍽️</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white group-hover:text-brand-300 transition-colors truncate">
                  {recipe.recipes_name}
                </p>
                <p className="text-sm text-zinc-400 truncate">{recipe.description}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {recipe.total_time && (
                  <span className="text-xs text-zinc-500">{recipe.total_time}p</span>
                )}
                {onEdit && (
                  <button
                    onClick={(e) => { e.preventDefault(); onEdit(recipe); }}
                    className="p-1.5 rounded text-zinc-500 hover:text-brand-300 transition-colors"
                  >
                    ✏️
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => { e.preventDefault(); onDelete(recipe); }}
                    className="p-1.5 rounded text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
