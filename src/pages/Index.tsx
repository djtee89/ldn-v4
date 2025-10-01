import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import DeveloperBanner from '@/components/DeveloperBanner';
import FilterBar, { FilterState } from '@/components/FilterBar';
import MapComponent from '@/components/MapComponent';
import DevelopmentPopup from '@/components/DevelopmentPopup';
import BookingModal from '@/components/BookingModal';
import PropertyOfTheWeek from '@/components/PropertyOfTheWeek';
import PropertyCard from '@/components/PropertyCard';
import OffersButton from '@/components/OffersButton';
import LiveChat from '@/components/LiveChat';
import LifestyleFilterBar from '@/components/LifestyleFilterBar';
import ShortlistDrawer from '@/components/ShortlistDrawer';
import { Button } from '@/components/ui/button';
import About from './About';
import PropertyGuide from './PropertyGuide';
import Contact from './Contact';
import { developments, propertyOfTheWeek } from '@/data/newDevelopments';
import { Development } from '@/data/newDevelopments';
import { AmenityType } from '@/data/amenities';
import { useShortlist } from '@/hooks/use-shortlist';
import { useToast } from '@/hooks/use-toast';
import { translations } from '@/i18n/translations';

const Index = () => {
  const [currentView, setCurrentView] = useState<'main' | 'about' | 'guide' | 'contact'>('main');
  const [selectedDevelopment, setSelectedDevelopment] = useState<Development | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [highlightedDeveloper, setHighlightedDeveloper] = useState<string | null>(null);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  
  const { shortlist, toggleShortlist, isInShortlist, removeFromShortlist } = useShortlist();
  const { toast } = useToast();
  const [activeDirections, setActiveDirections] = useState<{ 
    developmentId: string;
    destination: {
      lat: number;
      lng: number;
      name: string;
      line: string;
    };
  } | null>(null);
  const [lifestyleFilters, setLifestyleFilters] = useState<AmenityType[]>([]);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceFrom: '',
    priceTo: '',
    tenure: 'any',
    bedroomsMin: '',
    bedroomsMax: '',
    zones: [],
    walkToStation: 'any',
    amenities: [],
    completedNow: false,
    completionYear: 'any',
    keyword: ''
  });

  // Filter developments based on current filters
  const filteredDevelopments = useMemo(() => {
    return developments.filter(dev => {
      // Price filters - parse from price range
      const priceRange = dev.prices.range || '';
      const priceNumbers = priceRange.match(/\d+/g);
      if (priceNumbers && priceNumbers.length > 0) {
        const minDevPrice = parseInt(priceNumbers[0]) * (priceRange.includes('M') ? 1000000 : 1000);
        const maxDevPrice = priceNumbers.length > 1 
          ? parseInt(priceNumbers[1]) * (priceRange.includes('M') ? 1000000 : 1000)
          : minDevPrice;

        if (filters.priceFrom) {
          const minPrice = parseInt(filters.priceFrom);
          if (maxDevPrice < minPrice) return false;
        }
        if (filters.priceTo) {
          const maxPrice = parseInt(filters.priceTo);
          if (minDevPrice > maxPrice) return false;
        }
      }

      // Tenure filter
      if (filters.tenure !== 'any') {
        const devTenure = dev.tenure?.toLowerCase() || '';
        if (devTenure !== filters.tenure) return false;
      }

      // Bedrooms filter - infer from prices object
      const availableBedrooms: number[] = [];
      if (dev.prices.studio) availableBedrooms.push(0);
      if (dev.prices.oneBed) availableBedrooms.push(1);
      if (dev.prices.twoBed) availableBedrooms.push(2);
      if (dev.prices.threeBed) availableBedrooms.push(3);
      if (dev.prices.fourBed) availableBedrooms.push(4);
      
      if (filters.bedroomsMin && availableBedrooms.length > 0) {
        const minBed = parseInt(filters.bedroomsMin);
        if (Math.max(...availableBedrooms) < minBed) return false;
      }
      if (filters.bedroomsMax && availableBedrooms.length > 0) {
        const maxBed = parseInt(filters.bedroomsMax);
        if (Math.min(...availableBedrooms) > maxBed) return false;
      }

      // Zone filter
      if (filters.zones.length > 0) {
        if (!filters.zones.includes(dev.zone.toString())) return false;
      }

      // Walk to station filter
      if (filters.walkToStation !== 'any') {
        const maxWalk = parseInt(filters.walkToStation);
        if (dev.nearestTube.walkTime > maxWalk) return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const devAmenities = dev.amenities.map(a => a.toLowerCase());
        const hasAllAmenities = filters.amenities.every(amenity =>
          devAmenities.some(devAmenity => devAmenity.includes(amenity.toLowerCase()))
        );
        if (!hasAllAmenities) return false;
      }

      // Note: Completion filters skipped as completionDate is not in data structure

      // Keyword search
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const searchText = `${dev.name} ${dev.developer} ${dev.location} ${dev.amenities.join(' ')}`.toLowerCase();
        if (!searchText.includes(keyword)) return false;
      }

      // Developer filter
      if (highlightedDeveloper && dev.developer !== highlightedDeveloper) {
        return false;
      }

      return true;
    });
  }, [filters, highlightedDeveloper, developments]);

  if (currentView === 'about') {
    return <About onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'guide') {
    return <PropertyGuide onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'contact') {
    return <Contact onBack={() => setCurrentView('main')} />;
  }

  const handleDeveloperClick = (developer: string) => {
    setHighlightedDeveloper(highlightedDeveloper === developer ? null : developer);
  };

  const handlePropertyOfTheWeekClick = () => {
    setSelectedDevelopment(propertyOfTheWeek.development);
  };

  const handleDevelopmentClick = (development: Development, nearbyAmenities?: any) => {
    setSelectedDevelopment({ ...development, nearbyAmenities } as any);
  };

  const handleToggleShortlist = (development: Development) => {
    const added = toggleShortlist(development);
    const t = translations[language as 'en' | 'zh'];
    toast({
      description: added ? t.shortlist.addedToast : t.shortlist.removedToast,
      duration: 2000,
    });
  };

  const handleHeroSearch = (query: string, mode: 'sale' | 'rent') => {
    setFilters(prev => ({
      ...prev,
      keyword: query,
      tenure: mode === 'rent' ? 'leasehold' : prev.tenure
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onAboutClick={() => setCurrentView('about')}
        onBookViewingClick={() => setCurrentView('contact')}
        onGuideClick={() => setCurrentView('guide')}
        onShortlistClick={() => setIsShortlistOpen(true)}
        shortlistCount={shortlist.length}
      />
      <Hero onSearch={handleHeroSearch} />
      <DeveloperBanner 
        onDeveloperClick={handleDeveloperClick}
        highlightedDeveloper={highlightedDeveloper}
      />
      <FilterBar 
        filters={filters} 
        onFiltersChange={setFilters}
        resultsCount={filteredDevelopments.length}
      />
      
      <LifestyleFilterBar 
        selectedTypes={lifestyleFilters}
        onTypesChange={setLifestyleFilters}
      />
      
      {/* Full-screen map */}
      <main className="relative h-[calc(100vh-300px)]">
        <MapComponent 
          developments={filteredDevelopments}
          onDevelopmentClick={handleDevelopmentClick}
          highlightedDeveloper={highlightedDeveloper}
          className="w-full h-full"
          activeDirections={activeDirections}
          onDirectionsClose={() => setActiveDirections(null)}
          lifestyleFilters={lifestyleFilters}
        />
        <OffersButton />
      </main>

      {/* Development Popup */}
      {selectedDevelopment && (
        <DevelopmentPopup
          development={selectedDevelopment}
          onClose={() => setSelectedDevelopment(null)}
          onBookViewing={() => {
            setIsBookingModalOpen(true);
          }}
          onRequestInfo={() => {
            // Handle request info - could open a separate modal
            console.log('Request info for:', selectedDevelopment.name);
          }}
          nearbyAmenities={(selectedDevelopment as any).nearbyAmenities}
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

      {/* Shortlist Drawer */}
      <ShortlistDrawer
        open={isShortlistOpen}
        onClose={() => setIsShortlistOpen(false)}
        shortlist={shortlist}
        onRemove={removeFromShortlist}
        onViewDetails={(dev) => {
          setSelectedDevelopment(dev);
          setIsShortlistOpen(false);
        }}
        onBookViewing={(dev) => {
          setSelectedDevelopment(dev);
          setIsBookingModalOpen(true);
          setIsShortlistOpen(false);
        }}
        language={language}
      />
      
      {/* Live Chat */}
      <LiveChat />
    </div>
  );
};

export default Index;
