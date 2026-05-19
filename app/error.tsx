'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle size={40} className="text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-3">
          Đã xảy ra lỗi!
        </h1>

        {/* Error message */}
        <p className="text-zinc-400 text-sm mb-2 leading-relaxed">
          Ứng dụng gặp sự cố không mong muốn. Bạn có thể thử lại hoặc quay về trang chủ.
        </p>

        {error.digest && (
          <p className="text-zinc-600 text-xs font-mono mb-6">
            Mã lỗi: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <RefreshCw size={16} />
            Thử lại
          </button>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-lg transition-colors border border-zinc-700"
          >
            Về Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
