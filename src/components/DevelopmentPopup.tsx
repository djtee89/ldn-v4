import React, { useState } from 'react';
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
  MessageSquare
} from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface DevelopmentPopupProps {
  development: Development;
  onClose: () => void;
  onBookViewing: () => void;
  onRequestInfo: () => void;
}

const DevelopmentPopup: React.FC<DevelopmentPopupProps> = ({
  development,
  onClose,
  onBookViewing,
  onRequestInfo
}) => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'location', label: 'Location & Transport', icon: MapPin },
    { id: 'investment', label: 'Investment Profile', icon: TrendingUp },
    { id: 'lifestyle', label: 'Lifestyle & Amenities', icon: TreePine },
    { id: 'schools', label: 'Schools', icon: GraduationCap },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'location':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span className="font-medium">Schools</span>
                  </div>
                  <div className="space-y-1">
                    {development.schools.slice(0, 2).map((school, index) => (
                      <p key={index} className="text-sm">{school}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'investment':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">Zone {development.zone}</p>
                  <p className="text-xs text-muted-foreground">London Zone</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-bold text-primary">{development.transportScore}</p>
                  <p className="text-xs text-muted-foreground">Transport Score</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-bold text-primary">{development.tenure}</p>
                  <p className="text-xs text-muted-foreground">Tenure</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Price Range</h4>
                <p className="text-lg font-semibold">{development.prices.range || development.prices.oneBed || 'POA'}</p>
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
                <h4 className="font-medium mb-2">Area Overview</h4>
                <p className="text-sm text-muted-foreground">{development.areaOverview}</p>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xl font-bold text-primary">{development.prices.range || development.prices.oneBed || 'POA'}</p>
                  <p className="text-xs text-muted-foreground">Starting From</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xl font-bold text-primary">Zone {development.zone}</p>
                  <p className="text-xs text-muted-foreground">London Zone</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-premium max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{development.name}</h2>
            <p className="text-sm text-muted-foreground">{development.developer}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Carousel */}
          <div className="lg:w-1/2 p-4">
            <Carousel className="w-full">
              <CarouselContent>
                {development.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={image}
                      alt={`${development.name} - Image ${index + 1}`}
                      className="w-full h-64 lg:h-80 object-cover rounded-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Content */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Section Navigation */}
            <div className="border-b border-border p-4">
              <div className="flex flex-wrap gap-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "premium" : "ghost"}
                      size="sm"
                      onClick={() => setActiveSection(section.id)}
                      className="flex items-center gap-1"
                    >
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{section.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Section Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {renderSection()}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="premium" onClick={onBookViewing} className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Book Viewing
                </Button>
                <Button variant="outline" onClick={onRequestInfo} className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Request More Info
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentPopup;