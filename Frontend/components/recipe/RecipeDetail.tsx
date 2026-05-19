"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Users, Edit2, Trash2, BookPlus, Flame, Dumbbell, Wheat, Droplet } from "lucide-react";
import type { Recipe } from "@/frontend/hooks/useRecipes";

interface RecipeDetailProps {
  recipe: Recipe;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddToCookbook?: () => void;
}

const sourceConfig = {
  AI_GENERATED: { label: "🤖 AI Generated", className: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" },
  MANUAL: { label: "✏️ Thủ công", className: "bg-sky-500/20 text-sky-300 border border-sky-500/30" },
  IMPORTED: { label: "📥 Imported", className: "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30" },
} as const;

function NutritionCard({ icon: Icon, label, value, unit, color }: {
  icon: React.ElementType; label: string; value?: number; unit: string; color: string;
}) {
  return (
    <div className="glass-card p-4 text-center space-y-1">
      <Icon className={`w-5 h-5 mx-auto ${color}`} />
      <p className="text-lg font-bold text-white">{value ?? "—"}</p>
      <p className="text-xs text-zinc-500">{unit}</p>
      <p className="text-xs text-zinc-400">{label}</p>
    </div>
  );
}

export function RecipeDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-64 bg-zinc-800 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-9 w-2/3 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-full bg-zinc-800 rounded" />
        <div className="h-4 w-4/5 bg-zinc-800 rounded" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-zinc-800 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function RecipeDetail({ recipe, onEdit, onDelete, onAddToCookbook }: RecipeDetailProps) {
  const src = recipe.source_type ? sourceConfig[recipe.source_type] : sourceConfig.MANUAL;
  const formattedDate = new Date(recipe.created_at).toLocaleDateString("vi-VN", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back */}
      <Link
        href="/dashboard/recipes"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại danh sách
      </Link>

      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-900/50 via-zinc-800 to-zinc-900">
        {recipe.image_recipe ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image_recipe}
            alt={recipe.recipes_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl opacity-30">🍽️</span>
          </div>
        )}
        {/* Action overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          {onEdit && (
            <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 backdrop-blur border border-zinc-700 text-zinc-300 hover:text-white text-sm transition-colors">
              <Edit2 className="w-3.5 h-3.5" /> Sửa
            </button>
          )}
          {onAddToCookbook && (
            <button onClick={onAddToCookbook} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 backdrop-blur border border-zinc-700 text-zinc-300 hover:text-violet-300 text-sm transition-colors">
              <BookPlus className="w-3.5 h-3.5" /> Thêm vào Cookbook
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 backdrop-blur border border-red-900/60 text-zinc-300 hover:text-red-400 text-sm transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Xóa
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${src.className}`}>
            {src.label}
          </span>
          <span className="text-xs text-zinc-500">Tạo ngày {formattedDate}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          {recipe.recipes_name}
        </h1>
        {recipe.description && (
          <p className="text-zinc-400 leading-relaxed">{recipe.description}</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-5 text-sm text-zinc-400">
          {recipe.total_time && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-400" />
              {recipe.total_time} phút
            </span>
          )}
          {recipe.number_of_serves && (
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-brand-400" />
              {recipe.number_of_serves} người
            </span>
          )}
        </div>
      </div>

      {/* Nutrition */}
      {(recipe.calories || recipe.protein || recipe.carbs || recipe.fats) && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Thông tin dinh dưỡng (1 khẩu phần)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <NutritionCard icon={Flame} label="Calories" value={recipe.calories} unit="kcal" color="text-orange-400" />
            <NutritionCard icon={Dumbbell} label="Protein" value={recipe.protein} unit="g" color="text-sky-400" />
            <NutritionCard icon={Wheat} label="Carbs" value={recipe.carbs} unit="g" color="text-amber-400" />
            <NutritionCard icon={Droplet} label="Chất béo" value={recipe.fats} unit="g" color="text-emerald-400" />
          </div>
        </section>
      )}

      {/* Ingredients */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Nguyên liệu ({recipe.ingredients.length} loại)
          </h2>
          <div className="glass-card divide-y divide-zinc-800">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <span className="text-white font-medium">{ing.icon} {ing.name}</span>
                <span className="text-zinc-400 text-sm">
                  {ing.quantity} {ing.unit}
                  {ing.note && <span className="text-zinc-600 ml-2">({ing.note})</span>}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Steps */}
      {recipe.steps && recipe.steps.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Các bước thực hiện
          </h2>
          <ol className="space-y-4">
            {recipe.steps.map((step) => (
              <li key={step.step_id} className="glass-card p-5 flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 font-bold text-sm flex items-center justify-center">
                  {step.step_number}
                </span>
                <div className="space-y-2">
                  <p className="text-white leading-relaxed">{step.instruction}</p>
                  {step.tip && (
                    <p className="text-sm text-amber-400/80 flex items-start gap-1.5">
                      💡 <span>{step.tip}</span>
                    </p>
                  )}
                  {step.time && (
                    <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                      <Clock className="w-3 h-3" /> {step.time} phút
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Tags */}
      {recipe.tags && recipe.tags.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Tags</h2>
          <div className="flex gap-2 flex-wrap">
            {recipe.tags.map((tag) => (
              <span
                key={tag.tag_id}
                className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm"
              >
                {tag.emoji} {tag.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
