import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import LiveAnalysisMap from '@/components/LiveAnalysisMap';
import PriceAnalysisPanel from '@/components/PriceAnalysisPanel';
import { Button } from '@/components/ui/button';
import { useDevelopments } from '@/hooks/use-developments';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';

interface Unit {
  id: string;
  dev_id: string;
  unit_number: string;
  beds: number;
  price: number;
  size_sqft: number;
  status: string;
  building?: string;
  floor?: number;
}

const LiveAnalysis = () => {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [selectedBeds, setSelectedBeds] = useState<number[]>([]);
  const { data: developments = [] } = useDevelopments();
  const navigate = useNavigate();

  // Fetch units data
  const { data: units = [], isLoading: unitsLoading } = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('status', 'Available');
      
      if (error) throw error;
      return data as Unit[];
    },
  });

  // Calculate price per sqft for each unit
  const unitsWithPricePerSqft = useMemo(() => {
    return units.map(unit => ({
      ...unit,
      pricePerSqft: unit.price / unit.size_sqft,
    }));
  }, [units]);

  // Join units with development data
  const enrichedUnits = useMemo(() => {
    return unitsWithPricePerSqft.map(unit => {
      const dev = developments.find(d => d.id === unit.dev_id);
      return {
        ...unit,
        development: dev,
      };
    }).filter(u => u.development); // Only include units with valid developments
  }, [unitsWithPricePerSqft, developments]);

  // Filter units
  const filteredUnits = useMemo(() => {
    return enrichedUnits.filter(unit => {
      if (selectedZones.length > 0 && !selectedZones.includes(unit.development!.zone.toString())) {
        return false;
      }
      if (selectedBeds.length > 0 && !selectedBeds.includes(unit.beds)) {
        return false;
      }
      return true;
    });
  }, [enrichedUnits, selectedZones, selectedBeds]);

  // Calculate zone averages
  const zoneAverages = useMemo(() => {
    const byZone: Record<string, { total: number; count: number; units: typeof filteredUnits }> = {};
    
    filteredUnits.forEach(unit => {
      const zone = unit.development!.zone.toString();
      if (!byZone[zone]) {
        byZone[zone] = { total: 0, count: 0, units: [] };
      }
      byZone[zone].total += unit.pricePerSqft;
      byZone[zone].count += 1;
      byZone[zone].units.push(unit);
    });

    return Object.entries(byZone).map(([zone, data]) => ({
      zone,
      average: data.total / data.count,
      count: data.count,
      units: data.units,
    })).sort((a, b) => parseInt(a.zone) - parseInt(b.zone));
  }, [filteredUnits]);

  // Best value developments
  const bestValueDevelopments = useMemo(() => {
    const byDev: Record<string, { 
      name: string; 
      avgPricePerSqft: number; 
      count: number;
      development: any;
    }> = {};
    
    filteredUnits.forEach(unit => {
      const devId = unit.dev_id;
      if (!byDev[devId]) {
        byDev[devId] = { 
          name: unit.development!.name,
          avgPricePerSqft: 0,
          count: 0,
          development: unit.development,
        };
      }
      byDev[devId].avgPricePerSqft += unit.pricePerSqft;
      byDev[devId].count += 1;
    });

    return Object.values(byDev)
      .map(dev => ({
        ...dev,
        avgPricePerSqft: dev.avgPricePerSqft / dev.count,
      }))
      .sort((a, b) => a.avgPricePerSqft - b.avgPricePerSqft)
      .slice(0, 10);
  }, [filteredUnits]);

  if (unitsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading analysis data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAboutClick={() => navigate('/')}
        onGuideClick={() => navigate('/')}
        onShortlistClick={() => {}}
        shortlistCount={0}
        language={language}
        onLanguageChange={(lang) => setLanguage(lang as 'en' | 'zh')}
      />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="mb-4 text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold mb-2">Live Price Analysis</h1>
          <p className="text-lg text-white/80">
            Real-time market data on price per square foot across London developments
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map - 60% width on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
              <LiveAnalysisMap
                units={filteredUnits}
                developments={developments}
              />
            </div>
          </div>

          {/* Analysis Panel - 40% width on large screens */}
          <div className="lg:col-span-1">
            <PriceAnalysisPanel
              zoneAverages={zoneAverages}
              bestValueDevelopments={bestValueDevelopments}
              totalUnits={filteredUnits.length}
              selectedZones={selectedZones}
              onZonesChange={setSelectedZones}
              selectedBeds={selectedBeds}
              onBedsChange={setSelectedBeds}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAnalysis;
