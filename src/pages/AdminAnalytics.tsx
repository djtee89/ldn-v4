import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, AlertCircle, AlertTriangle, CheckCircle2, Play } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

export default function AdminAnalytics() {
  const [isFetchingBoundaries, setIsFetchingBoundaries] = useState(false);
  const [isFetchingWards, setIsFetchingWards] = useState(false);
  const [isComputingPragmatic, setIsComputingPragmatic] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isMappingNeighbourhoods, setIsMappingNeighbourhoods] = useState(false);
  
  const [status, setStatus] = useState({
    polygonCount: 0,
    wardCount: 0,
    priceMetricCount: 0,
    lastUpdated: null as string | null,
    missingAreaCodes: [] as string[],
    neighbourhoodCount: 0,
    neighbourhoodMappedCount: 0,
  });

  const fetchStatus = async () => {
    try {
      const { count: polyCount } = await supabase
        .from('area_polygons')
        .select('*', { count: 'exact', head: true })
        .eq('area_type', 'Borough');

      const { count: wardCount } = await supabase
        .from('area_polygons')
        .select('*', { count: 'exact', head: true })
        .eq('area_type', 'Ward');

      const { count: metricCount } = await supabase
        .from('area_metrics')
        .select('*', { count: 'exact', head: true })
        .eq('area_type', 'Borough')
        .not('price_per_sqft_overall', 'is', null);

      const { data: latestMetric } = await supabase
        .from('area_metrics')
        .select('last_updated')
        .eq('area_type', 'Borough')
        .not('price_per_sqft_overall', 'is', null)
        .order('last_updated', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: allPolygons } = await supabase
        .from('area_polygons')
        .select('area_code')
        .eq('area_type', 'Borough');

      const { data: metricsWithData } = await supabase
        .from('area_metrics')
        .select('area_code')
        .eq('area_type', 'Borough')
        .not('price_per_sqft_overall', 'is', null);

      const metricCodes = new Set(metricsWithData?.map(m => m.area_code) || []);
      const missingCodes = allPolygons?.filter(p => !metricCodes.has(p.area_code)).map(p => p.area_code) || [];

      const { count: neighbourhoodCount } = await supabase
        .from('neighbourhoods')
        .select('*', { count: 'exact', head: true });

      const { count: neighbourhoodMappedCount } = await supabase
        .from('neighbourhood_polygons')
        .select('*', { count: 'exact', head: true })
        .not('union_geometry', 'is', null);

      setStatus({
        polygonCount: polyCount || 0,
        wardCount: wardCount || 0,
        priceMetricCount: metricCount || 0,
        lastUpdated: latestMetric?.last_updated || null,
        missingAreaCodes: missingCodes.slice(0, 5),
        neighbourhoodCount: neighbourhoodCount || 0,
        neighbourhoodMappedCount: neighbourhoodMappedCount || 0,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFetchBoundaries = async () => {
    setIsFetchingBoundaries(true);
    try {
      await supabase.functions.invoke('fetch-area-boundaries');
      toast.success('Boundaries fetched');
      await fetchStatus();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsFetchingBoundaries(false);
    }
  };

  const handleComputePragmatic = async () => {
    setIsComputingPragmatic(true);
    try {
      await supabase.functions.invoke('compute-pragmatic-price');
      toast.success('Computed £/ft²');
      await fetchStatus();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsComputingPragmatic(false);
    }
  };

  const handleMapNeighbourhoods = async () => {
    setIsMappingNeighbourhoods(true);
    try {
      const { data, error } = await supabase.functions.invoke('map-neighbourhoods');
      if (error) throw error;
      toast.success(`Mapped ${data.neighbourhoods_mapped} neighbourhoods`);
      await fetchStatus();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsMappingNeighbourhoods(false);
    }
  };

  const handleFetchWards = async () => {
    setIsFetchingWards(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-ward-boundaries');
      if (error) throw error;
      toast.success(`Fetched ${data.wards_fetched} ward boundaries`);
      await fetchStatus();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsFetchingWards(false);
    }
  };

    const handleInitializeAll = async () => {
    setIsInitializing(true);
    try {
      toast.info('Step 1/3: Fetching boroughs...');
      await handleFetchBoundaries();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.info('Step 2/3: Computing prices...');
      await handleComputePragmatic();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.info('Step 3/3: Mapping neighbourhoods...');
      await handleMapNeighbourhoods();
      
      toast.success('Initialized with local data!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm">
          Using local boundaries; cloud fetch disabled to save tokens. Ward data will be loaded from local files.
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Analytics</h1>
          <p className="text-muted-foreground">Borough & Neighbourhood data (Local Mode)</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/neighbourhoods">
            <Button variant="outline">Manage Neighbourhoods</Button>
          </Link>
          <Button onClick={handleInitializeAll} disabled={isInitializing}>
            {isInitializing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Initialize (Local)
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Borough Polygons</p>
              <p className="text-2xl font-bold">{status.polygonCount}/33</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ward Polygons</p>
              <p className="text-2xl font-bold">{status.wardCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">£/ft² Metrics</p>
              <p className="text-2xl font-bold">{status.priceMetricCount}/33</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Neighbourhoods</h3>
            <p className="text-sm">Total: {status.neighbourhoodCount}</p>
            <p className="text-sm">Mapped: {status.neighbourhoodMappedCount}</p>
            <Button 
              onClick={handleMapNeighbourhoods} 
              disabled={isMappingNeighbourhoods}
              size="sm"
              className="mt-2"
            >
              {isMappingNeighbourhoods && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Auto-Map Neighbourhoods
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Fetch Boroughs</CardTitle>
            <CardDescription>Load from local file</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleFetchBoundaries} disabled={isFetchingBoundaries} className="w-full">
              {isFetchingBoundaries && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Load Local (33)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Load Wards</CardTitle>
            <CardDescription>From local GeoJSON</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleFetchWards} disabled={true} className="w-full" title="Disabled - awaiting local ward file">
              Load Local (~600)
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Local file pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compute £/ft²</CardTitle>
            <CardDescription>From development data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleComputePragmatic} disabled={isComputingPragmatic} className="w-full">
              {isComputingPragmatic && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Compute
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
