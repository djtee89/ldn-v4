import React from 'react';
import DeveloperBanner from './DeveloperBanner';
import FilterBar, { FilterState } from './FilterBar';
import LifestyleFilterBar from './LifestyleFilterBar';
import { AmenityType } from '@/data/amenities';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultsCount: number;
  lifestyleFilters: AmenityType[];
  onLifestyleFiltersChange: (types: AmenityType[]) => void;
}

const Hero: React.FC<HeroProps> = ({
  filters,
  onFiltersChange,
  resultsCount,
  lifestyleFilters,
  onLifestyleFiltersChange
}) => {
  const navigate = useNavigate();
  return (
    <section className="relative isolate overflow-hidden rounded-3xl mx-4 mt-4 sm:mx-6 sm:mt-6">
      {/* Hero image */}
      <div className="relative overflow-hidden">
        <img 
          src="/hero-london-1920.webp" 
          alt="London skyline with The Shard at sunset" 
          className="h-[clamp(400px,50vh,500px)] w-full object-cover" 
          loading="eager"
          fetchPriority="high"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Centered content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-lg">
              Search new-build property across London
            </h1>
            <p className="mt-3 sm:mt-4 text-white/90 text-base sm:text-lg md:text-xl font-light drop-shadow">
              Off-plan and ready-to-move homes from leading developers.
            </p>
          </div>

          {/* Developer Banner */}
          <div className="w-full">
            <DeveloperBanner
              onDeveloperClick={(developer) => {
                navigate(`/map?developer=${encodeURIComponent(developer)}`);
              }}
              highlightedDeveloper={null}
            />
          </div>

          {/* Search Filters */}
          <div className="w-full space-y-4">
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

export default Hero;