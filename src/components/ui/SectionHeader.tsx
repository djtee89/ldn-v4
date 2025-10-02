import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold text-foreground tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
