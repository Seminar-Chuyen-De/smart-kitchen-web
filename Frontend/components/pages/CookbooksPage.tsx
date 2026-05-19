"use client";

import { useState, useEffect } from "react";
import { Plus, X, Check } from "lucide-react";
import { useCookbooks } from "@/frontend/hooks/useCookbooks";
import { CookbookList } from "@/frontend/components/cookbook/CookbookList";
import type { Cookbook } from "@/frontend/hooks/useCookbooks";

export function CookbooksPage() {
  const { cookbooks, isLoading, fetchCookbooks, createCookbook, updateCookbook, deleteCookbook } = useCookbooks();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [editTarget, setEditTarget] = useState<Cookbook | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Cookbook | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCookbooks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    await createCookbook(newName.trim());
    setNewName("");
    setShowCreateForm(false);
    setCreating(false);
  };

  const handleEditSave = async () => {
    if (!editTarget || !editName.trim()) return;
    await updateCookbook(editTarget.cookbook_id, editName.trim());
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteCookbook(deleteTarget.cookbook_id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">📚 Cookbook của tôi</h1>
          <p className="text-zinc-400 text-sm mt-1">{cookbooks.length} bộ sưu tập</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Tạo Cookbook
        </button>
      </div>

      {/* Inline Create Form */}
      {showCreateForm && (
        <div className="glass-card p-5 border-brand-500/30 space-y-4">
          <p className="font-medium text-white text-sm">Tạo Cookbook mới</p>
          <div className="flex gap-3">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") { setShowCreateForm(false); setNewName(""); } }}
              placeholder="Tên cookbook... (VD: 🍱 Bữa trưa văn phòng)"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 text-sm"
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Check className="w-4 h-4" />
              {creating ? "Đang tạo..." : "Tạo"}
            </button>
            <button
              onClick={() => { setShowCreateForm(false); setNewName(""); }}
              className="p-2.5 rounded-xl text-zinc-500 hover:text-white bg-zinc-900 border border-zinc-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cookbook Grid */}
      <CookbookList
        cookbooks={cookbooks}
        isLoading={isLoading}
        onEdit={(cb) => { setEditTarget(cb); setEditName(cb.name); }}
        onDelete={(cb) => setDeleteTarget(cb)}
      />

      {/* Edit Name Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setEditTarget(null)} />
          <div className="relative glass-card p-6 max-w-sm w-full space-y-4">
            <h3 className="font-semibold text-white text-lg">Đổi tên Cookbook</h3>
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleEditSave(); if (e.key === "Escape") setEditTarget(null); }}
              placeholder="Tên cookbook..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 text-sm"
            />
            <div className="flex gap-3">
              <button onClick={handleEditSave} className="btn-primary flex-1 text-sm">Lưu</button>
              <button onClick={() => setEditTarget(null)} className="btn-ghost text-sm">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative glass-card p-6 max-w-sm w-full space-y-4">
            <h3 className="font-semibold text-white text-lg">Xóa Cookbook?</h3>
            <p className="text-zinc-400 text-sm">
              Bạn có chắc muốn xóa <span className="text-white font-medium">"{deleteTarget.name}"</span>?
              Các công thức bên trong sẽ không bị xóa.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-colors">
                Xóa
              </button>
              <button onClick={() => setDeleteTarget(null)} className="btn-ghost text-sm">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
