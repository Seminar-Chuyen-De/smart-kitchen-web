"use client";

import Link from "next/link";
import { Clock, Users, Edit2, Trash2, BookPlus } from "lucide-react";
import type { Recipe } from "@/frontend/hooks/useRecipes";

const sourceConfig = {
  AI_GENERATED: { label: "🤖 AI", className: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" },
  MANUAL: { label: "✏️ Thủ công", className: "bg-sky-500/20 text-sky-300 border border-sky-500/30" },
  IMPORTED: { label: "📥 Import", className: "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30" },
} as const;

interface RecipeCardProps {
  recipe: Recipe;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddToCookbook?: () => void;
}

export function RecipeCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="h-40 bg-zinc-800" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 bg-zinc-800 rounded" />
        <div className="h-4 w-full bg-zinc-800 rounded" />
        <div className="flex justify-between">
          <div className="h-5 w-16 bg-zinc-800 rounded-full" />
          <div className="h-4 w-20 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export function RecipeCard({ recipe, onEdit, onDelete, onAddToCookbook }: RecipeCardProps) {
  const src = recipe.source_type ? sourceConfig[recipe.source_type] : sourceConfig.MANUAL;
  const maxTags = 3;
  const visibleTags = recipe.tags?.slice(0, maxTags) ?? [];
  const extraTagCount = (recipe.tags?.length ?? 0) - maxTags;

  return (
    <div className="glass-card overflow-hidden hover:border-brand-500/40 transition-all duration-200 group relative">
      {/* Image */}
      <Link href={`/dashboard/recipes/${recipe.recipe_id}`}>
        <div className="relative h-40 bg-gradient-to-br from-brand-900/40 via-zinc-800 to-zinc-900 overflow-hidden">
          {recipe.image_recipe ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.image_recipe}
              alt={recipe.recipes_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-40">🍽️</span>
            </div>
          )}
        </div>
      </Link>

      {/* Hover actions overlay */}
      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {onEdit && (
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-lg bg-zinc-900/90 backdrop-blur border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 hover:text-brand-300 text-zinc-400 transition-colors"
            title="Chỉnh sửa"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
        {onAddToCookbook && (
          <button
            onClick={onAddToCookbook}
            className="w-8 h-8 rounded-lg bg-zinc-900/90 backdrop-blur border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 hover:text-violet-300 text-zinc-400 transition-colors"
            title="Thêm vào Cookbook"
          >
            <BookPlus className="w-3.5 h-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="w-8 h-8 rounded-lg bg-zinc-900/90 backdrop-blur border border-zinc-700 flex items-center justify-center hover:bg-red-900/60 hover:text-red-400 text-zinc-400 transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      <Link href={`/dashboard/recipes/${recipe.recipe_id}`}>
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-white line-clamp-1 group-hover:text-brand-300 transition-colors">
            {recipe.recipes_name}
          </h3>
          {recipe.description && (
            <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
              {recipe.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${src.className}`}>
              {src.label}
            </span>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              {recipe.total_time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {recipe.total_time}p
                </span>
              )}
              {recipe.number_of_serves && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {recipe.number_of_serves}
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {visibleTags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {visibleTags.map((tag) => (
                <span
                  key={tag.tag_id}
                  className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
                >
                  {tag.emoji} {tag.name}
                </span>
              ))}
              {extraTagCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">
                  +{extraTagCount}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
