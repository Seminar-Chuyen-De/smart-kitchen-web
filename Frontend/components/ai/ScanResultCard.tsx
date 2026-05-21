"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RefreshCcw, Save, Clock, Users, ChevronRight, Edit2 } from "lucide-react";
import type { ScanResult } from "@/frontend/hooks/useScan";
import { RecipeForm } from "@/frontend/components/recipe/RecipeForm";
import type { CreateRecipeInput, Recipe } from "@/frontend/hooks/useRecipes";

interface ScanResultCardProps {
  result: ScanResult;
  onReset: () => void;
  onEditingChange?: (isEditing: boolean) => void;
}

type FormIngredient = { ingredient_id?: number; name: string; quantity: string; unit: string; note: string };
type FormStep = { instruction: string; tip: string; time: string };

// Skeleton shown while scanning
export function ScanResultSkeleton() {
  return (
    <div className="glass-card p-6 space-y-5 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-5 w-24 bg-zinc-800 rounded-full" />
      </div>
      <div className="h-8 w-3/4 bg-zinc-800 rounded-lg" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-zinc-800 rounded" />
        <div className="h-4 w-5/6 bg-zinc-800 rounded" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-7 w-20 bg-zinc-800 rounded-full" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-6 h-6 bg-zinc-800 rounded-full flex-shrink-0" />
            <div className="h-4 flex-1 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Map AI scan data (string arrays) → RecipeForm's Partial<Recipe> initialData shape.
 * - ingredients: string[] → RecipeIngredient[] (only `name` is available from AI scan)
 * - instructions: string[] → Step[] (only `instruction` is available)
 */
function buildFormInitialData(recipe: ScanResult["recipe"]): Partial<Recipe> {
  return {
    recipes_name: recipe.title,
    description: recipe.description,
    image_recipe: recipe.image_recipe,
    total_time: recipe.cookTime,
    number_of_serves: recipe.servings,
    source_type: "AI_GENERATED",
    ingredients: recipe.ingredients.map((name, i) => ({
      ingredient_id: i, // placeholder id (form uses it as a key only)
      name,
      quantity: undefined,
      unit: undefined,
      note: undefined,
    })),
    steps: recipe.instructions.map((instruction, i) => ({
      step_id: i,
      step_number: i + 1,
      instruction,
      tip: undefined,
      time: undefined,
    })),
  };
}

export function ScanResultCard({ result, onReset, onEditingChange }: ScanResultCardProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { recipe } = result;

  const handleEditClick = () => {
    setIsEditing(true);
    onEditingChange?.(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    onEditingChange?.(false);
  };

  // Quick-save: POST AI data as-is (original flow, no editing)
  const handleQuickSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipes_name: recipe.title,
          description: recipe.description,
          total_time: recipe.cookTime,
          number_of_serves: recipe.servings,
          source_type: "AI_GENERATED",
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          image_recipe: recipe.image_recipe,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(true);
        setTimeout(() => router.push(`/dashboard/recipes/${data.recipe_id}`), 800);
      }
    } catch {
      // Optimistic fallback
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  // Form-save: POST edited data from RecipeForm (after user edits)
  const handleFormSubmit = async (
    data: CreateRecipeInput & { ingredients?: FormIngredient[]; steps?: FormStep[] }
  ) => {
    setSaving(true);
    try {
      const payload = {
        recipes_name: data.recipes_name,
        description: data.description,
        total_time: data.total_time ? Number(data.total_time) : undefined,
        number_of_serves: data.number_of_serves ? Number(data.number_of_serves) : undefined,
        source_type: "AI_GENERATED",
        image_recipe: data.image_recipe,
        ingredients: (data.ingredients || [])
          .filter((i) => i.name.trim())
          .map((i) => ({
            name: i.name,
            quantity: i.quantity ? Number(i.quantity) : undefined,
            unit: i.unit || undefined,
            note: i.note || undefined,
          })),
        steps: (data.steps || [])
          .filter((s) => s.instruction.trim())
          .map((s, idx) => ({
            step_number: idx + 1,
            instruction: s.instruction,
            tip: s.tip || undefined,
            time: s.time ? Number(s.time) : undefined,
          })),
      };

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        const saved = await res.json();
        setSaved(true);
        setTimeout(() => router.push(`/dashboard/recipes/${saved.recipe_id}`), 800);
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("Save recipe failed:", errData);
        alert(`Lỗi lưu công thức: ${JSON.stringify(errData.error || "Không xác định")}`);
        setSaving(false);
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      alert("Đã xảy ra lỗi mạng khi lưu công thức.");
      setSaving(false);
    }
  };

  // ── Edit mode: show RecipeForm pre-filled with AI data ──
  if (isEditing) {
    return (
      <div className="space-y-4">
        {/* Edit mode header */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-medium">
            ✏️ Đang chỉnh sửa kết quả AI
          </span>
          <span className="text-zinc-500 text-xs">Chỉnh sửa rồi nhấn &ldquo;Lưu công thức&rdquo;</span>
        </div>

        {saving && (
          <div className="glass-card p-3 flex items-center gap-2 text-sm text-brand-300 border border-brand-500/30">
            <span className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin inline-block" />
            Đang lưu công thức...
          </div>
        )}

        <RecipeForm
          initialData={buildFormInitialData(recipe)}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelEdit}
          isLoading={saving}
          submitLabel="💾 Lưu công thức"
        />
      </div>
    );
  }

  // ── Preview mode: show scan result card + action buttons ──
  return (
    <div className="glass-card p-6 space-y-6">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
          ✨ AI Generated
        </span>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white">{recipe.title}</h2>
        <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{recipe.description}</p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-5 text-sm text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-brand-400" />
          {recipe.cookTime} phút
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-brand-400" />
          {recipe.servings} người
        </span>
      </div>

      {/* Ingredients */}
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Nguyên liệu nhận diện
        </p>
        <div className="flex flex-wrap gap-2">
          {recipe.ingredients.map((ing, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm"
            >
              {ing}
            </span>
          ))}
        </div>
      </div>

      {/* Steps preview (first 3) */}
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Các bước thực hiện
        </p>
        <ol className="space-y-3">
          {recipe.instructions.slice(0, 3).map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm text-zinc-300 leading-relaxed">{step}</p>
            </li>
          ))}
          {recipe.instructions.length > 3 && (
            <li className="flex items-center gap-2 text-zinc-500 text-sm pl-9">
              <ChevronRight className="w-3 h-3" />
              và {recipe.instructions.length - 3} bước nữa...
            </li>
          )}
        </ol>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 flex-wrap">
        {/* Primary CTA: Edit then save */}
        <button
          id="scan-edit-btn"
          onClick={handleEditClick}
          className="btn-primary flex items-center gap-2 flex-1 justify-center"
        >
          <Edit2 className="w-4 h-4" />
          Chỉnh sửa &amp; Lưu
        </button>

        {/* Quick-save without editing */}
        <button
          id="scan-quick-save-btn"
          onClick={handleQuickSave}
          disabled={saving || saved}
          className="btn-ghost flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saved ? "✅ Đã lưu!" : saving ? "Đang lưu..." : "Lưu nhanh"}
        </button>

        {/* Reset */}
        <button
          id="scan-reset-btn"
          onClick={onReset}
          className="btn-ghost flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Scan lại
        </button>
      </div>
    </div>
  );
}
