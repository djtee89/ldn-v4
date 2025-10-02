import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SecondHero from '@/components/SecondHero';
import DeveloperBanner from '@/components/DeveloperBanner';
import BestDealsSection from '@/components/BestDealsSection';
import ThisWeeksOffers from '@/components/ThisWeeksOffers';
import { FilterState } from '@/components/FilterBar';
import DevelopmentPopup from '@/components/DevelopmentPopup';
import BookingModal from '@/components/BookingModal';
import LiveChat from '@/components/LiveChat';
import ShortlistDrawer from '@/components/ShortlistDrawer';
import About from './About';
import PropertyGuide from './PropertyGuide';
import Contact from './Contact';
import { Development } from '@/data/newDevelopments';
import { AmenityType } from '@/data/amenities';
import { useShortlist } from '@/hooks/use-shortlist';
import { useToast } from '@/hooks/use-toast';
import { useDevelopments } from '@/hooks/use-developments';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Index = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'main' | 'about' | 'guide' | 'contact'>('main');
  const [selectedDevelopment, setSelectedDevelopment] = useState<Development | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  
  const { shortlist, toggleShortlist, isInShortlist, removeFromShortlist } = useShortlist();
  const { toast } = useToast();
  const { data: developments = [], isLoading: isDevelopmentsLoading } = useDevelopments();
  
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

  const [lifestyleFilters, setLifestyleFilters] = useState<AmenityType[]>([]);

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

      // Keyword search
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const searchText = `${dev.name} ${dev.developer} ${dev.location} ${dev.amenities.join(' ')}`.toLowerCase();
        if (!searchText.includes(keyword)) return false;
      }

      return true;
    });
  }, [filters, developments]);

  if (currentView === 'about') {
    return <About onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'guide') {
    return <PropertyGuide onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'contact') {
    return <Contact onBack={() => setCurrentView('main')} />;
  }

  const handleDevelopmentClick = (development: Development, nearbyAmenities?: any) => {
    setSelectedDevelopment({ ...development, nearbyAmenities } as any);
  };

  const handleToggleShortlist = (development: Development) => {
    const added = toggleShortlist(development);
    toast({
      description: added ? 'Added to shortlist' : 'Removed from shortlist',
      duration: 2000,
    });
  };

  if (isDevelopmentsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading developments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAboutClick={() => setCurrentView('about')}
        onGuideClick={() => setCurrentView('guide')}
        onShortlistClick={() => setIsShortlistOpen(true)}
        shortlistCount={shortlist.length}
        language={language}
        onLanguageChange={setLanguage}
      />
      
      {/* Hero Section - Just image and title */}
      <Hero />
      
      {/* Filter Section - Black background */}
      <SecondHero 
        filters={filters}
        onFiltersChange={setFilters}
        resultsCount={filteredDevelopments.length}
        lifestyleFilters={lifestyleFilters}
        onLifestyleFiltersChange={setLifestyleFilters}
      />
      
      {/* Developer Slider - White background */}
      <section className="bg-background py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <DeveloperBanner
            onDeveloperClick={(developer) => {
              navigate(`/map?developer=${encodeURIComponent(developer)}`);
            }}
            highlightedDeveloper={null}
          />
        </div>
      </section>
      
      {/* Best Deals Section */}
      <BestDealsSection />

      {/* This Week's Offers */}
      <ThisWeeksOffers />

      {/* Development Popup */}
      {selectedDevelopment && (
        <ErrorBoundary>
          <DevelopmentPopup
            development={selectedDevelopment}
            onClose={() => setSelectedDevelopment(null)}
            onBookViewing={() => {
              setIsBookingModalOpen(true);
            }}
            isInShortlist={isInShortlist(selectedDevelopment.name)}
            onToggleShortlist={() => handleToggleShortlist(selectedDevelopment)}
            language={language}
          />
        </ErrorBoundary>
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
