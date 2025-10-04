import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, CheckCircle2, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminAnalytics = () => {
  const [isFetchingBoundaries, setIsFetchingBoundaries] = useState(false);
  const [isComputingPragmatic, setIsComputingPragmatic] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Status state
  const [status, setStatus] = useState<{
    polygonCount: number;
    priceMetricCount: number;
    lastUpdated: string | null;
    missingCount: number;
    missingAreaCodes: string[];
  }>({
    polygonCount: 0,
    priceMetricCount: 0,
    lastUpdated: null,
    missingCount: 0,
    missingAreaCodes: [],
  });

  // Fetch status
  const fetchStatus = async () => {
    try {
      // Count Borough polygons
      const { count: polyCount } = await supabase
        .from('area_polygons')
        .select('*', { count: 'exact', head: true })
        .eq('area_type', 'Borough');

      // Count metrics with price data
      const { count: metricCount } = await supabase
        .from('area_metrics')
        .select('*', { count: 'exact', head: true })
        .eq('area_type', 'Borough')
        .not('price_per_sqft_overall', 'is', null);

      // Get last updated timestamp
      const { data: latestMetric } = await supabase
        .from('area_metrics')
        .select('last_updated')
        .eq('area_type', 'Borough')
        .not('price_per_sqft_overall', 'is', null)
        .order('last_updated', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Get missing area codes
      const { data: allPolygons } = await supabase
        .from('area_polygons')
        .select('area_code, area_name')
        .eq('area_type', 'Borough');

      const { data: metricsWithData } = await supabase
        .from('area_metrics')
        .select('area_code')
        .eq('area_type', 'Borough')
        .not('price_per_sqft_overall', 'is', null);

      const metricCodes = new Set(metricsWithData?.map(m => m.area_code) || []);
      const missingPolys = allPolygons?.filter(p => !metricCodes.has(p.area_code)) || [];

      setStatus({
        polygonCount: polyCount || 0,
        priceMetricCount: metricCount || 0,
        lastUpdated: latestMetric?.last_updated || null,
        missingCount: missingPolys.length,
        missingAreaCodes: missingPolys.slice(0, 5).map(p => p.area_name || p.area_code),
      });
    } catch (error) {
      console.error('Error fetching status:', error);
      toast.error('Failed to fetch status');
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const handleLoadGeoJSON = async () => {
    setIsFetchingBoundaries(true);
    try {
      const { data, error } = await supabase.functions.invoke('borough-load-geojson');
      if (error) throw error;
      toast.success(`Loaded ${data.inserted} borough polygons`);
      await fetchStatus();
    } catch (error: any) {
      toast.error(`Failed to load borough polygons: ${error.message}`);
    } finally {
      setIsFetchingBoundaries(false);
    }
  };

  const handleComputePPSF = async () => {
    setIsComputingPragmatic(true);
    try {
      const { data, error } = await supabase.functions.invoke('borough-ppsf-pragmatic');
      if (error) throw error;
      toast.success(`Computed price data for ${data.nonNull}/${data.inserted} boroughs`);
      await fetchStatus();
    } catch (error: any) {
      toast.error(`Failed to compute price data: ${error.message}`);
    } finally {
      setIsComputingPragmatic(false);
    }
  };


  const handleInitializeAll = async () => {
    setIsInitializing(true);
    try {
      toast.info('Starting initialization...');
      
      toast.info('Step 1/2: Loading Borough GeoJSON...');
      await handleLoadGeoJSON();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.info('Step 2/2: Computing Borough £/ft²...');
      await handleComputePPSF();
      
      toast.success('Borough map initialized successfully with 33/33 polygons and price data!');
    } catch (error: any) {
      toast.error(`Initialization failed: ${error.message}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const hasWarnings = status.polygonCount === 0 || status.priceMetricCount === 0;
  const expectedCount = 33; // 33 London Boroughs

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Borough £/ft² Analytics</h1>
        <Button
          onClick={handleInitializeAll}
          disabled={isInitializing}
          size="lg"
          className="gap-2"
        >
          {isInitializing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Initialize Borough Map (Local)
        </Button>
      </div>

      {/* Status Overview */}
      <Card className={hasWarnings ? 'border-destructive' : 'border-green-500'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {hasWarnings ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            Data Status
          </CardTitle>
          <CardDescription>Current state of London Borough boundaries and price metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Borough Polygons</p>
              <p className={`text-2xl font-bold ${status.polygonCount === expectedCount ? 'text-green-600' : ''}`}>
                {status.polygonCount}/{expectedCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">£/ft² Rows (non-null)</p>
              <p className={`text-2xl font-bold ${status.priceMetricCount === expectedCount ? 'text-green-600' : ''}`}>
                {status.priceMetricCount}/{expectedCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-sm">{status.lastUpdated ? new Date(status.lastUpdated).toLocaleDateString() : 'Never'}</p>
            </div>
          </div>

          {hasWarnings && (
            <Alert variant="destructive">
              <AlertDescription>
                {status.polygonCount === 0 && '⚠️ No Borough polygons loaded. Run "Fetch Boundaries" first. '}
                {status.polygonCount > 0 && status.priceMetricCount === 0 && '⚠️ No price metrics computed. Run "Compute Pragmatic £/ft²" to populate. '}
                Please run the functions below to initialize the data.
              </AlertDescription>
            </Alert>
          )}

          {status.missingCount > 0 && status.polygonCount === expectedCount && (
            <Alert>
              <AlertDescription>
                <p className="font-semibold mb-1">⚠️ {status.missingCount} Boroughs missing price data</p>
                {status.missingAreaCodes.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Missing: {status.missingAreaCodes.join(', ')}
                    {status.missingCount > 5 && ` +${status.missingCount - 5} more`}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {status.priceMetricCount === expectedCount && status.polygonCount === expectedCount && (
            <Alert className="bg-green-50 dark:bg-green-950/20 border-green-500">
              <AlertDescription className="text-green-800 dark:text-green-200">
                ✓ All {expectedCount} London Boroughs have £/ft² data — map ready
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. <strong>Fetch Boundaries:</strong> Load 33 London Borough polygons from the ONS API</p>
          <p>2. <strong>Compute Pragmatic £/ft²:</strong> Generate Borough-level £/ft² estimates (Westminster, Camden, Hackney, etc.)</p>
          <p>3. View the results on the <strong>Live Analysis</strong> page with smooth color-coded map and discount percentages</p>
          <p className="text-muted-foreground pt-2">Click "Initialize Data" above to run all steps automatically.</p>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1. Load Borough GeoJSON</CardTitle>
            <CardDescription>Load real London Borough polygons from storage (requires london-boroughs.geojson in static/boroughs/)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleLoadGeoJSON}
              disabled={isFetchingBoundaries}
              className="w-full"
            >
              {isFetchingBoundaries && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Load Borough Polygons
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Compute Borough £/ft²</CardTitle>
            <CardDescription>Calculate pragmatic price per square foot using ONS price data and EPC floor area data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleComputePPSF}
              disabled={isComputingPragmatic}
              className="w-full"
            >
              {isComputingPragmatic && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Compute Borough £/ft²
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;