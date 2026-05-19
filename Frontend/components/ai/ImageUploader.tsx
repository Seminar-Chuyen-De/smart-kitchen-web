"use client";

import { useCallback, useRef } from "react";
import { Camera, Upload, ImageIcon, RefreshCcw } from "lucide-react";
import type { ScanStatus } from "@/frontend/hooks/useScan";

interface ImageUploaderProps {
  status: ScanStatus;
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onReset: () => void;
}

const statusMessages: Partial<Record<ScanStatus, string>> = {
  uploading: "Đang tải ảnh lên...",
  scanning: "AI đang nhận diện nguyên liệu...",
};

export function ImageUploader({
  status,
  previewUrl,
  onFileSelect,
  onReset,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const isLoading = status === "uploading" || status === "scanning";

  // Preview state
  if (previewUrl) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview nguyên liệu"
            className="w-full h-64 object-cover"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              {/* Spinner */}
              <div className="w-12 h-12 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-white font-medium text-sm animate-pulse">
                {statusMessages[status]}
              </p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {isLoading && (
          <div className="h-1 bg-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-orange-400 rounded-full animate-pulse"
              style={{ width: status === "uploading" ? "40%" : "80%" }}
            />
          </div>
        )}

        {/* Actions */}
        {!isLoading && (
          <div className="p-4">
            <button
              onClick={onReset}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
            >
              <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              Chọn ảnh khác
            </button>
          </div>
        )}
      </div>
    );
  }

  // Drop zone
  return (
    <div
      className="glass-card border-2 border-dashed border-zinc-700 hover:border-brand-500/60 transition-colors duration-200 cursor-pointer group"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <div className="p-12 flex flex-col items-center gap-5 text-center">
        <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center group-hover:bg-brand-500/20 group-hover:border-brand-500/40 transition-all duration-200">
          <Camera className="w-10 h-10 text-brand-400 group-hover:scale-110 transition-transform duration-200" />
        </div>
        <div>
          <p className="text-white font-semibold text-lg">Chụp hoặc tải ảnh lên</p>
          <p className="text-zinc-400 text-sm mt-1">
            Kéo & thả ảnh vào đây, hoặc click để chọn
          </p>
          <p className="text-zinc-600 text-xs mt-2">Hỗ trợ: JPG, PNG, WEBP</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-primary flex items-center gap-2 text-sm" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
            <Upload className="w-4 h-4" />
            Chọn ảnh
          </button>
          <span className="text-zinc-600 text-sm">hoặc kéo thả</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <ImageIcon className="w-3 h-3" />
          AI sẽ nhận diện nguyên liệu từ ảnh
        </div>
      </div>
    </div>
  );
}
