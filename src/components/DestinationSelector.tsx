import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Train, MapPin, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Station {
  name: string;
  line: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface DestinationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  nearestStation: {
    station: string;
    line: string;
    walkTime: number;
  };
  onSelectDestination: (station: Station) => void;
  developmentLocation: string;
}

// Common London stations with approximate coordinates
const LONDON_STATIONS: Station[] = [
  { name: 'Imperial Wharf', line: 'Overground', coordinates: { lat: 51.4757, lng: -0.1796 } },
  { name: 'Fulham Broadway', line: 'District', coordinates: { lat: 51.4806, lng: -0.1955 } },
  { name: 'West Brompton', line: 'District, Overground', coordinates: { lat: 51.4873, lng: -0.1953 } },
  { name: 'Earls Court', line: 'District, Piccadilly', coordinates: { lat: 51.4919, lng: -0.1939 } },
  { name: 'South Kensington', line: 'District, Piccadilly, Circle', coordinates: { lat: 51.4941, lng: -0.1738 } },
  { name: 'Sloane Square', line: 'District, Circle', coordinates: { lat: 51.4924, lng: -0.1564 } },
  { name: 'Victoria', line: 'District, Circle, Victoria', coordinates: { lat: 51.4965, lng: -0.1447 } },
  { name: 'Clapham Junction', line: 'Overground, Southern', coordinates: { lat: 51.4643, lng: -0.1705 } },
  { name: 'Battersea Park', line: 'Northern', coordinates: { lat: 51.4779, lng: -0.1480 } },
  { name: 'Chelsea', line: 'District', coordinates: { lat: 51.4876, lng: -0.1697 } },
];

const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  isOpen,
  onClose,
  nearestStation,
  onSelectDestination,
  developmentLocation
}) => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const handleSelect = (station: Station) => {
    setSelectedStation(station);
  };

  const handleConfirm = () => {
    if (selectedStation) {
      onSelectDestination(selectedStation);
      onClose();
    }
  };

  // Find the nearest station in our list
  const nearestStationData = LONDON_STATIONS.find(s => s.name === nearestStation.station);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Choose Destination
          </DialogTitle>
          <DialogDescription>
            Select which station you'd like directions to from {developmentLocation}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {/* Nearest station first */}
            {nearestStationData && (
              <>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">Nearest Station</Badge>
                    <span className="text-xs text-muted-foreground">
                      {nearestStation.walkTime} min walk
                    </span>
                  </div>
                  <Button
                    variant={selectedStation?.name === nearestStationData.name ? "premium" : "outline"}
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleSelect(nearestStationData)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <Train className="h-5 w-5 mt-1 flex-shrink-0" />
                      <div className="text-left flex-1">
                        <div className="font-semibold">{nearestStationData.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {nearestStationData.line}
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm font-medium mb-3">Other Nearby Stations</div>
                </div>
              </>
            )}

            {/* Other stations */}
            {LONDON_STATIONS.filter(s => s.name !== nearestStation.station).map((station) => (
              <Button
                key={station.name}
                variant={selectedStation?.name === station.name ? "premium" : "outline"}
                className="w-full justify-start h-auto p-4"
                onClick={() => handleSelect(station)}
              >
                <div className="flex items-start gap-3 w-full">
                  <Train className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="font-semibold">{station.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {station.line}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="premium" 
            onClick={handleConfirm} 
            disabled={!selectedStation}
            className="flex-1"
          >
            Get Directions
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DestinationSelector;
