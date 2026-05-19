"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Trash2, Plus, Search, X, Check } from "lucide-react";
import { useCookbooks } from "@/frontend/hooks/useCookbooks";
import { useRecipes } from "@/frontend/hooks/useRecipes";
import { RecipeList } from "@/frontend/components/recipe/RecipeList";
import type { Cookbook } from "@/frontend/hooks/useCookbooks";

interface CookbookDetailProps {
  cookbookId: number;
}

export function CookbookDetail({ cookbookId }: CookbookDetailProps) {
  const { cookbooks, fetchCookbooks, updateCookbook, deleteCookbook, addRecipeToCookbook, removeRecipeFromCookbook } = useCookbooks();
  const { recipes, fetchRecipes } = useRecipes();
  const [cookbook, setCookbook] = useState<Cookbook | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const found = cookbooks.find((cb) => cb.cookbook_id === cookbookId);
    setCookbook(found ?? null);
    if (found) setNameInput(found.name);
  }, [cookbooks, cookbookId]);

  if (!cookbook) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-9 w-64 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-48 bg-zinc-800 rounded" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-zinc-800 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const cookbookRecipes = cookbook.recipes ?? [];

  const handleSaveName = async () => {
    if (!nameInput.trim() || nameInput === cookbook.name) {
      setIsEditingName(false);
      return;
    }
    await updateCookbook(cookbookId, nameInput.trim());
    setIsEditingName(false);
  };

  const handleDelete = async () => {
    await deleteCookbook(cookbookId);
    window.location.href = "/dashboard/cookbooks";
  };

  const filteredAllRecipes = recipes.filter(
    (r) =>
      r.recipes_name.toLowerCase().includes(addSearch.toLowerCase()) &&
      !cookbookRecipes.some((cr) => cr.recipe_id === r.recipe_id)
  );

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/dashboard/cookbooks"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại Cookbooks
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          {isEditingName ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setIsEditingName(false); }}
                className="text-2xl font-bold bg-zinc-900 border border-brand-500 rounded-xl px-4 py-2 text-white focus:outline-none flex-1"
              />
              <button onClick={handleSaveName} className="p-2 rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors">
                <Check className="w-5 h-5" />
              </button>
              <button onClick={() => setIsEditingName(false)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">{cookbook.name}</h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="p-2 rounded-lg text-zinc-500 hover:text-brand-300 hover:bg-white/5 transition-colors"
                title="Đổi tên"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Thêm công thức
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-ghost flex items-center gap-2 text-sm hover:border-red-500/40 hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </button>
        </div>
      </div>

      <p className="text-zinc-400 text-sm -mt-4">
        {cookbookRecipes.length} công thức
      </p>

      {/* Recipe List */}
      <RecipeList
        recipes={cookbookRecipes}
        isLoading={false}
        onDelete={async (recipe) => {
          await removeRecipeFromCookbook(cookbookId, recipe.recipe_id);
        }}
      />

      {/* Add Recipe Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative glass-card p-6 max-w-lg w-full space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-lg">Thêm công thức vào Cookbook</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                autoFocus
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
                placeholder="Tìm kiếm công thức..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 -mr-2 pr-2">
              {filteredAllRecipes.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-8">
                  {addSearch ? "Không tìm thấy công thức" : "Tất cả công thức đã được thêm"}
                </p>
              ) : (
                filteredAllRecipes.map((recipe) => (
                  <button
                    key={recipe.recipe_id}
                    onClick={async () => {
                      await addRecipeToCookbook(cookbookId, recipe.recipe_id);
                      setShowAddModal(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-brand-500/40 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {recipe.image_recipe ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={recipe.image_recipe} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">🍽️</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate group-hover:text-brand-300 transition-colors">
                        {recipe.recipes_name}
                      </p>
                      {recipe.total_time && (
                        <p className="text-xs text-zinc-500">{recipe.total_time} phút</p>
                      )}
                    </div>
                    <Plus className="w-4 h-4 text-zinc-600 group-hover:text-brand-400 flex-shrink-0 transition-colors" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative glass-card p-6 max-w-sm w-full space-y-4">
            <h3 className="font-semibold text-white text-lg">Xóa Cookbook?</h3>
            <p className="text-zinc-400 text-sm">
              Bạn có chắc muốn xóa <span className="text-white font-medium">"{cookbook.name}"</span>?
              Các công thức trong cookbook sẽ không bị xóa.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-colors">
                Xóa
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-ghost text-sm">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
