import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, Calendar } from 'lucide-react';
import { Development } from '@/data/newDevelopments';
import { cn } from '@/lib/utils';
import { extractAllPrices } from '@/lib/priceParser';

interface PropertyCardProps {
  development: Development;
  onView: () => void;
  onBookViewing: () => void;
  isInShortlist: boolean;
  onToggleShortlist: () => void;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  development,
  onView,
  onBookViewing,
  isInShortlist,
  onToggleShortlist,
  className
}) => {
  // Get lowest price
  const getLowestPrice = () => {
    const extracted = extractAllPrices(development.prices);
    const prices = [
      extracted.studio,
      extracted.oneBed,
      extracted.twoBed,
      extracted.threeBed,
      extracted.fourBed,
    ].filter(Boolean);
    
    if (prices.length > 0) return `From ${prices[0]}`;
    return extracted.range || 'POA';
  };

  // Get bedroom types
  const getBedroomInfo = () => {
    const extracted = extractAllPrices(development.prices);
    const types = [];
    if (extracted.studio) types.push('Studio');
    if (extracted.oneBed) types.push('1 bed');
    if (extracted.twoBed) types.push('2 bed');
    if (extracted.threeBed) types.push('3 bed');
    if (extracted.fourBed) types.push('4 bed');
    
    if (types.length === 0) return null;
    if (types.length === 1) return types[0];
    return `${types[0]} - ${types[types.length - 1]}`;
  };

  const lowestPrice = getLowestPrice();
  const bedroomInfo = getBedroomInfo();

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:-translate-y-1",
        "shadow-medium hover:shadow-card-hover cursor-pointer group",
        className
      )}
      onClick={onView}
    >
      <CardContent className="p-0">
        {/* Image with overlays */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={development.images[0]}
            alt={`${development.name} - ${development.location}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Status badge - top left */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant="secondary" 
              className="bg-white/90 text-foreground font-semibold text-xs px-2.5 py-1 shadow-soft"
            >
              New
            </Badge>
          </div>
          
          {/* Favourite button - top right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortlist();
            }}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-soft transition-all"
            aria-label={isInShortlist ? "Remove from shortlist" : "Add to shortlist"}
            aria-pressed={isInShortlist}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-colors",
                isInShortlist ? "fill-red-500 stroke-red-500" : "stroke-foreground"
              )}
            />
          </button>
        </div>

        {/* Card body */}
        <div className="p-5 space-y-3">
          {/* Price - hero element */}
          <div className="text-2xl font-bold text-foreground leading-tight">
            {lowestPrice}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-foreground leading-snug line-clamp-1">
              {development.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {development.location}
            </p>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {bedroomInfo && (
              <>
                <span>{bedroomInfo}</span>
                <span>•</span>
              </>
            )}
            <span>Zone {development.zone}</span>
            <span>•</span>
            <span>{development.nearestTube.walkTime} min to {development.nearestTube.station}</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="flex-1"
            >
              <Eye className="h-3.5 w-3.5" />
              Details
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onBookViewing();
              }}
              className="flex-1"
            >
              <Calendar className="h-3.5 w-3.5" />
              Book Viewing
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
