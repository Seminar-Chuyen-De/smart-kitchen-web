import React from 'react';

type SkeletonVariant = 'text' | 'card' | 'avatar';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

const variantDefaults: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded',
  card: 'h-48 w-full rounded-xl',
  avatar: 'h-10 w-10 rounded-full flex-shrink-0',
};

const SkeletonItem: React.FC<Omit<SkeletonProps, 'count'>> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const base = variantDefaults[variant];

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={['animate-pulse bg-gray-200 rounded', base, className].join(' ')}
      style={style}
    />
  );
};

const Skeleton: React.FC<SkeletonProps> = ({ count = 1, ...props }) => {
  if (count === 1) return <SkeletonItem {...props} />;

  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} {...props} />
      ))}
    </div>
  );
};

export default Skeleton;
