import React, { useState, useEffect } from 'react';
import { Development } from '@/data/newDevelopments';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  MapPin, 
  Train, 
  GraduationCap, 
  TrendingUp, 
  TreePine, 
  Building,
  Star,
  Calendar,
  MessageSquare,
  Navigation
} from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import DestinationSelector from '@/components/DestinationSelector';
import { Amenity, AmenityType, amenityLabels } from '@/data/amenities';

interface DevelopmentPopupProps {
  development: Development;
  onClose: () => void;
  onBookViewing: () => void;
  onRequestInfo: () => void;
  onGetDirections?: (stationCoords: { lat: number; lng: number; name: string; line: string }) => void;
  nearbyAmenities?: Record<AmenityType, Amenity[]>;
}

const DevelopmentPopup: React.FC<DevelopmentPopupProps> = ({
  development,
  onClose,
  onBookViewing,
  onRequestInfo,
  onGetDirections,
  nearbyAmenities = {}
}) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [showDestinationSelector, setShowDestinationSelector] = useState(false);

  // Body scroll lock
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const sections = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'area', label: 'Area', icon: MapPin },
    { id: 'location', label: 'Transport', icon: Train },
    { id: 'lifestyle', label: 'Lifestyle', icon: TreePine },
    { id: 'schools', label: 'Schools', icon: GraduationCap },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'area':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Area Overview</h4>
                <p className="text-sm text-muted-foreground">{development.areaOverview}</p>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'location':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Train className="h-4 w-4 text-primary" />
                  <span className="font-medium">Nearest Station</span>
                </div>
                <p className="text-sm">{development.nearestTube.station}</p>
                <p className="text-xs text-muted-foreground">
                  {development.nearestTube.line} • {development.nearestTube.walkTime} mins walk
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">Transport Score</span>
                </div>
                <p className="text-sm text-muted-foreground">{development.transportScore}</p>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'lifestyle':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {development.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary">{amenity}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Healthcare</h4>
                  <p className="text-sm">{development.hospital}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Green Spaces</h4>
                  <p className="text-sm">{development.greenSpaces}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'schools':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Notable Schools</h4>
                <div className="space-y-2">
                  {development.schools.map((school, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="default">School</Badge>
                      <span className="text-sm">{school}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Pricing</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                  {development.prices.studio && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Studio</span>
                      <span className="text-sm font-semibold text-primary">{development.prices.studio}</span>
                    </div>
                  )}
                  {development.prices.oneBed && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">1 Bed</span>
                      <span className="text-sm font-semibold text-primary">{development.prices.oneBed}</span>
                    </div>
                  )}
                  {development.prices.twoBed && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">2 Bed</span>
                      <span className="text-sm font-semibold text-primary">{development.prices.twoBed}</span>
                    </div>
                  )}
                  {development.prices.threeBed && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">3 Bed</span>
                      <span className="text-sm font-semibold text-primary">{development.prices.threeBed}</span>
                    </div>
                  )}
                  {development.prices.fourBed && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">4 Bed</span>
                      <span className="text-sm font-semibold text-primary">{development.prices.fourBed}</span>
                    </div>
                  )}
                  {!development.prices.studio && !development.prices.oneBed && !development.prices.twoBed && !development.prices.threeBed && !development.prices.fourBed && development.prices.range && (
                    <div className="flex justify-between items-center col-span-2">
                      <span className="text-xs text-muted-foreground">Price Range</span>
                      <span className="text-sm font-semibold text-primary">{development.prices.range}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-primary">Zone {development.zone}</p>
                  <p className="text-xs text-muted-foreground">London Zone</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-sm font-bold text-primary">{development.tenure}</p>
                  <p className="text-xs text-muted-foreground">Tenure</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  // Render nearby amenities if any active
  const renderNearbyAmenities = () => {
    const hasAmenities = Object.keys(nearbyAmenities).length > 0;
    if (!hasAmenities) return null;

    return (
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold mb-4">Nearby Amenities</h3>
        <div className="space-y-4">
          {(Object.entries(nearbyAmenities) as [AmenityType, Amenity[]][]).map(([type, amenities]) => (
            <div key={type} className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">{amenityLabels[type]}</h4>
              <div className="space-y-1.5">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center justify-between text-sm py-1.5 px-2 rounded hover:bg-muted/50">
                    <span className="text-foreground">{amenity.name}</span>
                    <span className="text-muted-foreground text-xs">{amenity.walkTime} min walk</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel modal-panel-wide">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{development.name}</h2>
              <p className="text-sm text-muted-foreground">{development.developer}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="border-b border-border p-2 sm:p-4">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "premium" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection(section.id)}
                  className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{section.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content - Carousel + Section Details */}
        <div className="modal-body">
          {/* Image Carousel - Scrolls with content */}
          <div className="mb-3 sm:mb-4">
            <Carousel className="w-full">
              <CarouselContent>
                {development.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={image}
                      alt={`${development.name} - Image ${index + 1}`}
                      className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1 sm:left-2" />
              <CarouselNext className="right-1 sm:right-2" />
            </Carousel>
          </div>

          {/* Section Content */}
          {renderSection()}
          
          {/* Nearby Amenities (shown on Area tab) */}
          {activeSection === 'area' && renderNearbyAmenities()}
        </div>

        {/* Sticky Footer Actions */}
        <div className="modal-footer">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <Button variant="premium" onClick={onBookViewing} className="flex items-center justify-center gap-2 text-sm sm:text-base">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="truncate">Book Viewing</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                const message = encodeURIComponent(
                  `Hi, I'd like more information about ${development.name} in ${development.location}.`
                );
                window.open(`https://wa.me/447776598031?text=${message}`, '_blank');
              }} 
              className="flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="truncate">WhatsApp</span>
            </Button>
            {onGetDirections && (
              <Button 
                variant="secondary" 
                onClick={() => setShowDestinationSelector(true)}
                className="flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Navigation className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="truncate">Directions</span>
              </Button>
            )}
          </div>
        </div>

        {/* Destination Selector */}
        <DestinationSelector
          isOpen={showDestinationSelector}
          onClose={() => setShowDestinationSelector(false)}
          nearestStation={development.nearestTube}
          developmentLocation={development.location}
          onSelectDestination={(station) => {
            onGetDirections?.({
              lat: station.coordinates.lat,
              lng: station.coordinates.lng,
              name: station.name,
              line: station.line
            });
          }}
        />
      </div>
    </div>
  );
};

export default DevelopmentPopup;