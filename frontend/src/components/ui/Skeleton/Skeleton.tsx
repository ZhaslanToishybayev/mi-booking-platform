import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseStyles = 'bg-dark-700'
  
  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-dark-700 via-dark-600 to-dark-700 bg-[length:200%_100%]',
    none: '',
  }

  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  }

  const style: React.CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  }

  return (
    <div
      className={`${baseStyles} ${animationStyles[animation]} ${variantStyles[variant]} ${className}`}
      style={style}
      data-testid="skeleton"
      aria-hidden="true"
    />
  )
}

// Predefined skeleton components for common use cases
export const EventCardSkeleton: React.FC = () => (
  <div className="glass-card overflow-hidden" data-testid="event-card-skeleton">
    {/* Image placeholder */}
    <Skeleton variant="rectangular" className="aspect-video w-full rounded-none" />
    
    <div className="p-6 space-y-4">
      {/* Title */}
      <Skeleton variant="text" className="h-6 w-3/4" />
      
      {/* Date badge */}
      <div className="flex items-center gap-2">
        <Skeleton variant="rectangular" className="h-5 w-5" />
        <Skeleton variant="text" className="h-4 w-1/2" />
      </div>
      
      {/* Location */}
      <div className="flex items-center gap-2">
        <Skeleton variant="rectangular" className="h-5 w-5" />
        <Skeleton variant="text" className="h-4 w-2/3" />
      </div>
      
      {/* Price and button */}
      <div className="flex items-center justify-between pt-4 border-t border-glass-border">
        <div>
          <Skeleton variant="text" className="h-3 w-8 mb-1" />
          <Skeleton variant="text" className="h-6 w-24" />
        </div>
        <Skeleton variant="rectangular" className="h-10 w-28" />
      </div>
    </div>
  </div>
)

export const EventCardSkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="skeleton-grid">
    {Array.from({ length: count }).map((_, index) => (
      <EventCardSkeleton key={index} />
    ))}
  </div>
)

export const BookingCardSkeleton: React.FC = () => (
  <div className="glass-card p-6" data-testid="booking-card-skeleton">
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
      <div className="flex items-start gap-4 flex-1">
        {/* Thumbnail */}
        <Skeleton variant="rectangular" className="hidden sm:block w-20 h-20" />
        
        <div className="space-y-3 flex-1">
          <Skeleton variant="text" className="h-6 w-3/4" />
          <div className="flex gap-4">
            <Skeleton variant="text" className="h-4 w-32" />
            <Skeleton variant="text" className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton variant="rectangular" className="h-6 w-24 rounded-full" />
            <Skeleton variant="text" className="h-6 w-20" />
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Skeleton variant="rectangular" className="h-10 w-16" />
        <Skeleton variant="rectangular" className="h-10 w-24" />
      </div>
    </div>
  </div>
)
