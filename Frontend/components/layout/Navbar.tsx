"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Library,
  Camera,
  ChefHat,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/scan", label: "Scan AI", icon: Camera },
  { href: "/dashboard/recipes", label: "Công thức", icon: BookOpen },
  { href: "/dashboard/cookbooks", label: "Cookbook", icon: Library },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-lg group-hover:bg-brand-400 transition-colors duration-200">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Smart Kitchen
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(href)
                      ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-in Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(href)
                  ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
