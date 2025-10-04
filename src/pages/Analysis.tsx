import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import LiveAnalysisMap from '@/components/LiveAnalysisMap';
import { useDevelopments } from '@/hooks/use-developments';
import { useAreaMetrics, useAreaPolygons } from '@/hooks/use-area-metrics';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AnalysisModeSelector from '@/components/AnalysisModeSelector';
import AnalysisInsightPanel from '@/components/AnalysisInsightPanel';
import AnalysisLegend, { BracketFilter } from '@/components/AnalysisLegend';

export type AnalysisMode = 'price-per-sqft' | 'yield' | 'growth' | 'schools' | 'green' | 'noise-air' | 'crime';

const Analysis = () => {
  const [activeMode, setActiveMode] = useState<AnalysisMode>('price-per-sqft');
  const [selectedBrackets, setSelectedBrackets] = useState<number[]>([]);
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
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Info className="h-4 w-4" />
          </Button>
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
          {brackets.length > 0 && (
            <AnalysisLegend
              mode={activeMode}
              brackets={brackets}
              selectedBrackets={selectedBrackets}
              onBracketToggle={handleBracketToggle}
              onReset={handleResetBrackets}
            />
          )}

          {/* Map */}
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
              mode={activeMode}
              brackets={brackets}
              selectedBrackets={selectedBrackets}
            />
          )}

          {/* Footer Stripe */}
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border px-4 py-2">
            <p className="text-xs text-muted-foreground">
              Pins loaded: {developments.length} • Units in view: {enrichedUnits.length} • Mode: {activeMode}
            </p>
          </div>
        </div>

        {/* Insight Panel (Right 30-35%) */}
        <div className="w-[30%] h-full overflow-y-auto border-l border-border bg-background">
          <AnalysisInsightPanel
            mode={activeMode}
            units={enrichedUnits}
            developments={developments}
          />
        </div>
      </div>
    </div>
  );
};

export default Analysis;
