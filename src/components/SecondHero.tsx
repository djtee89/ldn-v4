import React from 'react';
import FilterBar, { FilterState } from './FilterBar';
import LifestyleFilterBar from './LifestyleFilterBar';
import { AmenityType } from '@/data/amenities';
import { useNavigate } from 'react-router-dom';

interface SecondHeroProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultsCount: number;
  lifestyleFilters: AmenityType[];
  onLifestyleFiltersChange: (types: AmenityType[]) => void;
}

const SecondHero: React.FC<SecondHeroProps> = ({
  filters,
  onFiltersChange,
  resultsCount,
  lifestyleFilters,
  onLifestyleFiltersChange
}) => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-background py-12 px-4 sm:px-6 mt-8">
      <div className="max-w-6xl mx-auto bg-black rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Search Filters with white theme */}
        <div className="w-full space-y-4">
          <div className="[&_.bg-white]:!bg-white [&_.text-foreground]:!text-black [&_.text-muted-foreground]:!text-gray-600">
            <FilterBar
              filters={filters}
              onFiltersChange={onFiltersChange}
              resultsCount={resultsCount}
              onSearch={() => {
                const params = new URLSearchParams();
                if (filters.priceFrom) params.set('priceFrom', filters.priceFrom);
                if (filters.priceTo) params.set('priceTo', filters.priceTo);
                if (filters.bedroomsMin) params.set('bedroomsMin', filters.bedroomsMin);
                if (filters.bedroomsMax) params.set('bedroomsMax', filters.bedroomsMax);
                if (filters.zones.length > 0) params.set('zones', filters.zones.join(','));
                navigate(`/map?${params.toString()}`);
              }}
            />
          </div>
          <div className="[&_.bg-white]:!bg-white [&_.text-foreground]:!text-black [&_.text-muted-foreground]:!text-gray-600">
            <LifestyleFilterBar
              selectedTypes={lifestyleFilters}
              onTypesChange={(types) => {
                onLifestyleFiltersChange(types);
                if (types.length > 0) {
                  navigate(`/map?lifestyle=${types.join(',')}`);
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondHero;
