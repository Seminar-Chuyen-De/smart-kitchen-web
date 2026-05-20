"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RecipeForm } from "@/frontend/components/recipe/RecipeForm";
import { useRecipes } from "@/frontend/hooks/useRecipes";
import { RecipeDetailSkeleton } from "@/frontend/components/recipe/RecipeDetail";
import type { Recipe } from "@/frontend/hooks/useRecipes";

interface RecipeEditPageProps {
  recipeId: number;
}

export function RecipeEditPage({ recipeId }: RecipeEditPageProps) {
  const router = useRouter();
  const { updateRecipe } = useRecipes();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch recipe data để populate form
  useEffect(() => {
    const loadRecipe = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/recipes/${recipeId}`);
        if (!res.ok) throw new Error("Không tìm thấy công thức");
        const data: Recipe = await res.json();
        setRecipe(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải công thức");
      } finally {
        setIsLoading(false);
      }
    };
    loadRecipe();
  }, [recipeId]);

  const handleSubmit = async (
    data: Parameters<typeof updateRecipe>[1] & {
      ingredients: { ingredient_id?: number; name: string; quantity: string; unit: string; note: string }[];
      steps: { instruction: string; tip: string; time: string }[];
    }
  ) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateRecipe(recipeId, {
        recipes_name:     data.recipes_name,
        description:      data.description,
        image_recipe:     data.image_recipe,
        total_time:       data.total_time,
        number_of_serves: data.number_of_serves,
        calories:         data.calories,
        protein:          data.protein,
        carbs:            data.carbs,
        fats:             data.fats,
        ingredients:      data.ingredients,  // ← FIX: truyền ingredients
        steps:            data.steps,        // ← FIX: truyền steps
      });
      router.push(`/dashboard/recipes/${recipeId}`);
    } catch {
      setSaveError("Cập nhật công thức thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse" />
        <RecipeDetailSkeleton />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="glass-card p-16 text-center space-y-4">
        <p className="text-4xl">😕</p>
        <p className="text-xl font-semibold text-white">Không thể tải công thức</p>
        <p className="text-zinc-400 text-sm">{error}</p>
        <button
          onClick={() => router.push(`/dashboard/recipes/${recipeId}`)}
          className="btn-ghost text-sm"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push(`/dashboard/recipes/${recipeId}`)}
          className="inline-flex items-center gap-2 text-sm text-brand-500 bg-brand-500/20
            hover:text-white hover:bg-white/10 rounded-xl px-3 py-1.5 transition-colors group mb-4"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại công thức
        </button>
        <h1 className="text-3xl font-bold text-white">✏️ Chỉnh sửa công thức</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Đang chỉnh sửa:{" "}
          <span className="text-zinc-200 font-medium">{recipe.recipes_name}</span>
        </p>
      </div>

      {/* Save error banner */}
      {saveError && (
        <div className="glass-card p-4 flex items-center gap-3 border-red-500/30 bg-red-500/10">
          <p className="text-sm text-red-300 flex-1">{saveError}</p>
          <button
            onClick={() => setSaveError(null)}
            className="text-xs text-red-400 hover:text-red-200 underline"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Form — tái sử dụng RecipeForm với initialData */}
      <RecipeForm
        initialData={recipe}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/dashboard/recipes/${recipeId}`)}
        isLoading={isSaving}
        submitLabel="💾 Cập nhật công thức"
      />
    </div>
  );
}
