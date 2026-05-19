import React from 'react';

type BadgeVariant = 'ai' | 'manual' | 'pending' | 'success' | 'error';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

const variantConfig: Record<
  BadgeVariant,
  { style: string; defaultLabel: string }
> = {
  ai: {
    style: 'bg-violet-100 text-violet-700 border border-violet-200',
    defaultLabel: 'AI',
  },
  manual: {
    style: 'bg-blue-100 text-blue-700 border border-blue-200',
    defaultLabel: 'Thủ công',
  },
  pending: {
    style: 'bg-amber-100 text-amber-700 border border-amber-200',
    defaultLabel: 'Đang xử lý',
  },
  success: {
    style: 'bg-green-100 text-green-700 border border-green-200',
    defaultLabel: 'Thành công',
  },
  error: {
    style: 'bg-red-100 text-red-700 border border-red-200',
    defaultLabel: 'Lỗi',
  },
};

const Badge: React.FC<BadgeProps> = ({ variant, label, className = '' }) => {
  const { style, defaultLabel } = variantConfig[variant];

  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        style,
        className,
      ].join(' ')}
    >
      {label ?? defaultLabel}
    </span>
  );
};

export default Badge;
