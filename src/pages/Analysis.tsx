import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import LiveAnalysisMap from '@/components/LiveAnalysisMap';
import { useDevelopments } from '@/hooks/use-developments';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Development } from '@/data/newDevelopments';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAreaMetrics, useAreaPolygons } from '@/hooks/use-area-metrics';

export type SelectionType = 'development' | null;

const Analysis = () => {
  const [selectedItem, setSelectedItem] = useState<{ type: SelectionType; data: Development | null }>({ type: null, data: null });
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  
  const isMobile = useIsMobile();
  const { data: developments = [], isLoading: devsLoading } = useDevelopments();
  const { data: areaMetrics = [], isLoading: metricsLoading } = useAreaMetrics();
  const { data: areaPolygons = [], isLoading: polygonsLoading } = useAreaPolygons();

  // Fetch units for price analysis
  const { data: units = [], isLoading: unitsLoading } = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('status', 'Available');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Enrich units with development data
  const enrichedUnits = useMemo(() => {
    return units.map(unit => ({
      ...unit,
      pricePerSqft: unit.price / unit.size_sqft,
      development: developments.find(d => d.id === unit.dev_id),
    }));
  }, [units, developments]);

  const handleDevelopmentClick = (dev: Development) => {
    setSelectedItem({ type: 'development', data: dev });
    if (isMobile) setMobileSheetOpen(true);
  };

  const isLoading = devsLoading || unitsLoading || metricsLoading || polygonsLoading;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between flex-shrink-0">
        <h1 className="text-2xl font-bold">Price Per Sqft Analysis</h1>
        <p className="text-sm text-muted-foreground">
          {developments.length} developments • {enrichedUnits.length} available units
        </p>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map Area (70%) */}
        <div className="relative w-[70%] h-full">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">Loading map data...</p>
            </div>
          ) : (
            <LiveAnalysisMap
              units={enrichedUnits}
              developments={developments}
              areaMetrics={areaMetrics}
              areaPolygons={areaPolygons}
              onDevelopmentClick={handleDevelopmentClick}
            />
          )}
        </div>

        {/* Side Panel (30%) */}
        {!isMobile && (
          <div className="w-[30%] h-full overflow-y-auto border-l border-border bg-background p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                  <span className="text-sm">&lt;£900/sqft - Great Value</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#84cc16' }} />
                  <span className="text-sm">£900-£1,100/sqft - Good Value</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#eab308' }} />
                  <span className="text-sm">£1,100-£1,300/sqft - Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f97316' }} />
                  <span className="text-sm">£1,300-£1,500/sqft - Above Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                  <span className="text-sm">&gt;£1,500/sqft - Premium</span>
                </div>
              </CardContent>
            </Card>

            {selectedItem.type === 'development' && selectedItem.data && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedItem.data.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{selectedItem.data.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Developer</p>
                    <p className="text-sm text-muted-foreground">{selectedItem.data.developer}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Mobile Bottom Sheet */}
        {isMobile && (
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetContent side="bottom" className="h-[70vh] overflow-y-auto p-6">
              {selectedItem.type === 'development' && selectedItem.data && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">{selectedItem.data.name}</h2>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{selectedItem.data.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Developer</p>
                    <p className="text-sm text-muted-foreground">{selectedItem.data.developer}</p>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default Analysis;
