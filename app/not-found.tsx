import Link from 'next/link';
import { UtensilsCrossed } from 'lucide-react';

export const metadata = {
  title: '404 — Trang không tồn tại | Smart Kitchen VN',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <UtensilsCrossed size={40} className="text-orange-400" />
          </div>
        </div>

        {/* 404 */}
        <p className="text-7xl font-black text-orange-500 mb-2 tracking-tight">404</p>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-3">
          Trang không tồn tại
        </h1>

        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          Có vẻ như trang bạn đang tìm kiếm đã bị xóa hoặc chưa bao giờ tồn tại.
          Hãy quay về bếp nào! 🍽️
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            Về Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-lg transition-colors border border-zinc-700"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
