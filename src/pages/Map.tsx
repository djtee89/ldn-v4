import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import FilterBar, { FilterState } from '@/components/FilterBar';
import LifestyleFilterBar from '@/components/LifestyleFilterBar';
import MapComponent from '@/components/MapComponent';
import DevelopmentPopup from '@/components/DevelopmentPopup';
import BookingModal from '@/components/BookingModal';
import { useDevelopments } from '@/hooks/use-developments';
import { useShortlist } from '@/hooks/use-shortlist';
import { useToast } from '@/hooks/use-toast';
import { AmenityType } from '@/data/amenities';
import { Development } from '@/data/newDevelopments';

const Map = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: developments = [], isLoading } = useDevelopments();
  const [selectedDevelopment, setSelectedDevelopment] = useState<Development | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [lifestyleFilters, setLifestyleFilters] = useState<AmenityType[]>([]);
  const { isInShortlist, toggleShortlist } = useShortlist();
  const { toast } = useToast();
  
  // Initialize filters from URL
  const [filters, setFilters] = useState<FilterState>({
    priceFrom: searchParams.get('priceFrom') || '',
    priceTo: searchParams.get('priceTo') || '',
    tenure: 'any',
    bedroomsMin: searchParams.get('bedroomsMin') || '',
    bedroomsMax: searchParams.get('bedroomsMax') || '',
    zones: searchParams.get('zones')?.split(',') || [],
    walkToStation: 'any',
    amenities: [],
    completedNow: false,
    completionYear: 'any',
    keyword: ''
  });

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

  const handleBookViewing = () => {
    setIsBookingModalOpen(true);
  };

  const handleToggleShortlist = (development: Development) => {
    const isAdded = toggleShortlist(development);
    toast({
      title: isAdded ? "Added to shortlist" : "Removed from shortlist",
      description: isAdded 
        ? `${development.name} has been added to your shortlist` 
        : `${development.name} has been removed from your shortlist`,
    });
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <Header
        onAboutClick={() => navigate('/')}
        onGuideClick={() => navigate('/')}
        onShortlistClick={() => {}}
        shortlistCount={0}
        language={language}
        onLanguageChange={(lang) => setLanguage(lang as 'en' | 'zh')}
      />

      {/* Filter Bar */}
      <div className="bg-white border-b border-border p-4 z-40">
        <div className="max-w-7xl mx-auto space-y-4">
          <FilterBar
            filters={filters}
            onFiltersChange={(newFilters) => {
              setFilters(newFilters);
              // Update URL params
              const params = new URLSearchParams();
              if (newFilters.priceFrom) params.set('priceFrom', newFilters.priceFrom);
              if (newFilters.priceTo) params.set('priceTo', newFilters.priceTo);
              if (newFilters.bedroomsMin) params.set('bedroomsMin', newFilters.bedroomsMin);
              if (newFilters.bedroomsMax) params.set('bedroomsMax', newFilters.bedroomsMax);
              if (newFilters.zones.length > 0) params.set('zones', newFilters.zones.join(','));
              setSearchParams(params);
            }}
            resultsCount={filteredDevelopments.length}
          />
          <LifestyleFilterBar
            selectedTypes={lifestyleFilters}
            onTypesChange={setLifestyleFilters}
          />
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative overflow-hidden h-full w-full">
        <MapComponent
          developments={filteredDevelopments}
          onDevelopmentClick={setSelectedDevelopment}
          highlightedDeveloper={urlFilters.developer || null}
          lifestyleFilters={lifestyleFilters.length > 0 ? lifestyleFilters : (urlFilters.lifestyle || [])}
          activeDirections={null}
        />
      </div>

      {/* Development Popup Modal */}
      {selectedDevelopment && (
        <DevelopmentPopup
          development={selectedDevelopment}
          onClose={() => setSelectedDevelopment(null)}
          onBookViewing={handleBookViewing}
          isInShortlist={isInShortlist(selectedDevelopment.name)}
          onToggleShortlist={() => handleToggleShortlist(selectedDevelopment)}
          language={language}
        />
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        developmentName={selectedDevelopment?.name || ''}
      />
    </div>
  );
};

export default Map;
