import React from 'react';
import FilterBar, { FilterState } from '@/components/FilterBar';

interface HeroProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultsCount: number;
}

const Hero: React.FC<HeroProps> = ({ filters, onFiltersChange, resultsCount }) => {

  return (
    <section className="relative isolate">
      {/* Banner image */}
      <div className="relative overflow-hidden rounded-[24px]">
        <img
          src="/kings-road-park-1.jpeg"
          alt=""
          className="h-[clamp(280px,35vh,400px)] w-full object-cover"
          loading="eager"
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      {/* Content overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl px-4">
          {/* Heading */}
          <div className="max-w-3xl">
            <p className="text-white/85 text-sm font-semibold tracking-wide">
              London Developer Network
            </p>
            <h1 className="mt-2 text-white text-4xl font-bold leading-tight sm:text-5xl">
              Search new-build property across London
            </h1>
            <p className="mt-3 text-white/90 text-lg">
              Off-plan and ready-to-move homes from leading developers.
            </p>
          </div>

          {/* Filter panel */}
          <div className="mt-6 max-w-4xl">
            <FilterBar 
              filters={filters}
              onFiltersChange={onFiltersChange}
              resultsCount={resultsCount}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
