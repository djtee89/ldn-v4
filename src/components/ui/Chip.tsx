import React from 'react';
import { cn } from '@/lib/utils';

interface ChipProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export function Chip({ children, className = '', variant = 'default' }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors',
        {
          'border-line bg-white text-ink': variant === 'default',
          'border-primary/20 bg-primary/10 text-primary': variant === 'primary',
          'border-secondary/20 bg-secondary/10 text-secondary-foreground': variant === 'secondary',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
