import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Navigation, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DirectionsStep {
  instruction: string;
  distance: number;
  duration: number;
}

interface DirectionsData {
  distance: number; // in meters
  duration: number; // in seconds
  steps: DirectionsStep[];
  mode: 'walking' | 'driving';
}

interface DirectionsPanelProps {
  directions: DirectionsData | null;
  fromName: string;
  toName: string;
  onClose: () => void;
  isLoading?: boolean;
}

const DirectionsPanel: React.FC<DirectionsPanelProps> = ({
  directions,
  fromName,
  toName,
  onClose,
  isLoading = false
}) => {
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <Card className="fixed bottom-4 right-4 w-full max-w-md z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Directions
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="font-medium">{fromName}</span>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <ArrowRight className="h-3 w-3" />
                <span>{toName}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {!isLoading && directions && (
          <>
            {/* Summary */}
            <div className="flex items-center gap-4 mb-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-semibold">{formatDuration(directions.duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" />
                <span className="font-semibold">{formatDistance(directions.distance)}</span>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {directions.mode === 'walking' ? '🚶 Walking' : '🚗 Driving'}
              </Badge>
            </div>

            {/* Steps */}
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {directions.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 pb-3 border-b border-border last:border-0">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{step.instruction}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistance(step.distance)} • {formatDuration(step.duration)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
        
        {!isLoading && !directions && (
          <div className="text-center py-8 text-muted-foreground">
            <Navigation className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Unable to fetch directions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DirectionsPanel;
