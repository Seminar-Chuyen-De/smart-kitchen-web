'use client';

import React from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast, type Toast, type ToastType } from '@/Frontend/contexts/ToastContext';

const toastConfig: Record<
  ToastType,
  { icon: React.ReactNode; bar: string; bg: string; text: string }
> = {
  success: {
    icon: <CheckCircle2 size={18} />,
    bar: 'bg-green-500',
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-800',
  },
  error: {
    icon: <XCircle size={18} />,
    bar: 'bg-red-500',
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    bar: 'bg-amber-500',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
  },
  info: {
    icon: <Info size={18} />,
    bar: 'bg-blue-500',
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
  },
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({
  toast,
  onRemove,
}) => {
  const { icon, bar, bg, text } = toastConfig[toast.type];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        'flex items-start gap-3 w-80 rounded-xl border shadow-lg overflow-hidden',
        'animate-in slide-in-from-right-5 fade-in duration-300',
        bg,
      ].join(' ')}
    >
      {/* Left color bar */}
      <div className={['w-1 self-stretch flex-shrink-0', bar].join(' ')} />

      <div className={['flex items-start gap-2.5 py-3 pr-3 flex-1', text].join(' ')}>
        <span className="mt-0.5 flex-shrink-0">{icon}</span>
        <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Đóng thông báo"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Thông báo"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
