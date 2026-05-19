"use client";

import { BookOpen } from "lucide-react";
import { CookbookCard, CookbookCardSkeleton } from "@/frontend/components/cookbook/CookbookCard";
import type { Cookbook } from "@/frontend/hooks/useCookbooks";

interface CookbookListProps {
  cookbooks: Cookbook[];
  isLoading: boolean;
  onEdit: (cookbook: Cookbook) => void;
  onDelete: (cookbook: Cookbook) => void;
}

export function CookbookList({ cookbooks, isLoading, onEdit, onDelete }: CookbookListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <CookbookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (cookbooks.length === 0) {
    return (
      <div className="glass-card p-16 flex flex-col items-center gap-5 text-center">
        <div className="w-20 h-20 rounded-2xl bg-zinc-800 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-zinc-600" />
        </div>
        <div>
          <p className="text-xl font-semibold text-white">Chưa có cookbook nào</p>
          <p className="text-zinc-400 text-sm mt-1">
            Tạo cookbook đầu tiên để tổ chức công thức của bạn!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cookbooks.map((cb) => (
        <CookbookCard
          key={cb.cookbook_id}
          cookbook={cb}
          onEdit={() => onEdit(cb)}
          onDelete={() => onDelete(cb)}
        />
      ))}
    </div>
  );
}
