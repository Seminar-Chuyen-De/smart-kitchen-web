"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { Recipe, CreateRecipeInput } from "@/frontend/hooks/useRecipes";

type FormIngredient = { name: string; quantity: string; unit: string; note: string };
type FormStep = { instruction: string; tip: string; time: string };

interface RecipeFormProps {
  initialData?: Partial<Recipe>;
  onSubmit: (data: CreateRecipeInput & { ingredients: FormIngredient[]; steps: FormStep[] }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
      {children} {required && <span className="text-red-400">*</span>}
    </label>
  );
}

function TextInput({ id, value, onChange, placeholder, type = "text", ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40 transition-all text-sm"
      {...rest}
    />
  );
}

export function RecipeForm({ initialData, onSubmit, onCancel, isLoading = false }: RecipeFormProps) {
  const [name, setName] = useState(initialData?.recipes_name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_recipe ?? "");
  const [totalTime, setTotalTime] = useState(String(initialData?.total_time ?? ""));
  const [serves, setServes] = useState(String(initialData?.number_of_serves ?? ""));
  const [calories, setCalories] = useState(String(initialData?.calories ?? ""));
  const [protein, setProtein] = useState(String(initialData?.protein ?? ""));
  const [carbs, setCarbs] = useState(String(initialData?.carbs ?? ""));
  const [fats, setFats] = useState(String(initialData?.fats ?? ""));

  const [ingredients, setIngredients] = useState<FormIngredient[]>([
    { name: "", quantity: "", unit: "", note: "" },
  ]);
  const [steps, setSteps] = useState<FormStep[]>([{ instruction: "", tip: "", time: "" }]);

  const addIngredient = useCallback(() => {
    setIngredients((prev) => [...prev, { name: "", quantity: "", unit: "", note: "" }]);
  }, []);

  const removeIngredient = useCallback((i: number) => {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  const updateIngredient = useCallback((i: number, field: keyof FormIngredient, value: string) => {
    setIngredients((prev) => prev.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing));
  }, []);

  const addStep = useCallback(() => {
    setSteps((prev) => [...prev, { instruction: "", tip: "", time: "" }]);
  }, []);

  const removeStep = useCallback((i: number) => {
    setSteps((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  const updateStep = useCallback((i: number, field: keyof FormStep, value: string) => {
    setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      recipes_name: name.trim(),
      description: description || undefined,
      image_recipe: imageUrl || undefined,
      total_time: totalTime ? Number(totalTime) : undefined,
      number_of_serves: serves ? Number(serves) : undefined,
      calories: calories ? Number(calories) : undefined,
      protein: protein ? Number(protein) : undefined,
      carbs: carbs ? Number(carbs) : undefined,
      fats: fats ? Number(fats) : undefined,
      source_type: initialData?.source_type ?? "MANUAL",
      ingredients: ingredients.filter((i) => i.name.trim()),
      steps: steps.filter((s) => s.instruction.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      {/* Basic Info */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="font-semibold text-white text-lg">Thông tin cơ bản</h2>

        <div>
          <FieldLabel required>Tên công thức</FieldLabel>
          <TextInput
            id="recipe-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Cơm chiên dương châu..."
            required
          />
        </div>

        <div>
          <FieldLabel>Mô tả</FieldLabel>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả ngắn về món ăn..."
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40 transition-all text-sm resize-none"
          />
        </div>

        <div>
          <FieldLabel>URL Ảnh món ăn</FieldLabel>
          <TextInput
            id="recipe-image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            type="url"
          />
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Thời gian nấu (phút)</FieldLabel>
            <TextInput
              id="recipe-time"
              value={totalTime}
              onChange={(e) => setTotalTime(e.target.value)}
              placeholder="30"
              type="number"
              min="1"
            />
          </div>
          <div>
            <FieldLabel>Số khẩu phần</FieldLabel>
            <TextInput
              id="recipe-serves"
              value={serves}
              onChange={(e) => setServes(e.target.value)}
              placeholder="2"
              type="number"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Nutrition */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="font-semibold text-white text-lg">Dinh dưỡng <span className="text-zinc-500 text-sm font-normal">(tùy chọn)</span></h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { id: "calories", label: "Calories (kcal)", value: calories, set: setCalories },
            { id: "protein", label: "Protein (g)", value: protein, set: setProtein },
            { id: "carbs", label: "Carbs (g)", value: carbs, set: setCarbs },
            { id: "fats", label: "Chất béo (g)", value: fats, set: setFats },
          ].map(({ id, label, value, set }) => (
            <div key={id}>
              <FieldLabel>{label}</FieldLabel>
              <TextInput id={id} value={value} onChange={(e) => set(e.target.value)} placeholder="0" type="number" min="0" />
            </div>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold text-white text-lg">Nguyên liệu</h2>
        <div className="space-y-3">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 items-center">
              <GripVertical className="w-4 h-4 text-zinc-700 flex-shrink-0 cursor-grab" />
              <TextInput
                id={`ing-name-${i}`}
                value={ing.name}
                onChange={(e) => updateIngredient(i, "name", e.target.value)}
                placeholder="Tên nguyên liệu"
              />
              <input
                value={ing.quantity}
                onChange={(e) => updateIngredient(i, "quantity", e.target.value)}
                placeholder="SL"
                type="number"
                className="w-16 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 text-sm"
              />
              <input
                value={ing.unit}
                onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                placeholder="Đơn vị"
                className="w-20 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 text-sm"
              />
              <button
                type="button"
                onClick={() => removeIngredient(i)}
                disabled={ingredients.length === 1}
                className="p-2 rounded-lg text-zinc-600 hover:text-red-400 disabled:opacity-30 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addIngredient} className="btn-ghost flex items-center gap-2 text-sm w-full justify-center">
          <Plus className="w-4 h-4" /> Thêm nguyên liệu
        </button>
      </div>

      {/* Steps */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold text-white text-lg">Các bước thực hiện</h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="glass-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <textarea
                  value={step.instruction}
                  onChange={(e) => updateStep(i, "instruction", e.target.value)}
                  placeholder="Mô tả bước thực hiện..."
                  rows={2}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 text-sm resize-none"
                />
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  disabled={steps.length === 1}
                  className="p-2 rounded-lg text-zinc-600 hover:text-red-400 disabled:opacity-30 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3 pl-8">
                <TextInput
                  id={`step-tip-${i}`}
                  value={step.tip}
                  onChange={(e) => updateStep(i, "tip", e.target.value)}
                  placeholder="💡 Mẹo (tùy chọn)"
                />
                <input
                  value={step.time}
                  onChange={(e) => updateStep(i, "time", e.target.value)}
                  placeholder="Phút"
                  type="number"
                  className="w-20 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addStep} className="btn-ghost flex items-center gap-2 text-sm w-full justify-center">
          <Plus className="w-4 h-4" /> Thêm bước
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pb-8">
        <button type="submit" disabled={isLoading || !name.trim()} className="btn-primary flex-1">
          {isLoading ? "Đang lưu..." : "💾 Lưu công thức"}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">
          Hủy
        </button>
      </div>
    </form>
  );
}
