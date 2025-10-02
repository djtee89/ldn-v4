import React from 'react';
import FilterBar, { FilterState } from '@/components/FilterBar';
import LifestyleFilterBar from '@/components/LifestyleFilterBar';
import { AmenityType } from '@/data/amenities';

interface SecondHeroProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultsCount: number;
  onSearch?: () => void;
  lifestyleFilters: AmenityType[];
  onLifestyleFiltersChange: (types: AmenityType[]) => void;
}

const SecondHero: React.FC<SecondHeroProps> = ({
  filters,
  onFiltersChange,
  resultsCount,
  onSearch,
  lifestyleFilters,
  onLifestyleFiltersChange,
}) => {
  return (
    <section className="relative isolate mb-6 w-full">
      {/* Background image with better overlay */}
      <div className="relative overflow-hidden rounded-hero">
        <img 
          src="/oval-village-1.png" 
          alt="London luxury property interior" 
          className="h-[240px] md:h-[280px] w-full object-cover" 
          loading="lazy"
        />
        {/* Enhanced gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/45" />
      </div>

      {/* Content overlay with glass panels */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center py-6 md:py-8">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl px-4 space-y-3 md:space-y-4">
          {/* Search Filter Bar - Glass panel */}
          <div className="rounded-2xl bg-panel/90 p-3 md:p-4 shadow-lift ring-1 ring-white/15 backdrop-blur-sm">
            <FilterBar 
              filters={filters}
              onFiltersChange={onFiltersChange}
              resultsCount={resultsCount}
              onSearch={onSearch}
            />
          </div>

          {/* Best of London Bar - Glass panel */}
          <div className="rounded-2xl bg-panel/90 p-3 md:p-4 shadow-lift ring-1 ring-white/15 backdrop-blur-sm">
            <LifestyleFilterBar
              selectedTypes={lifestyleFilters}
              onTypesChange={onLifestyleFiltersChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondHero;
