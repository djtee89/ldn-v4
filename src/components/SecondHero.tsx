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
    <section className="w-full py-6 md:py-8 px-4">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        {/* Search Filter Bar - White card */}
        <div className="rounded-2xl bg-card p-4 md:p-5 shadow-medium border border-border">
          <FilterBar 
            filters={filters}
            onFiltersChange={onFiltersChange}
            resultsCount={resultsCount}
            onSearch={onSearch}
          />
        </div>

        {/* Best of London Bar - White card */}
        <div className="rounded-2xl bg-card p-4 md:p-5 shadow-medium border border-border">
          <LifestyleFilterBar
            selectedTypes={lifestyleFilters}
            onTypesChange={onLifestyleFiltersChange}
          />
        </div>
      </div>
    </section>
  );
};

export default SecondHero;
