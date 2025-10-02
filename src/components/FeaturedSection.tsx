import React from 'react';
import PropertyCard from './PropertyCard';
import { Development } from '@/data/newDevelopments';

interface FeaturedSectionProps {
  developments: Development[];
  onDevelopmentClick: (dev: Development) => void;
  onBookViewing: () => void;
  onShortlistToggle: (id: string) => void;
  shortlistedIds: string[];
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  developments,
  onDevelopmentClick,
  onBookViewing,
  onShortlistToggle,
  shortlistedIds
}) => {
  // Show first 6 developments as featured
  const featuredDevelopments = developments.slice(0, 6);

  return (
    <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground font-medium mb-2 uppercase tracking-wide">
          Featured Developments
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">Best of London</h2>
        <p className="text-muted-foreground">
          Handpicked properties from top developers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredDevelopments.map((dev) => (
          <PropertyCard
            key={dev.id}
            development={dev}
            onView={() => onDevelopmentClick(dev)}
            onBookViewing={onBookViewing}
            isInShortlist={shortlistedIds.includes(dev.id)}
            onToggleShortlist={() => onShortlistToggle(dev.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
