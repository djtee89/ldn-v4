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
    <section className="relative isolate mb-6">
      {/* Background image */}
      <div className="relative overflow-hidden rounded-[24px]">
        <img 
          src="/oval-village-1.png" 
          alt="London luxury property interior" 
          className="h-[clamp(320px,45vh,550px)] md:h-[clamp(400px,50vh,600px)] w-full object-cover" 
          loading="lazy"
        />
        {/* Gradient overlay for content legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      {/* Content overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center py-6 md:py-8">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl px-4 space-y-3 md:space-y-4">
          {/* Search Filter Bar */}
          <div>
            <FilterBar 
              filters={filters}
              onFiltersChange={onFiltersChange}
              resultsCount={resultsCount}
              onSearch={onSearch}
            />
          </div>

          {/* Best of London Bar */}
          <div>
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
