"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  BookOpen,
  Library,
  Camera,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
} from "lucide-react";

// --- Skeleton ---
function StatSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse space-y-3">
      <div className="w-10 h-10 bg-zinc-800 rounded-xl" />
      <div className="h-8 w-16 bg-zinc-800 rounded-lg" />
      <div className="h-4 w-24 bg-zinc-800 rounded" />
    </div>
  );
}

function RecipeCardSkeleton() {
  return (
    <div className="glass-card p-4 animate-pulse space-y-3">
      <div className="h-36 bg-zinc-800 rounded-xl" />
      <div className="h-4 w-3/4 bg-zinc-800 rounded" />
      <div className="h-3 w-1/2 bg-zinc-800 rounded" />
    </div>
  );
}

// --- Quick Action Card ---
function QuickAction({
  href,
  icon: Icon,
  label,
  desc,
  color,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="glass-card p-5 flex items-center gap-4 hover:border-brand-500/40 hover:bg-white/[0.07] transition-all duration-200 group"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} flex-shrink-0`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white group-hover:text-brand-300 transition-colors">{label}</p>
        <p className="text-sm text-zinc-400 truncate">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
    </Link>
  );
}

// --- Stat Card ---
function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  color: string;
}) {
  return (
    <div className="glass-card p-6 space-y-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  );
}

export function DashboardPage() {
  const { user, isLoaded } = useUser();

  // Mock data — replace with real hooks when API is ready
  const stats = { recipes: 12, cookbooks: 3, lastScan: "2 giờ trước" };
  const recentRecipes = [
    { id: 1, name: "Cơm chiên dương châu", time: 20, source: "AI_GENERATED" },
    { id: 2, name: "Canh chua cá lóc", time: 35, source: "MANUAL" },
    { id: 3, name: "Gỏi cuốn tôm thịt", time: 30, source: "AI_GENERATED" },
  ];

  const sourceLabel: Record<string, { label: string; class: string }> = {
    AI_GENERATED: { label: "🤖 AI", class: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" },
    MANUAL: { label: "✏️ Thủ công", class: "bg-sky-500/20 text-sky-300 border border-sky-500/30" },
    IMPORTED: { label: "📥 Import", class: "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30" },
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        {!isLoaded ? (
          <div className="h-9 w-64 bg-zinc-800 rounded-lg animate-pulse" />
        ) : (
          <h1 className="text-3xl font-bold text-white">
            Xin chào, {user?.firstName ?? "bạn"}! 👋
          </h1>
        )}
        <p className="text-zinc-400 mt-1">Hôm nay bạn muốn nấu gì?</p>
      </div>

      {/* Stats */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          Tổng quan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {!isLoaded ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <StatCard icon={BookOpen} value={stats.recipes} label="Công thức đã lưu" color="bg-brand-500" />
              <StatCard icon={Library} value={stats.cookbooks} label="Cookbook" color="bg-violet-600" />
              <StatCard icon={Camera} value={stats.lastScan} label="Lần scan gần nhất" color="bg-sky-600" />
            </>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickAction
            href="/dashboard/scan"
            icon={Camera}
            label="Scan nguyên liệu mới"
            desc="AI tự động tạo công thức từ ảnh"
            color="bg-brand-500"
          />
          <QuickAction
            href="/dashboard/cookbooks"
            icon={Library}
            label="Xem Cookbook"
            desc="Quản lý bộ sưu tập công thức"
            color="bg-violet-600"
          />
          <QuickAction
            href="/dashboard/recipes/new"
            icon={Plus}
            label="Tạo recipe thủ công"
            desc="Nhập công thức của riêng bạn"
            color="bg-sky-600"
          />
        </div>
      </section>

      {/* Recent Recipes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
            Công thức gần đây
          </h2>
          <Link
            href="/dashboard/recipes"
            className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
          >
            Xem tất cả <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {!isLoaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <RecipeCardSkeleton />
            <RecipeCardSkeleton />
            <RecipeCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentRecipes.map((recipe) => {
              const badge = sourceLabel[recipe.source] ?? sourceLabel.MANUAL;
              return (
                <Link
                  key={recipe.id}
                  href={`/dashboard/recipes/${recipe.id}`}
                  className="glass-card p-5 hover:border-brand-500/40 hover:bg-white/[0.07] transition-all duration-200 group block"
                >
                  {/* Image placeholder */}
                  <div className="h-32 bg-gradient-to-br from-brand-900/40 to-zinc-800 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-4xl">🍽️</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${badge.class}`}>
                        {badge.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-500">
                        <Clock className="w-3 h-3" />
                        {recipe.time} phút
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Add new card */}
            <Link
              href="/dashboard/recipes/new"
              className="glass-card p-5 border-dashed hover:border-brand-500/40 hover:bg-white/[0.04] transition-all duration-200 group flex flex-col items-center justify-center gap-3 min-h-[180px]"
            >
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-700 group-hover:border-brand-500 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-zinc-600 group-hover:text-brand-400 transition-colors" />
              </div>
              <p className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
                Tạo công thức mới
              </p>
            </Link>
          </div>
        )}
      </section>

      {/* Trending tip */}
      <div className="glass-card p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <p className="font-medium text-white">Mẹo hôm nay 💡</p>
          <p className="text-sm text-zinc-400 mt-1">
            Chụp ảnh tủ lạnh của bạn để AI nhận diện nguyên liệu và gợi ý công thức phù hợp nhất!
          </p>
        </div>
      </div>
    </div>
  );
}
