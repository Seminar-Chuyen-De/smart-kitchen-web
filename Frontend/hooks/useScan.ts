"use client";

import { useState, useCallback } from "react";

export interface ScanResult {
  recipe: {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    cookTime: number;
    servings: number;
    image_recipe?: string;
  };
  scanLogId: string;
}

export type ScanStatus = "idle" | "uploading" | "scanning" | "done" | "error";

export function useScan() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadAndScan = useCallback(async (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStatus("uploading");
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      setStatus("scanning");

      const res = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error ?? `Scan thất bại (${res.status})`);
      }

      const data: ScanResult = await res.json();
      setResult(data);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra, vui lòng thử lại.");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl("");
    setStatus("idle");
    setResult(null);
    setError(null);
  }, [previewUrl]);

  return {
    imageFile,
    previewUrl,
    status,
    result,
    error,
    uploadAndScan,
    reset,
  };
}
