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
  const [isFetchingCrime, setIsFetchingCrime] = useState(false);
  const [isFetchingGrowth, setIsFetchingGrowth] = useState(false);
  const [isFetchingAir, setIsFetchingAir] = useState(false);
  const [isFetchingSchools, setIsFetchingSchools] = useState(false);
  const [isFetchingYield, setIsFetchingYield] = useState(false);
  const [isFetchingGreen, setIsFetchingGreen] = useState(false);
  const [isFetchingBoundaries, setIsFetchingBoundaries] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Status state
  const [polygonCount, setPolygonCount] = useState(0);
  const [metricCounts, setMetricCounts] = useState({
    ppsf: 0,
    yield: 0,
    growth: 0,
    schools: 0,
    green: 0,
    noise: 0,
    crime: 0,
    lastUpdated: null as string | null,
  });

  // Fetch status
  const fetchStatus = async () => {
    try {
      // Get polygon count
      const { count: polyCount } = await supabase
        .from('area_polygons')
        .select('*', { count: 'exact', head: true })
        .eq('area_type', 'MSOA');
      
      setPolygonCount(polyCount || 0);

      // Get metric counts
      const { data: metrics } = await supabase
        .from('area_metrics')
        .select('price_per_sqft_overall, yield_1bed, growth_12m_pct, schools_score, green_space_pct, noise_air_badge, crime_per_1000, last_updated')
        .eq('area_type', 'MSOA');

      if (metrics) {
        const counts = {
          ppsf: metrics.filter(m => m.price_per_sqft_overall !== null).length,
          yield: metrics.filter(m => m.yield_1bed !== null).length,
          growth: metrics.filter(m => m.growth_12m_pct !== null).length,
          schools: metrics.filter(m => m.schools_score !== null).length,
          green: metrics.filter(m => m.green_space_pct !== null).length,
          noise: metrics.filter(m => m.noise_air_badge !== null).length,
          crime: metrics.filter(m => m.crime_per_1000 !== null).length,
          lastUpdated: metrics[0]?.last_updated || null,
        };
        setMetricCounts(counts);
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

  const handleFetchCrime = async () => {
    setIsFetchingCrime(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-crime-data');
      if (error) throw error;
      toast.success('Crime data fetched');
      await fetchStatus();
    } catch (error: any) {
      toast.error(`Failed to fetch crime data: ${error.message}`);
    } finally {
      setIsFetchingCrime(false);
    }
  };

  const handleFetchGrowth = async () => {
    setIsFetchingGrowth(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-growth-data');
      if (error) throw error;
      toast.success('Growth data fetched');
      await fetchStatus();
    } catch (error: any) {
      toast.error(`Failed to fetch growth data: ${error.message}`);
    } finally {
      setIsFetchingGrowth(false);
    }
  };

  const handleFetchAir = async () => {
    setIsFetchingAir(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-air-quality-data');
      if (error) throw error;
      toast.success('Air quality data fetched');
      await fetchStatus();
    } catch (error: any) {
      toast.error(`Failed to fetch air quality: ${error.message}`);
    } finally {
      setIsFetchingAir(false);
    }
  };

  const handleFetchSchools = async () => {
    setIsFetchingSchools(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-schools-data');
      if (error) throw error;
      toast.success('Schools data fetched');
      await fetchStatus();
    } catch (error: any) {
      toast.error(`Failed to fetch schools data: ${error.message}`);
    } finally {
      setIsFetchingSchools(false);
    }
  };

  const handleFetchYield = async () => {
    setIsFetchingYield(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-yield-data');
      if (error) throw error;
      toast.success('Yield data fetched');
      await fetchStatus();
    } catch (error: any) {
      toast.error(`Failed to fetch yield data: ${error.message}`);
    } finally {
      setIsFetchingYield(false);
    }
  };

  const handleFetchGreen = async () => {
    setIsFetchingGreen(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-greenspace-data');
      if (error) throw error;
      toast.success('Green space data fetched');
      await fetchStatus();
    } catch (error: any) {
      toast.error(`Failed to fetch green space data: ${error.message}`);
    } finally {
      setIsFetchingGreen(false);
    }
  };

  const handleInitializeAll = async () => {
    setIsInitializing(true);
    try {
      toast.info('Starting initialization...');
      
      // Run in sequence
      toast.info('Step 1/8: Fetching boundaries...');
      await handleFetchBoundaries();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.info('Step 2/8: Computing price/sqft...');
      await handleComputeMetrics();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.info('Step 3/8: Fetching crime data...');
      await handleFetchCrime();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.info('Step 4/8: Fetching growth data...');
      await handleFetchGrowth();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.info('Step 5/8: Fetching air quality...');
      await handleFetchAir();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.info('Step 6/8: Fetching schools data...');
      await handleFetchSchools();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.info('Step 7/8: Fetching yield data...');
      await handleFetchYield();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.info('Step 8/8: Fetching green space...');
      await handleFetchGreen();
      
      toast.success('All data initialized successfully!');
    } catch (error: any) {
      toast.error(`Initialization failed: ${error.message}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const hasWarnings = polygonCount === 0 || 
    metricCounts.ppsf === 0 || 
    metricCounts.ppsf !== polygonCount;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Analytics</h1>
        <Button
          onClick={handleInitializeAll}
          disabled={isInitializing}
          size="lg"
          className="gap-2"
        >
          {isInitializing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Initialize London Data
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
          <CardDescription>Current state of MSOA boundaries and metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Polygons (MSOA)</p>
              <p className="text-2xl font-bold">{polygonCount} / 983</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-sm">{metricCounts.lastUpdated ? new Date(metricCounts.lastUpdated).toLocaleString() : 'Never'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Metric Coverage:</p>
            <div className="grid grid-cols-4 gap-2">
              <Badge variant={metricCounts.ppsf === polygonCount ? 'default' : 'destructive'}>
                Price/sqft: {metricCounts.ppsf}
              </Badge>
              <Badge variant={metricCounts.yield > 0 ? 'default' : 'destructive'}>
                Yield: {metricCounts.yield}
              </Badge>
              <Badge variant={metricCounts.growth > 0 ? 'default' : 'destructive'}>
                Growth: {metricCounts.growth}
              </Badge>
              <Badge variant={metricCounts.schools > 0 ? 'default' : 'destructive'}>
                Schools: {metricCounts.schools}
              </Badge>
              <Badge variant={metricCounts.green > 0 ? 'default' : 'destructive'}>
                Green: {metricCounts.green}
              </Badge>
              <Badge variant={metricCounts.noise > 0 ? 'default' : 'destructive'}>
                Noise/Air: {metricCounts.noise}
              </Badge>
              <Badge variant={metricCounts.crime > 0 ? 'default' : 'destructive'}>
                Crime: {metricCounts.crime}
              </Badge>
            </div>
          </div>

          {hasWarnings && (
            <Alert variant="destructive">
              <AlertDescription>
                {polygonCount === 0 && 'No MSOA polygons loaded. '}
                {metricCounts.ppsf === 0 && 'No price/sqft metrics computed. '}
                {metricCounts.ppsf > 0 && metricCounts.ppsf !== polygonCount && 'Metric count mismatch with polygons. '}
                Please run the necessary functions below.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. <strong>Fetch Boundaries</strong> first to load ~983 London MSOAs</p>
          <p>2. <strong>Run Computation</strong> to calculate price/sqft metrics</p>
          <p>3. Optionally fetch other metrics (Crime, Growth, Air, Schools, Yield, Green)</p>
          <p>4. Go to <strong>Live Analysis</strong> page to view results</p>
          <p className="text-muted-foreground pt-2">Or click "Initialize London Data" button above to run all steps automatically.</p>
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

        <Card>
          <CardHeader>
            <CardTitle>Crime Data</CardTitle>
            <CardDescription>Fetch crime statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleFetchCrime}
              disabled={isFetchingCrime}
              className="w-full"
            >
              {isFetchingCrime && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Fetch Crime
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Data</CardTitle>
            <CardDescription>Fetch 12m growth estimates</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleFetchGrowth}
              disabled={isFetchingGrowth}
              className="w-full"
            >
              {isFetchingGrowth && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Fetch Growth
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Air Quality</CardTitle>
            <CardDescription>Fetch air quality data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleFetchAir}
              disabled={isFetchingAir}
              className="w-full"
            >
              {isFetchingAir && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Fetch Air Quality
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schools</CardTitle>
            <CardDescription>Fetch school ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleFetchSchools}
              disabled={isFetchingSchools}
              className="w-full"
            >
              {isFetchingSchools && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Fetch Schools
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yield Data</CardTitle>
            <CardDescription>Fetch rental yield estimates</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleFetchYield}
              disabled={isFetchingYield}
              className="w-full"
            >
              {isFetchingYield && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Fetch Yield
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Green Space</CardTitle>
            <CardDescription>Fetch green space data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleFetchGreen}
              disabled={isFetchingGreen}
              className="w-full"
            >
              {isFetchingGreen && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Fetch Green Space
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;