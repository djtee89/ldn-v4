import React, { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import LiveAnalysisMap from '@/components/LiveAnalysisMap';
import { useDevelopments } from '@/hooks/use-developments';
import { useAreaMetrics, useAreaPolygons, AreaMetric } from '@/hooks/use-area-metrics';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Development } from '@/data/newDevelopments';
import AnalysisModeSelector from '@/components/AnalysisModeSelector';
import AnalysisInsightPanel from '@/components/AnalysisInsightPanel';
import AnalysisLegend, { BracketFilter } from '@/components/AnalysisLegend';
import AnalysisSearchFilter, { FilterState } from '@/components/AnalysisSearchFilter';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useSearchParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export type AnalysisMode = 'price-per-sqft' | 'yield' | 'growth' | 'schools' | 'green' | 'noise-air' | 'crime';
export type SelectionType = 'development' | 'area' | null;

const Analysis = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMode, setActiveMode] = useState<AnalysisMode>('price-per-sqft');
  const [selectedBrackets, setSelectedBrackets] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({ beds: [], zones: [], completionWindow: [] });
  const [selectedItem, setSelectedItem] = useState<{ type: SelectionType; data: Development | AreaMetric | null }>({ type: null, data: null });
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  
  const isMobile = useIsMobile();
  const { data: developments = [], isLoading: devsLoading } = useDevelopments();
  const { data: areaMetrics = [], isLoading: metricsLoading } = useAreaMetrics();
  const { data: areaPolygons = [], isLoading: polygonsLoading } = useAreaPolygons();

  // Initialize from URL params
  useEffect(() => {
    const mode = searchParams.get('mode') as AnalysisMode;
    if (mode && ['price-per-sqft', 'yield', 'growth', 'schools', 'green', 'noise-air', 'crime'].includes(mode)) {
      setActiveMode(mode);
    }
  }, []);

  // Update URL when mode changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('mode', activeMode);
    setSearchParams(params, { replace: true });
  }, [activeMode]);

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

  // Generate brackets based on current mode
  const brackets = useMemo((): BracketFilter[] => {
    if (activeMode === 'price-per-sqft' && areaMetrics.length > 0) {
      const values = areaMetrics
        .map(a => a.price_per_sqft_overall)
        .filter((v): v is number => v !== null)
        .sort((a, b) => a - b);
      
      if (values.length === 0) return [];

      // Define quintile brackets
      const q1 = values[Math.floor(values.length * 0.2)];
      const q2 = values[Math.floor(values.length * 0.4)];
      const q3 = values[Math.floor(values.length * 0.6)];
      const q4 = values[Math.floor(values.length * 0.8)];

      return [
        { min: 0, max: q1, label: `<£${Math.round(q1)}`, color: '#22c55e', count: 0 },
        { min: q1, max: q2, label: `£${Math.round(q1)}-£${Math.round(q2)}`, color: '#84cc16', count: 0 },
        { min: q2, max: q3, label: `£${Math.round(q2)}-£${Math.round(q3)}`, color: '#eab308', count: 0 },
        { min: q3, max: q4, label: `£${Math.round(q3)}-£${Math.round(q4)}`, color: '#f97316', count: 0 },
        { min: q4, max: Infinity, label: `>£${Math.round(q4)}`, color: '#ef4444', count: 0 },
      ];
    }
    return [];
  }, [activeMode, areaMetrics]);

  const handleBracketToggle = (index: number) => {
    setSelectedBrackets(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleResetBrackets = () => {
    setSelectedBrackets([]);
  };

  const handleDevelopmentClick = (dev: Development) => {
    setSelectedItem({ type: 'development', data: dev });
    if (isMobile) setMobileSheetOpen(true);
  };

  const handleAreaClick = (area: AreaMetric) => {
    setSelectedItem({ type: 'area', data: area });
    if (isMobile) setMobileSheetOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const isLoading = devsLoading || unitsLoading || metricsLoading || polygonsLoading;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Live Analysis</h1>
          <Badge variant="secondary" className="text-xs">
            Data updated: 08 Oct 2025
          </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>How We Calculate</DialogTitle>
                <DialogDescription className="space-y-3 pt-2">
                  <p className="text-sm">
                    Our Live Analysis combines multiple data sources to give you real-time market insights:
                  </p>
                  <ul className="text-sm space-y-2 list-disc pl-5">
                    <li><strong>Price/sqft:</strong> Based on available units in our database with Land Registry validation</li>
                    <li><strong>Yield:</strong> Estimated from current rental data and typical service charges</li>
                    <li><strong>Growth:</strong> 12-month price trends from Land Registry Price Paid Data</li>
                    <li><strong>Schools:</strong> Ofsted ratings and proximity analysis</li>
                    <li><strong>Green Space:</strong> OpenStreetMap and GLA green infrastructure data</li>
                    <li><strong>Noise/Air:</strong> DEFRA monitoring stations and traffic data</li>
                    <li><strong>Crime:</strong> Metropolitan Police recorded crime statistics</li>
                  </ul>
                  <p className="text-xs text-muted-foreground">
                    Data is updated nightly. All calculations use industry-standard methodologies.
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map Area (Left 65-70%) */}
        <div className="relative w-[70%] h-full">
          {/* Mode Pills */}
          <div className="absolute top-4 left-4 z-10">
            <AnalysisModeSelector activeMode={activeMode} onModeChange={setActiveMode} />
          </div>

          {/* Legend */}
          {brackets.length > 0 && !isMobile && (
            <AnalysisLegend
              mode={activeMode}
              brackets={brackets}
              selectedBrackets={selectedBrackets}
              onBracketToggle={handleBracketToggle}
              onReset={handleResetBrackets}
            />
          )}

          {/* Search & Filter */}
          <div className="absolute top-4 right-4 z-10 w-80">
            <AnalysisSearchFilter
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Map */}
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">Loading map data...</p>
            </div>
          ) : areaPolygons.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center bg-muted p-8">
              <div className="max-w-md text-center space-y-4">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-semibold">No Map Data Available</h3>
                <p className="text-muted-foreground">
                  To see the Live Analysis map, you need to fetch area boundaries and metrics first.
                </p>
                <div className="space-y-2 text-sm text-left bg-background/50 p-4 rounded-lg border">
                  <p className="font-medium">Required steps:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to <strong>Admin Analytics</strong> page</li>
                    <li>Click <strong>"Fetch Boundaries"</strong> (required for map display)</li>
                    <li>Click <strong>"Run Computation"</strong> to calculate price/sqft</li>
                    <li>Optionally fetch other metrics (Yield, Growth, Crime, etc.)</li>
                    <li>Return here to view the analysis</li>
                  </ol>
                </div>
                <Button 
                  onClick={() => window.location.href = '/admin/analytics'}
                  className="mt-4"
                >
                  Go to Admin Analytics
                </Button>
              </div>
            </div>
          ) : (
            <LiveAnalysisMap
              units={enrichedUnits}
              developments={developments}
              areaMetrics={areaMetrics}
              areaPolygons={areaPolygons}
              mode={activeMode}
              brackets={brackets}
              selectedBrackets={selectedBrackets}
              onDevelopmentClick={handleDevelopmentClick}
              onAreaClick={handleAreaClick}
            />
          )}

          {/* Footer Stripe */}
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border px-4 py-2">
            <p className="text-xs text-muted-foreground">
              Pins loaded: {developments.length} • Units in view: {enrichedUnits.length} • Mode: {activeMode.replace('-', ' ')}
              {selectedBrackets.length > 0 && ` • Filters: ${selectedBrackets.length} bracket${selectedBrackets.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Insight Panel (Right 30-35%) - Desktop Only */}
        {!isMobile && (
          <div className="w-[30%] h-full overflow-y-auto border-l border-border bg-background">
            <AnalysisInsightPanel
              mode={activeMode}
              units={enrichedUnits}
              developments={developments}
              selectedItem={selectedItem}
            />
          </div>
        )}

        {/* Mobile Bottom Sheet */}
        {isMobile && (
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
              <AnalysisInsightPanel
                mode={activeMode}
                units={enrichedUnits}
                developments={developments}
                selectedItem={selectedItem}
              />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default Analysis;
