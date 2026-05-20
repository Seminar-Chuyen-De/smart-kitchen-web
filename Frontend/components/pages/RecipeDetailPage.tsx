"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RecipeDetail, RecipeDetailSkeleton } from "@/frontend/components/recipe/RecipeDetail";
import type { Recipe } from "@/frontend/hooks/useRecipes";

// Mock data for dev
const MOCK_RECIPES: Record<number, Recipe> = {
  1: {
    recipe_id: 1,
    recipes_name: "Cơm chiên dương châu",
    description: "Cơm chiên thập cẩm với tôm, lạp xưởng, trứng và rau củ hấp dẫn. Món ăn nhanh, dễ làm phù hợp cho bữa trưa và tối.",
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
      { ingredient_id: 2, name: "Tôm tươi", quantity: 100, unit: "g" },
      { ingredient_id: 3, name: "Trứng gà", quantity: 2, unit: "quả" },
      { ingredient_id: 4, name: "Lạp xưởng", quantity: 1, unit: "cái" },
      { ingredient_id: 5, name: "Hành lá", quantity: 2, unit: "nhánh" },
    ],
    steps: [
      { step_id: 1, step_number: 1, instruction: "Làm nóng 2 muỗng dầu ăn trong chảo lớn ở lửa vừa cao.", time: 2 },
      { step_id: 2, step_number: 2, instruction: "Xào tôm và lạp xưởng cho đến khi chín vàng, khoảng 3-4 phút.", time: 4, tip: "Không xào quá lâu tôm sẽ dai." },
      { step_id: 3, step_number: 3, instruction: "Đẩy nguyên liệu sang một bên, đập trứng vào xào.", time: 2 },
      { step_id: 4, step_number: 4, instruction: "Cho cơm vào xào cùng, dùng muỗng bẻ vỡ các cục cơm.", time: 5 },
      { step_id: 5, step_number: 5, instruction: "Nêm nếm nước mắm, hạt nêm. Rắc hành lá lên trên và tắt bếp.", time: 2, tip: "Có thể thêm dầu hào để thêm đậm đà." },
    ],
    created_at: new Date().toISOString(),
  },
};

interface RecipeDetailPageProps {
  recipeId: number;
}

export function RecipeDetailPage({ recipeId }: RecipeDetailPageProps) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditConfirm, setShowEditConfirm] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/recipes/${recipeId}`);
        if (!res.ok) throw new Error("Không tìm thấy công thức");
        const data: Recipe = await res.json();
        setRecipe(data);
      } catch {
        // Fallback to mock data in dev
        const mockRecipe = MOCK_RECIPES[recipeId];
        if (mockRecipe) {
          setRecipe(mockRecipe);
        } else {
          setError("Không tìm thấy công thức này.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadRecipe();
  }, [recipeId]);

  if (isLoading) return <RecipeDetailSkeleton />;

  if (error || !recipe) {
    return (
      <div className="glass-card p-16 text-center space-y-4">
        <p className="text-4xl">😕</p>
        <p className="text-xl font-semibold text-white">Không tìm thấy công thức</p>
        <p className="text-zinc-400 text-sm">{error}</p>
      </div>
    );
  }

  // Chỉ cho phép sửa công thức MANUAL
  const isEditable = recipe.source_type === "MANUAL";

  const handleEditClick = () => {
    setShowEditConfirm(true);
  };

  const confirmEdit = () => {
    setShowEditConfirm(false);
    router.push(`/dashboard/recipes/${recipeId}/edit`);
  };

  return (
    <>
      <RecipeDetail
        recipe={recipe}
        onEdit={isEditable ? handleEditClick : undefined}
      />

      {/* Confirm Edit Dialog */}
      {showEditConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => setShowEditConfirm(false)}
          />
          <div className="relative glass-card p-6 max-w-sm w-full space-y-4">
            <h3 className="font-semibold text-white text-lg">✏️ Chỉnh sửa công thức?</h3>
            <p className="text-zinc-400 text-sm">
              Bạn có muốn chỉnh sửa công thức{" "}
              <span className="text-white font-medium">"{recipe.recipes_name}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmEdit}
                className="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white
                  rounded-xl text-sm font-medium transition-colors"
              >
                ✏️ Chỉnh sửa
              </button>
              <button
                onClick={() => setShowEditConfirm(false)}
                className="btn-ghost text-sm"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
