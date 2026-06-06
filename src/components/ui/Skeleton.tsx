import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-skeleton-pulse bg-white/[0.06] rounded-lg',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4',
        variant === 'rectangular' && 'rounded-lg',
        variant === 'card' && 'rounded-xl',
        className,
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl bg-bg-card border border-white/[0.04] p-5 space-y-4">
      <Skeleton variant="text" className="w-1/3 h-4" />
      <Skeleton variant="text" className="w-2/3 h-5" />
      <Skeleton variant="text" className="w-full h-3" />
      <div className="flex gap-3 pt-2">
        <Skeleton variant="rectangular" className="flex-1 h-20" />
        <Skeleton variant="rectangular" className="flex-1 h-20" />
        <Skeleton variant="rectangular" className="flex-1 h-20" />
      </div>
    </div>
  );
}

export function AvatarSkeleton() {
  return <Skeleton variant="circular" className="w-12 h-12" />;
}
