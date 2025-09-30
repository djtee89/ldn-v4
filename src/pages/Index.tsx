import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import DeveloperBanner from '@/components/DeveloperBanner';
import FilterBar, { FilterState } from '@/components/FilterBar';
import MapComponent from '@/components/MapComponent';
import DevelopmentPopup from '@/components/DevelopmentPopup';
import BookingModal from '@/components/BookingModal';
import PropertyOfTheWeek from '@/components/PropertyOfTheWeek';
import LiveChat from '@/components/LiveChat';
import About from './About';
import PropertyGuide from './PropertyGuide';
import Contact from './Contact';
import { developments, propertyOfTheWeek } from '@/data/newDevelopments';
import { Development } from '@/data/newDevelopments';

const Index = () => {
  const [currentView, setCurrentView] = useState<'main' | 'about' | 'guide' | 'contact'>('main');
  const [selectedDevelopment, setSelectedDevelopment] = useState<Development | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [highlightedDeveloper, setHighlightedDeveloper] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    priceFrom: '',
    priceTo: '',
    bedrooms: 'any',
    zone: 'any',
    walkToStation: 'any',
    keyword: ''
  });

  // Filter developments based on current filters
  const filteredDevelopments = useMemo(() => {
    return developments.filter(dev => {
      // Zone filter
      if (filters.zone && filters.zone !== 'any' && dev.zone.toString() !== filters.zone) {
        return false;
      }

      // Walk to station filter (simplified)
      if (filters.walkToStation && filters.walkToStation !== 'any' && dev.nearestTube.walkTime > parseInt(filters.walkToStation)) {
        return false;
      }

      // Keyword search (including amenities)
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const searchText = `${dev.name} ${dev.developer} ${dev.location} ${dev.amenities.join(' ')}`.toLowerCase();
        if (!searchText.includes(keyword)) {
          return false;
        }
      }

      // Developer filter
      if (highlightedDeveloper && dev.developer !== highlightedDeveloper) {
        return false;
      }

      // Price filters (simplified - would need proper price parsing in real app)
      // For now, we'll just show all that match other criteria

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

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onAboutClick={() => setCurrentView('about')}
        onBookViewingClick={() => setCurrentView('contact')}
        onGuideClick={() => setCurrentView('guide')}
      />
      <DeveloperBanner 
        onDeveloperClick={handleDeveloperClick}
        highlightedDeveloper={highlightedDeveloper}
      />
      <FilterBar 
        filters={filters} 
        onFiltersChange={setFilters}
        resultsCount={filteredDevelopments.length}
      />
      
      <main className="container mx-auto px-4 py-6">
        <div className="h-[calc(100vh-400px)] h-[calc(100dvh-400px)] min-h-[500px] relative">
          <MapComponent 
            developments={filteredDevelopments}
            onDevelopmentClick={setSelectedDevelopment}
            highlightedDeveloper={highlightedDeveloper}
            className="w-full h-full"
          />
          <PropertyOfTheWeek onViewClick={handlePropertyOfTheWeekClick} />
        </div>
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
        />
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        developmentName={selectedDevelopment?.name || ''}
      />
      
      {/* Live Chat */}
      <LiveChat />
    </div>
  );
};

export default Index;
