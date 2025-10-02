import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Home } from 'lucide-react';

interface ZoneAverage {
  zone: string;
  average: number;
  count: number;
}

interface BestValueDevelopment {
  name: string;
  avgPricePerSqft: number;
  count: number;
  development: any;
}

interface PriceAnalysisPanelProps {
  zoneAverages: ZoneAverage[];
  bestValueDevelopments: BestValueDevelopment[];
  totalUnits: number;
  selectedZones: string[];
  onZonesChange: (zones: string[]) => void;
  selectedBeds: number[];
  onBedsChange: (beds: number[]) => void;
}

const PriceAnalysisPanel: React.FC<PriceAnalysisPanelProps> = ({
  zoneAverages,
  bestValueDevelopments,
  totalUnits,
  selectedZones,
  onZonesChange,
  selectedBeds,
  onBedsChange,
}) => {
  const toggleZone = (zone: string) => {
    if (selectedZones.includes(zone)) {
      onZonesChange(selectedZones.filter(z => z !== zone));
    } else {
      onZonesChange([...selectedZones, zone]);
    }
  };

  const toggleBeds = (beds: number) => {
    if (selectedBeds.includes(beds)) {
      onBedsChange(selectedBeds.filter(b => b !== beds));
    } else {
      onBedsChange([...selectedBeds, beds]);
    }
  };

  const overallAverage = zoneAverages.length > 0
    ? zoneAverages.reduce((sum, z) => sum + z.average * z.count, 0) / totalUnits
    : 0;

  return (
    <div className="space-y-4">
      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Zones</p>
            <div className="flex flex-wrap gap-2">
              {['1', '2', '3', '4', '5', '6'].map(zone => (
                <Button
                  key={zone}
                  variant={selectedZones.includes(zone) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleZone(zone)}
                  className="h-8"
                >
                  Zone {zone}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Bedrooms</p>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4].map(beds => (
                <Button
                  key={beds}
                  variant={selectedBeds.includes(beds) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleBeds(beds)}
                  className="h-8"
                >
                  {beds === 0 ? 'Studio' : `${beds} bed`}
                </Button>
              ))}
            </div>
          </div>
          {(selectedZones.length > 0 || selectedBeds.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onZonesChange([]);
                onBedsChange([]);
              }}
              className="w-full"
            >
              Clear All
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Available Units</p>
              <p className="text-2xl font-bold">{totalUnits}</p>
            </div>
            <Home className="h-8 w-8 text-primary" />
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Avg Price/sqft</p>
              <p className="text-2xl font-bold">£{Math.round(overallAverage).toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      {/* Zone Averages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Average by Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {zoneAverages.map(zone => (
              <div key={zone.zone} className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Zone {zone.zone}</Badge>
                  <span className="text-sm text-muted-foreground">({zone.count} units)</span>
                </div>
                <span className="font-semibold">£{Math.round(zone.average).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Value Developments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-green-500" />
            Best Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {bestValueDevelopments.slice(0, 5).map((dev, idx) => (
              <div key={dev.name} className="p-2 rounded hover:bg-muted transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{dev.name}</p>
                    <p className="text-xs text-muted-foreground">{dev.count} units available</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">£{Math.round(dev.avgPricePerSqft).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">/sqft</p>
                  </div>
                </div>
                {idx === 0 && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    Best Value
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Investment Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            {zoneAverages.length > 0 && (
              <>
                Zone {zoneAverages[0].zone} offers the most affordable options at £{Math.round(zoneAverages[0].average).toLocaleString()}/sqft.
              </>
            )}
          </p>
          <p className="text-muted-foreground">
            {bestValueDevelopments.length > 0 && (
              <>
                <strong>{bestValueDevelopments[0].name}</strong> presents exceptional value with prices starting from £{Math.round(bestValueDevelopments[0].avgPricePerSqft).toLocaleString()}/sqft.
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceAnalysisPanel;
