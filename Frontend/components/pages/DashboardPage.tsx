"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Library,
  Clock,
  Camera,
  ArrowRight,
  TrendingUp,
  Plus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useDashboard, formatRelativeTime } from "@/frontend/hooks/useDashboard";

// ─── Mẹo nấu ăn (hardcode, random mỗi lần load) ────────────────────────────

const KITCHEN_TIPS = [
  "Chụp ảnh tủ lạnh để AI gợi ý món ăn từ nguyên liệu có sẵn! 📸",
  "Luôn sơ chế và chia nhỏ nguyên liệu trước khi nấu để tiết kiệm thời gian. ⚡",
  "Thêm một ít muối vào nước sôi khi luộc mì để mì không bị dính và thêm hương vị. 🍜",
  "Bảo quản rau xanh lâu hơn bằng cách cuộn trong khăn giấy ẩm trước khi cho vào tủ lạnh. 🥬",
  "Để tỏi dễ bóc vỏ hơn, hãy đập nhẹ bằng mặt dao rồi ngâm nước lạnh 30 giây. 🧄",
  "Nêm gia vị từng chút một và nếm thường xuyên — dễ thêm nhưng khó bỏ! 🧂",
  "Lưu công thức yêu thích vào Cookbook để không bao giờ bị mất. 📖",
  "Thịt sẽ mềm và ngon hơn nếu để ở nhiệt độ phòng 15 phút trước khi nấu. 🥩",
  "Dùng AI Scan để nhận diện nguyên liệu nhanh — không cần nhập tay từng cái! 🤖",
  "Đặt tên công thức mô tả rõ ràng giúp tìm kiếm dễ dàng hơn về sau. 🔍",
];

// ─── Skeletons ────────────────────────────────────────────────────────────────

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

// ─── Sub-components ──────────────────────────────────────────────────────────

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

// ─── Source badge config ──────────────────────────────────────────────────────

const SOURCE_LABEL: Record<string, { label: string; cls: string }> = {
  AI_GENERATED: {
    label: "🤖 AI",
    cls: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  },
  MANUAL: {
    label: "✏️ Thủ công",
    cls: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  },
  IMPORTED: {
    label: "📥 Import",
    cls: "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30",
  },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user, isLoaded } = useUser();

  // ── Rotating tip: index 0 on server (hydration-safe), randomised + auto-cycle on client ──
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Randomise initial tip on client only (avoids SSR mismatch)
    setTipIndex(Math.floor(Math.random() * KITCHEN_TIPS.length));

    const cycle = () => {
      // Slide out
      setTipVisible(false);
      setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % KITCHEN_TIPS.length);
        // Slide in
        setTipVisible(true);
      }, 400); // matches transition duration
    };

    intervalRef.current = setInterval(cycle, 10_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Real data from backend
  const { stats, recentRecipes, isLoading: dashLoading, error, refresh } = useDashboard();

  const showSkeleton = !isLoaded || dashLoading;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
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

        {/* Refresh button */}
        {!dashLoading && (
          <button
            onClick={refresh}
            title="Làm mới dữ liệu"
            className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="glass-card p-4 flex items-center gap-3 border-red-500/30 bg-red-500/10">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
          <button
            onClick={refresh}
            className="ml-auto text-xs text-red-400 hover:text-red-200 underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Stats */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          Tổng quan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {showSkeleton ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <StatCard
                icon={BookOpen}
                value={stats.totalRecipes}
                label="Công thức đã lưu"
                color="bg-brand-500"
              />
              <StatCard
                icon={Library}
                value={stats.totalCookbooks}
                label="Cookbook"
                color="bg-violet-600"
              />
              <StatCard
                icon={Camera}
                value={formatRelativeTime(stats.lastRecipeCreatedAt)}
                label="Công thức gần nhất"
                color="bg-sky-600"
              />
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

        {showSkeleton ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <RecipeCardSkeleton />
            <RecipeCardSkeleton />
            <RecipeCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentRecipes.map((recipe) => {
              const badge =
                SOURCE_LABEL[recipe.source_type ?? "MANUAL"] ??
                SOURCE_LABEL.MANUAL;
              return (
                <Link
                  key={recipe.recipe_id}
                  href={`/dashboard/recipes/${recipe.recipe_id}`}
                  className="glass-card p-5 hover:border-brand-500/40 hover:bg-white/[0.07] transition-all duration-200 group block"
                >
                  {/* Recipe image / placeholder */}
                  <div className="h-32 bg-gradient-to-br from-brand-900/40 to-zinc-800 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    {recipe.image_recipe ? (
                      <Image
                        src={recipe.image_recipe}
                        alt={recipe.recipes_name}
                        width={320}
                        height={128}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-4xl">🍽️</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                      {recipe.recipes_name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${badge.cls}`}>
                        {badge.label}
                      </span>
                      {recipe.total_time != null && (
                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                          <Clock className="w-3 h-3" />
                          {recipe.total_time} phút
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Empty state khi không có recipe */}
            {recentRecipes.length === 0 && (
              <div className="glass-card p-5 col-span-full flex flex-col items-center justify-center gap-2 py-12 text-center">
                <span className="text-4xl">🍳</span>
                <p className="text-zinc-400 text-sm">Chưa có công thức nào. Hãy tạo ngay!</p>
              </div>
            )}

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

      {/* Mẹo hôm nay — auto-rotating every 10s with slide animation */}
      <div className="glass-card p-5 flex items-start gap-4 overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <TrendingUp className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium text-white">Mẹo hôm nay 💡</p>
            <span className="text-xs text-zinc-600">
              {tipIndex + 1} / {KITCHEN_TIPS.length}
            </span>
          </div>
          {/* Slide-from-top transition */}
          <p
            className="text-sm text-zinc-400 mt-1 transition-all duration-400 ease-in-out"
            style={{
              opacity: tipVisible ? 1 : 0,
              transform: tipVisible ? "translateY(0)" : "translateY(-12px)",
            }}
          >
            {KITCHEN_TIPS[tipIndex]}
          </p>
          {/* Progress dots */}
          <div className="flex gap-1 mt-3">
            {KITCHEN_TIPS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setTipVisible(false);
                  setTimeout(() => { setTipIndex(i); setTipVisible(true); }, 400);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === tipIndex
                    ? "w-4 bg-amber-400"
                    : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                }`}
                aria-label={`Mẹo ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
