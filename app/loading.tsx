import Skeleton from '@/frontend/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-md space-y-4 px-6">
        {/* Logo placeholder */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center animate-pulse">
            <span className="text-2xl">🍳</span>
          </div>
        </div>

        {/* Skeleton lines */}
        <Skeleton variant="card" className="bg-zinc-800 h-8 rounded-lg" />
        <div className="space-y-2 pt-2">
          <Skeleton variant="text" className="bg-zinc-800 w-3/4" />
          <Skeleton variant="text" className="bg-zinc-800 w-1/2" />
        </div>

        <p className="text-center text-zinc-500 text-sm pt-4 animate-pulse">
          Đang tải...
        </p>
      </div>
    </div>
  );
}
