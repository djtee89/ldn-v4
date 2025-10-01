import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PropertyCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden shadow-medium">
      <CardContent className="p-0">
        {/* Image skeleton */}
        <Skeleton className="aspect-video w-full" />

        {/* Card body */}
        <div className="p-5 space-y-3">
          {/* Price skeleton */}
          <Skeleton className="h-8 w-32" />

          {/* Title skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Meta skeleton */}
          <Skeleton className="h-4 w-full" />

          {/* Buttons skeleton */}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCardSkeleton;
