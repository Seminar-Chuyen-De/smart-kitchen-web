"use client";

import Link from "next/link";
import { Edit2, Trash2, BookOpen, CalendarDays } from "lucide-react";
import type { Cookbook } from "@/frontend/hooks/useCookbooks";

interface CookbookCardProps {
  cookbook: Cookbook;
  onEdit: () => void;
  onDelete: () => void;
}

export function CookbookCardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4 animate-pulse">
      <div className="h-16 w-16 bg-zinc-800 rounded-2xl" />
      <div className="h-5 w-3/4 bg-zinc-800 rounded" />
      <div className="h-4 w-1/2 bg-zinc-800 rounded" />
      <div className="h-4 w-1/3 bg-zinc-800 rounded" />
    </div>
  );
}

export function CookbookCard({ cookbook, onEdit, onDelete }: CookbookCardProps) {
  const recipeCount = cookbook._count?.recipes ?? cookbook.recipes?.length ?? 0;
  const formattedDate = new Date(cookbook.created_at).toLocaleDateString("vi-VN", {
    year: "numeric", month: "short", day: "numeric",
  });

  // Preview mosaic from first 4 recipe images (if any)
  const previewImages = cookbook.recipes
    ?.filter((r) => r.image_recipe)
    .slice(0, 4)
    .map((r) => r.image_recipe as string) ?? [];

  return (
    <div className="glass-card overflow-hidden hover:border-brand-500/40 hover:bg-white/[0.06] transition-all duration-200 group relative">
      {/* Hover actions */}
      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          onClick={onEdit}
          className="w-8 h-8 rounded-lg bg-zinc-900/90 backdrop-blur border border-zinc-700 flex items-center justify-center hover:text-brand-300 text-zinc-400 transition-colors"
          title="Đổi tên"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded-lg bg-zinc-900/90 backdrop-blur border border-zinc-700 flex items-center justify-center hover:text-red-400 text-zinc-400 transition-colors"
          title="Xóa cookbook"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <Link href={`/dashboard/cookbooks/${cookbook.cookbook_id}`} className="block p-6 space-y-4">
        {/* Icon / Mosaic */}
        {previewImages.length >= 4 ? (
          <div className="grid grid-cols-2 gap-1 w-16 h-16 rounded-2xl overflow-hidden">
            {previewImages.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="w-full h-full object-cover" />
            ))}
          </div>
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/30 to-brand-600/30 border border-violet-500/20 flex items-center justify-center group-hover:border-violet-500/40 transition-colors">
            <BookOpen className="w-8 h-8 text-violet-400" />
          </div>
        )}

        {/* Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-white text-lg leading-tight group-hover:text-brand-300 transition-colors">
            {cookbook.name}
          </h3>
          <p className="text-zinc-400 text-sm">
            {recipeCount} công thức
          </p>
          <p className="flex items-center gap-1.5 text-xs text-zinc-600">
            <CalendarDays className="w-3 h-3" />
            {formattedDate}
          </p>
        </div>
      </Link>
    </div>
  );
}
