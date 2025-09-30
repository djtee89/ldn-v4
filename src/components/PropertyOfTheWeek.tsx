import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MapPin, Star } from 'lucide-react';
import { propertyOfTheWeek } from '@/data/developments';

interface PropertyOfTheWeekProps {
  onViewClick: () => void;
}

const PropertyOfTheWeek: React.FC<PropertyOfTheWeekProps> = ({ onViewClick }) => {
  const { development, floorplanUrl } = propertyOfTheWeek;

  return (
    <Card className="absolute bottom-4 left-4 w-80 bg-glass backdrop-blur-sm border-border shadow-medium">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-premium fill-premium" />
          <CardTitle className="text-sm font-semibold text-foreground">
            Property of the Week
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h3 className="font-semibold text-sm text-foreground">{development.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {development.location}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="font-bold text-sm text-foreground">{development.prices.oneBed}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Zone {development.zone}</p>
            <p className="text-xs text-premium font-medium">{development.developer}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={onViewClick}
          >
            View Details
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => window.open(floorplanUrl, '_blank')}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyOfTheWeek;