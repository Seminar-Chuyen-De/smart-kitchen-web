"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-brand-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 z-10">
        <span className="text-xl font-bold text-white tracking-tight">
          🍳 Smart Kitchen
        </span>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-ghost text-sm">Đăng nhập</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="btn-primary text-sm">
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-medium mb-2">
          ✨ Powered by Claude Sonnet 4.5 & Google Vision
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight">
          Chụp nguyên liệu,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-orange-300">
            AI lo phần còn lại
          </span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-xl mx-auto">
          Upload ảnh tủ lạnh hoặc nguyên liệu bạn có — Smart Kitchen sẽ tự động
          nhận diện và tạo công thức nấu ăn cá nhân hóa cho bạn.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-primary text-base px-8 py-3">
                Bắt đầu miễn phí →
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard/scan" className="btn-primary text-base px-8 py-3">
              Scan nguyên liệu →
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Feature cards */}
      <section className="relative z-10 mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 max-w-3xl mx-auto w-full">
        {[
          { icon: "📸", title: "Scan thông minh", desc: "Google Vision nhận diện nguyên liệu từ ảnh chụp" },
          { icon: "🤖", title: "AI Generate", desc: "Claude tạo công thức chi tiết, cá nhân hóa khẩu vị" },
          { icon: "📚", title: "Cookbook cá nhân", desc: "Lưu và quản lý công thức yêu thích của bạn" },
        ].map((f) => (
          <div key={f.title} className="glass-card p-5 space-y-2 hover:border-brand-500/40 transition-colors duration-300">
            <div className="text-3xl">{f.icon}</div>
            <h3 className="font-semibold text-white">{f.title}</h3>
            <p className="text-sm text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
