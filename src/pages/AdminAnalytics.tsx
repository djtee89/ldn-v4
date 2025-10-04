import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, CheckCircle2, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminAnalytics = () => {
  const [isComputingMetrics, setIsComputingMetrics] = useState(false);
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
      // Count polygons
      const { count: polyCount } = await supabase
        .from('area_polygons')
        .select('*', { count: 'exact', head: true })
        .eq('area_type', 'MSOA');

      // Count metrics with price data
      const { count: metricCount } = await supabase
        .from('area_metrics')
        .select('*', { count: 'exact', head: true })
        .eq('area_type', 'MSOA')
        .not('price_per_sqft_overall', 'is', null);

      // Get last updated timestamp
      const { data: latestMetric } = await supabase
        .from('area_metrics')
        .select('last_updated')
        .eq('area_type', 'MSOA')
        .not('price_per_sqft_overall', 'is', null)
        .order('last_updated', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Get missing area codes (polygons without metrics)
      const { data: allPolygons } = await supabase
        .from('area_polygons')
        .select('area_code')
        .eq('area_type', 'MSOA');

      const { data: metricsWithData } = await supabase
        .from('area_metrics')
        .select('area_code')
        .eq('area_type', 'MSOA')
        .not('price_per_sqft_overall', 'is', null);

      const metricCodes = new Set(metricsWithData?.map(m => m.area_code) || []);
      const missingCodes = allPolygons?.filter(p => !metricCodes.has(p.area_code)) || [];

      setStatus({
        polygonCount: polyCount || 0,
        priceMetricCount: metricCount || 0,
        lastUpdated: latestMetric?.last_updated || null,
        missingCount: missingCodes.length,
        missingAreaCodes: missingCodes.slice(0, 5).map(p => p.area_code),
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

  const handleFetchBoundaries = async () => {
    setIsFetchingBoundaries(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-area-boundaries');
      if (error) throw error;
      toast.success('Boundaries fetched successfully');
      await fetchStatus();
    } catch (error: any) {
      toast.error(`Failed to fetch boundaries: ${error.message}`);
    } finally {
      setIsFetchingBoundaries(false);
    }
  };

  const handleComputeMetrics = async () => {
    setIsComputingMetrics(true);
    try {
      const { data, error } = await supabase.functions.invoke('compute-area-metrics', {
        body: { force_refresh: true }
      });
      if (error) throw error;
      toast.success(`Computed metrics for ${data.areas_computed} areas`);
      await fetchStatus();
    } catch (error: any) {
      toast.error(`Failed to compute metrics: ${error.message}`);
    } finally {
      setIsComputingMetrics(false);
    }
  };

  const handleComputePragmatic = async () => {
    setIsComputingPragmatic(true);
    try {
      const { data, error } = await supabase.functions.invoke('compute-pragmatic-price');
      if (error) throw error;
      toast.success(`Computed pragmatic £/ft² for ${data.areas_computed} areas`);
      await fetchStatus();
    } catch (error: any) {
      toast.error(`Failed to compute pragmatic £/ft²: ${error.message}`);
    } finally {
      setIsComputingPragmatic(false);
    }
  };


  const handleInitializeAll = async () => {
    setIsInitializing(true);
    try {
      toast.info('Starting initialization...');
      
      toast.info('Step 1/3: Fetching MSOA boundaries...');
      await handleFetchBoundaries();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.info('Step 2/3: Computing price per sqft...');
      await handleComputeMetrics();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.info('Step 3/3: Computing pragmatic £/ft²...');
      await handleComputePragmatic();
      
      toast.success('Price analysis data initialized successfully!');
    } catch (error: any) {
      toast.error(`Initialization failed: ${error.message}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const hasWarnings = status.polygonCount === 0 || status.priceMetricCount === 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Price Per Sqft Analytics</h1>
        <Button
          onClick={handleInitializeAll}
          disabled={isInitializing}
          size="lg"
          className="gap-2"
        >
          {isInitializing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Initialize Data
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
          <CardDescription>Current state of MSOA boundaries and price metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">MSOA Polygons</p>
              <p className="text-2xl font-bold">{status.polygonCount} / 983</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">£/ft² Rows (non-null)</p>
              <p className={`text-2xl font-bold ${status.priceMetricCount === status.polygonCount && status.polygonCount > 0 ? 'text-green-600' : ''}`}>
                {status.priceMetricCount} / {status.polygonCount}
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
                {status.polygonCount === 0 && '⚠️ No MSOA polygons loaded. Run "Fetch Boundaries" first. '}
                {status.polygonCount > 0 && status.priceMetricCount === 0 && '⚠️ No price metrics computed. Run "Compute Pragmatic £/ft²" to populate. '}
                Please run the functions below to initialize the data.
              </AlertDescription>
            </Alert>
          )}

          {status.missingCount > 0 && (
            <Alert>
              <AlertDescription>
                <p className="font-semibold mb-1">⚠️ {status.missingCount} MSOAs missing price data</p>
                {status.missingAreaCodes.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Top 5 missing: {status.missingAreaCodes.join(', ')}
                    {status.missingCount > 5 && ` +${status.missingCount - 5} more`}
                  </p>
                )}
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
          <p>1. <strong>Fetch Boundaries:</strong> Load ~983 London MSOA (Middle Layer Super Output Area) polygons from the ONS API</p>
          <p>2. <strong>Compute Metrics:</strong> Calculate median price per square foot for each MSOA based on available units in your developments database</p>
          <p>3. <strong>Compute Pragmatic £/ft²:</strong> Generate London-wide £/ft² estimates from ONS/LR median price ÷ EPC median floor area</p>
          <p>4. View the results on the <strong>Live Analysis</strong> page with color-coded heat layer and discount percentages</p>
          <p className="text-muted-foreground pt-2">Click "Initialize Data" above to run all steps automatically.</p>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>1. Fetch Boundaries</CardTitle>
            <CardDescription>Load London MSOA polygons (~983 areas)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleFetchBoundaries}
              disabled={isFetchingBoundaries}
              className="w-full"
            >
              {isFetchingBoundaries && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Fetch Boundaries
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Compute Price/sqft</CardTitle>
            <CardDescription>Calculate metrics from available units</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleComputeMetrics}
              disabled={isComputingMetrics}
              className="w-full"
            >
              {isComputingMetrics && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Run Computation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Pragmatic £/ft²</CardTitle>
            <CardDescription>ONS/LR price ÷ EPC floor area</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleComputePragmatic}
              disabled={isComputingPragmatic}
              className="w-full"
            >
              {isComputingPragmatic && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Compute Pragmatic
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;