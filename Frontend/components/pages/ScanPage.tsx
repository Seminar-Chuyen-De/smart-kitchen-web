"use client";

import { useCallback } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { useScan } from "@/frontend/hooks/useScan";
import { ImageUploader } from "@/frontend/components/ai/ImageUploader";
import { ScanResultCard, ScanResultSkeleton } from "@/frontend/components/ai/ScanResultCard";

export function ScanPage() {
  const { previewUrl, status, result, error, uploadAndScan, reset } = useScan();

  const handleFileSelect = useCallback(
    (file: File) => {
      uploadAndScan(file);
    },
    [uploadAndScan]
  );

  const isLoading = status === "uploading" || status === "scanning";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">🔍 Scan Nguyên Liệu</h1>
        <p className="text-zinc-400 mt-1">
          Upload ảnh nguyên liệu — AI sẽ nhận diện và tạo công thức ngay cho bạn.
        </p>
      </div>

      {/* How it works */}
      {status === "idle" && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { step: "1", icon: "📸", label: "Upload ảnh nguyên liệu" },
            { step: "2", icon: "🤖", label: "AI nhận diện & tạo công thức" },
            { step: "3", icon: "💾", label: "Lưu vào Cookbook của bạn" },
          ].map(({ step, icon, label }) => (
            <div key={step} className="glass-card p-4 text-center space-y-2">
              <span className="text-2xl">{icon}</span>
              <p className="text-xs text-zinc-400">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className={`grid gap-8 ${(isLoading || status === "done") ? "lg:grid-cols-2" : "grid-cols-1 max-w-xl mx-auto w-full"}`}>
        {/* Left: Uploader */}
        <ImageUploader
          status={status}
          previewUrl={previewUrl || null}
          onFileSelect={handleFileSelect}
          onReset={reset}
        />

        {/* Right: Result / Skeleton */}
        {isLoading && <ScanResultSkeleton />}

        {status === "done" && result && (
          <ScanResultCard result={result} onReset={reset} />
        )}

        {/* Error */}
        {status === "error" && (
          <div className="glass-card p-6 border-red-500/30 flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Scan thất bại</p>
              <p className="text-sm text-zinc-400 mt-1">{error}</p>
            </div>
            <button onClick={reset} className="btn-ghost flex items-center gap-2 text-sm">
              <RefreshCcw className="w-4 h-4" />
              Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
