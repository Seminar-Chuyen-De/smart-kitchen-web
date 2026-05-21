"use client";

import { useCallback, useState } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { useScan } from "@/frontend/hooks/useScan";
import { ImageUploader } from "@/frontend/components/ai/ImageUploader";
import { ScanResultCard, ScanResultSkeleton } from "@/frontend/components/ai/ScanResultCard";

export function ScanPage() {
  const { previewUrl, status, result, error, uploadAndScan, reset } = useScan();
  const [isEditingResult, setIsEditingResult] = useState(false);

  const handleFileSelect = useCallback(
    (file: File) => {
      uploadAndScan(file);
    },
    [uploadAndScan]
  );

  const handleReset = useCallback(() => {
    setIsEditingResult(false);
    reset();
  }, [reset]);

  const isLoading = status === "uploading" || status === "scanning";
  const isDone = status === "done" && result != null;

  // Layout logic:
  // - idle/error: single column (uploader centered)
  // - loading/done (preview mode): 2 columns (uploader | result)
  // - done (edit mode): single column (uploader hidden, form full-width)
  const showUploader = !isEditingResult;
  const layoutClass = isEditingResult
    ? "grid-cols-1 max-w-2xl mx-auto w-full"
    : (isLoading || isDone)
      ? "lg:grid-cols-2"
      : "grid-cols-1 max-w-xl mx-auto w-full";

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
            { step: "3", icon: "💾", label: "Chỉnh sửa & lưu vào Cookbook" },
          ].map(({ step, icon, label }) => (
            <div key={step} className="glass-card p-4 text-center space-y-2">
              <span className="text-2xl">{icon}</span>
              <p className="text-xs text-zinc-400">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className={`grid gap-8 ${layoutClass}`}>
        {/* Left: Uploader — hidden when editing */}
        {showUploader && (
          <ImageUploader
            status={status}
            previewUrl={previewUrl || null}
            onFileSelect={handleFileSelect}
            onReset={handleReset}
          />
        )}

        {/* Right: Result / Skeleton */}
        {isLoading && <ScanResultSkeleton />}

        {isDone && (
          <ScanResultCard
            result={result}
            onReset={handleReset}
            onEditingChange={setIsEditingResult}
          />
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
            <button onClick={handleReset} className="btn-ghost flex items-center gap-2 text-sm">
              <RefreshCcw className="w-4 h-4" />
              Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
