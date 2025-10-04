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
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Status state
  const [polygonCount, setPolygonCount] = useState(0);
  const [priceMetricCount, setPriceMetricCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Fetch status
  const fetchStatus = async () => {
    try {
      // Get polygon count
      const { count: polyCount } = await supabase
        .from('area_polygons')
        .select('*', { count: 'exact', head: true })
        .eq('area_type', 'MSOA');
      
      setPolygonCount(polyCount || 0);

      // Get price metric count
      const { data: metrics } = await supabase
        .from('area_metrics')
        .select('price_per_sqft_overall, last_updated')
        .eq('area_type', 'MSOA');

      if (metrics) {
        setPriceMetricCount(metrics.filter(m => m.price_per_sqft_overall !== null).length);
        setLastUpdated(metrics[0]?.last_updated || null);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
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


  const handleInitializeAll = async () => {
    setIsInitializing(true);
    try {
      toast.info('Starting initialization...');
      
      toast.info('Step 1/2: Fetching MSOA boundaries...');
      await handleFetchBoundaries();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.info('Step 2/2: Computing price per sqft...');
      await handleComputeMetrics();
      
      toast.success('Price analysis data initialized successfully!');
    } catch (error: any) {
      toast.error(`Initialization failed: ${error.message}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const hasWarnings = polygonCount === 0 || priceMetricCount === 0;

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
              <p className="text-2xl font-bold">{polygonCount} / 983</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price Metrics</p>
              <p className="text-2xl font-bold">{priceMetricCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-sm">{lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}</p>
            </div>
          </div>

          {hasWarnings && (
            <Alert variant="destructive">
              <AlertDescription>
                {polygonCount === 0 && 'No MSOA polygons loaded. '}
                {priceMetricCount === 0 && 'No price/sqft metrics computed. '}
                Please run the functions below to initialize the data.
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
          <p>3. View the results on the <strong>Live Analysis</strong> page with color-coded map pins</p>
          <p className="text-muted-foreground pt-2">Click "Initialize Data" above to run both steps automatically.</p>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid gap-4 md:grid-cols-2">
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
      </div>
    </div>
  );
};

export default AdminAnalytics;