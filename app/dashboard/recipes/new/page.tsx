"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { RecipeForm } from "@/frontend/components/recipe/RecipeForm";
import { useRecipes } from "@/frontend/hooks/useRecipes";

export default function Page() {
  const router = useRouter();
  const { createRecipe } = useRecipes();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Parameters<typeof createRecipe>[0]) => {
    setIsLoading(true);
    try {
      const newRecipe = await createRecipe(data);
      if (newRecipe) {
        router.push(`/dashboard/recipes/${newRecipe.recipe_id}`);
      } else {
        router.push("/dashboard/recipes");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group mb-4"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại
        </button>
        <h1 className="text-3xl font-bold text-white">✏️ Tạo công thức mới</h1>
        <p className="text-zinc-400 text-sm mt-1">Nhập thông tin công thức của bạn bên dưới.</p>
      </div>
      <RecipeForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={isLoading}
      />
    </div>
  );
}
