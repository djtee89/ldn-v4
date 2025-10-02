import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MapComponent from '@/components/MapComponent';
import { useDevelopments } from '@/hooks/use-developments';
import { FilterState } from '@/components/FilterBar';
import { AmenityType } from '@/data/amenities';
import { Development } from '@/data/newDevelopments';

const Map = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: developments = [], isLoading } = useDevelopments();
  const [selectedDevelopment, setSelectedDevelopment] = useState<Development | null>(null);

  // Parse URL parameters to create filters
  const urlFilters = useMemo(() => {
    const filters: Partial<FilterState> & { developer?: string; lifestyle?: AmenityType[] } = {};
    
    if (searchParams.get('developer')) {
      filters.developer = searchParams.get('developer')!;
    }
    if (searchParams.get('priceFrom')) {
      filters.priceFrom = searchParams.get('priceFrom')!;
    }
    if (searchParams.get('priceTo')) {
      filters.priceTo = searchParams.get('priceTo')!;
    }
    if (searchParams.get('bedroomsMin')) {
      filters.bedroomsMin = searchParams.get('bedroomsMin')!;
    }
    if (searchParams.get('bedroomsMax')) {
      filters.bedroomsMax = searchParams.get('bedroomsMax')!;
    }
    if (searchParams.get('zones')) {
      filters.zones = searchParams.get('zones')!.split(',');
    }
    if (searchParams.get('lifestyle')) {
      filters.lifestyle = searchParams.get('lifestyle')!.split(',') as AmenityType[];
    }

    return filters;
  }, [searchParams]);

  // Filter developments based on URL parameters
  const filteredDevelopments = useMemo(() => {
    return developments.filter(dev => {
      // Developer filter
      if (urlFilters.developer) {
        if (!dev.developer?.toLowerCase().includes(urlFilters.developer.toLowerCase())) {
          return false;
        }
      }

      // Price filters
      if (urlFilters.priceFrom || urlFilters.priceTo) {
        const priceRange = dev.prices.range || '';
        const priceNumbers = priceRange.match(/\d+/g);
        if (priceNumbers && priceNumbers.length > 0) {
          const minDevPrice = parseInt(priceNumbers[0]) * (priceRange.includes('M') ? 1000000 : 1000);
          const maxDevPrice = priceNumbers.length > 1 
            ? parseInt(priceNumbers[1]) * (priceRange.includes('M') ? 1000000 : 1000)
            : minDevPrice;

          if (urlFilters.priceFrom) {
            const minPrice = parseInt(urlFilters.priceFrom);
            if (maxDevPrice < minPrice) return false;
          }
          if (urlFilters.priceTo) {
            const maxPrice = parseInt(urlFilters.priceTo);
            if (minDevPrice > maxPrice) return false;
          }
        }
      }

      // Bedrooms filter
      if (urlFilters.bedroomsMin || urlFilters.bedroomsMax) {
        const availableBedrooms: number[] = [];
        if (dev.prices.studio) availableBedrooms.push(0);
        if (dev.prices.oneBed) availableBedrooms.push(1);
        if (dev.prices.twoBed) availableBedrooms.push(2);
        if (dev.prices.threeBed) availableBedrooms.push(3);
        if (dev.prices.fourBed) availableBedrooms.push(4);
        
        if (urlFilters.bedroomsMin && availableBedrooms.length > 0) {
          const minBed = parseInt(urlFilters.bedroomsMin);
          if (Math.max(...availableBedrooms) < minBed) return false;
        }
        if (urlFilters.bedroomsMax && availableBedrooms.length > 0) {
          const maxBed = parseInt(urlFilters.bedroomsMax);
          if (Math.min(...availableBedrooms) > maxBed) return false;
        }
      }

      // Zone filter
      if (urlFilters.zones && urlFilters.zones.length > 0) {
        if (!urlFilters.zones.includes(dev.zone.toString())) return false;
      }

      return true;
    });
  }, [developments, urlFilters]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          onClick={() => navigate('/')}
          variant="default"
          size="sm"
          className="shadow-lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      {/* Map */}
      <MapComponent
        developments={filteredDevelopments}
        onDevelopmentClick={setSelectedDevelopment}
        highlightedDeveloper={urlFilters.developer || null}
        lifestyleFilters={urlFilters.lifestyle || []}
        activeDirections={null}
      />
    </div>
  );
};

export default Map;
