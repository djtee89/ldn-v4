import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, MapPin, Building2 } from 'lucide-react';
import { AnalysisMode, SelectionType } from '@/pages/Analysis';
import { Development } from '@/data/newDevelopments';
import { AreaMetric } from '@/hooks/use-area-metrics';

interface AnalysisInsightPanelProps {
  mode: AnalysisMode;
  units: any[];
  developments: Development[];
  selectedItem?: { type: SelectionType; data: Development | AreaMetric | null };
}

const AnalysisInsightPanel: React.FC<AnalysisInsightPanelProps> = ({
  mode,
  units,
  developments,
  selectedItem,
}) => {
  // Calculate statistics based on current mode
  const stats = useMemo(() => {
    if (mode === 'price-per-sqft' && units.length > 0) {
      const validUnits = units.filter(u => u.pricePerSqft > 0);
      
      const byBeds = validUnits.reduce((acc, unit) => {
        if (!acc[unit.beds]) {
          acc[unit.beds] = [];
        }
        acc[unit.beds].push(unit.pricePerSqft);
        return acc;
      }, {} as Record<number, number[]>);

      const bedStats = Object.entries(byBeds).map(([beds, prices]) => {
        const priceArray = prices as number[];
        const sorted = [...priceArray].sort((a, b) => a - b);
        return {
          beds: Number(beds),
          median: sorted[Math.floor(sorted.length / 2)],
          count: priceArray.length,
        };
      });

      const allPrices = validUnits.map(u => u.pricePerSqft).sort((a, b) => a - b);
      const overallMedian = allPrices[Math.floor(allPrices.length / 2)];

      return {
        overallMedian,
        bedStats: bedStats.sort((a, b) => a.beds - b.beds),
        totalUnits: validUnits.length,
      };
    }
    return null;
  }, [mode, units]);

  // Determine what to show based on selection
  const showDevelopment = selectedItem?.type === 'development' && selectedItem.data;
  const showArea = selectedItem?.type === 'area' && selectedItem.data;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        {showDevelopment ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">{(selectedItem.data as Development).name}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {(selectedItem.data as Development).location}
            </p>
          </>
        ) : showArea ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">{(selectedItem.data as AreaMetric).area_name}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {(selectedItem.data as AreaMetric).area_type.replace('_', ' ')}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-1">In View</h2>
            {stats && (
              <p className="text-sm text-muted-foreground">
                Median £/ft² (1–3 bed): £{Math.round(stats.overallMedian).toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>

      {/* Price Per Sqft Card */}
      {mode === 'price-per-sqft' && stats && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Price per sqft</CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.bedStats.map((stat) => (
              <div key={stat.beds} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{stat.beds} bed</span>
                  <span className="font-medium">£{Math.round(stat.median).toLocaleString()}/ft²</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${Math.min((stat.median / 1500) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{stat.count} units</p>
              </div>
            ))}
            
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Based on {stats.totalUnits} available units across {developments.length} developments
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Yield Card (placeholder) */}
      {mode === 'yield' && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Estimated Yield</CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Yield calculations coming soon. This will show rental yield estimates based on current market data.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Other modes placeholder */}
      {!['price-per-sqft', 'yield'].includes(mode) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold capitalize">
              {mode.replace('-', ' ')} Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')} data coming soon.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <Button variant="outline" className="w-full text-sm">
          Show developments here
        </Button>
        <Button variant="outline" className="w-full text-sm">
          Email me this area
        </Button>
      </div>
    </div>
  );
};

export default AnalysisInsightPanel;
