import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Play, Database, Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminAnalytics = () => {
  const { toast } = useToast();
  const [isComputing, setIsComputing] = useState(false);
  const [isFetchingCrime, setIsFetchingCrime] = useState(false);
  const [isFetchingGrowth, setIsFetchingGrowth] = useState(false);
  const [isFetchingAirQuality, setIsFetchingAirQuality] = useState(false);
  const [isFetchingSchools, setIsFetchingSchools] = useState(false);
  const [isFetchingYield, setIsFetchingYield] = useState(false);
  const [isFetchingGreenSpace, setIsFetchingGreenSpace] = useState(false);
  const [isFetchingBoundaries, setIsFetchingBoundaries] = useState(false);

  const handleComputeMetrics = async () => {
    setIsComputing(true);
    try {
      const { data, error } = await supabase.functions.invoke('compute-area-metrics', {
        body: { force_refresh: true },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Computed metrics for ${data.areas_computed} areas`,
      });
    } catch (error) {
      console.error('Error computing metrics:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to compute metrics',
        variant: "destructive",
      });
    } finally {
      setIsComputing(false);
    }
  };

  const handleFetchCrime = async () => {
    setIsFetchingCrime(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-crime-data');

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Updated crime data for ${data.areas_updated} areas`,
      });
    } catch (error) {
      console.error('Error fetching crime data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch crime data',
        variant: "destructive",
      });
    } finally {
      setIsFetchingCrime(false);
    }
  };

  const handleFetchGrowth = async () => {
    setIsFetchingGrowth(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-growth-data');

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Updated growth data for ${data.areas_updated} areas`,
      });
    } catch (error) {
      console.error('Error fetching growth data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch growth data',
        variant: "destructive",
      });
    } finally {
      setIsFetchingGrowth(false);
    }
  };

  const handleFetchAirQuality = async () => {
    setIsFetchingAirQuality(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-air-quality-data');

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Updated air quality data for ${data.areas_updated} areas`,
      });
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch air quality data',
        variant: "destructive",
      });
    } finally {
      setIsFetchingAirQuality(false);
    }
  };

  const handleFetchSchools = async () => {
    setIsFetchingSchools(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-schools-data');

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Updated schools data for ${data.areas_updated} areas`,
      });
    } catch (error) {
      console.error('Error fetching schools data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch schools data',
        variant: "destructive",
      });
    } finally {
      setIsFetchingSchools(false);
    }
  };

  const handleFetchYield = async () => {
    setIsFetchingYield(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-yield-data');

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Updated yield data for ${data.areas_updated} areas`,
      });
    } catch (error) {
      console.error('Error fetching yield data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch yield data',
        variant: "destructive",
      });
    } finally {
      setIsFetchingYield(false);
    }
  };

  const handleFetchGreenSpace = async () => {
    setIsFetchingGreenSpace(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-greenspace-data');
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: data.message || `Updated green space data for ${data.areas_updated} areas`,
      });
    } catch (error) {
      console.error('Error fetching green space data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch green space data',
        variant: "destructive",
      });
    } finally {
      setIsFetchingGreenSpace(false);
    }
  };

  const handleFetchBoundaries = async () => {
    setIsFetchingBoundaries(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-area-boundaries');
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: data.message || `Fetched boundaries for ${data.areas_processed} areas`,
      });
    } catch (error) {
      console.error('Error fetching area boundaries:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch area boundaries',
        variant: "destructive",
      });
    } finally {
      setIsFetchingBoundaries(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Admin</h1>
        <p className="text-muted-foreground">
          Manage and compute area metrics for the Live Analysis feature
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Compute Metrics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Compute Area Metrics
            </CardTitle>
            <CardDescription>
              Calculate price/sqft metrics from available units
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Analyzes all available units to compute:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                <li>Price per sqft by bedroom count</li>
                <li>Overall median price per sqft</li>
                <li>Area boundaries and centers</li>
              </ul>
            </div>
            
            <Button
              onClick={handleComputeMetrics}
              disabled={isComputing}
              className="w-full"
            >
              {isComputing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Computing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Computation
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Crime Data Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Crime Data
            </CardTitle>
            <CardDescription>
              Fetch crime statistics from Police.uk
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Fetches latest crime data:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                <li>Last month's crime counts</li>
                <li>Crimes per 1,000 residents</li>
                <li>Crime category rating</li>
              </ul>
            </div>
            
            <Button
              onClick={handleFetchCrime}
              disabled={isFetchingCrime}
              className="w-full"
            >
              {isFetchingCrime ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Fetch Crime Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Growth Data Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Growth Data
            </CardTitle>
            <CardDescription>
              Calculate 12-month price appreciation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Estimates price growth:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                <li>12-month price change %</li>
                <li>Growth rank category</li>
                <li>Based on area patterns</li>
              </ul>
            </div>
            
            <Button
              onClick={handleFetchGrowth}
              disabled={isFetchingGrowth}
              className="w-full"
            >
              {isFetchingGrowth ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Fetch Growth Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Air Quality Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Air Quality
            </CardTitle>
            <CardDescription>
              Fetch air quality from OpenAQ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Fetches air quality metrics:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                <li>PM2.5 and NO2 levels</li>
                <li>WHO guideline comparison</li>
                <li>Good/Fair/Poor rating</li>
              </ul>
            </div>
            
            <Button
              onClick={handleFetchAirQuality}
              disabled={isFetchingAirQuality}
              className="w-full"
            >
              {isFetchingAirQuality ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Fetch Air Quality
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Schools Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Schools Data
            </CardTitle>
            <CardDescription>
              Outstanding schools within 1km radius
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Calculates school quality:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                <li>Outstanding primary schools</li>
                <li>Outstanding secondary schools</li>
                <li>Overall schools score (0-100)</li>
              </ul>
            </div>
            
            <Button
              onClick={handleFetchSchools}
              disabled={isFetchingSchools}
              className="w-full"
            >
              {isFetchingSchools ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Fetch Schools Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Yield Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Rental Yield
            </CardTitle>
            <CardDescription>
              Estimated rental yields by bedroom count
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Estimates rental returns:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                <li>1-bed yield percentage</li>
                <li>2-bed yield percentage</li>
                <li>3-bed yield percentage</li>
              </ul>
            </div>
            
            <Button
              onClick={handleFetchYield}
              disabled={isFetchingYield}
              className="w-full"
            >
              {isFetchingYield ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Fetch Yield Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Green Space Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Green Space
            </CardTitle>
            <CardDescription>
              Parks and green areas from OpenStreetMap
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Analyzes green space:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                <li>Parks count within 1km</li>
                <li>Green space percentage</li>
                <li>OSM data integration</li>
              </ul>
            </div>
            
            <Button
              onClick={handleFetchGreenSpace}
              disabled={isFetchingGreenSpace}
              className="w-full"
            >
              {isFetchingGreenSpace ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Fetch Green Space
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Area Boundaries Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Area Boundaries
              <Badge variant="secondary">Required</Badge>
            </CardTitle>
            <CardDescription>
              Fetch polygon boundaries for map visualization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Fetches area polygons:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                <li>Postcode sector boundaries</li>
                <li>GeoJSON polygon data</li>
                <li>Required for map display</li>
              </ul>
            </div>
            
            <Button
              onClick={handleFetchBoundaries}
              disabled={isFetchingBoundaries}
              className="w-full"
              variant="default"
            >
              {isFetchingBoundaries ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Fetch Boundaries
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-1">Step 1: Compute Price/Sqft Metrics</p>
            <p>Click "Run Computation" to analyze your units and calculate median price per sqft for each postcode sector. This creates the foundation for your heatmaps.</p>
          </div>
          
          <div>
            <p className="font-medium text-foreground mb-1">Step 2: Fetch Area Boundaries (REQUIRED)</p>
            <p>⚠️ <strong>Click "Fetch Boundaries" first!</strong> This fetches the polygon shapes needed to display areas on the map. Without this, the map will be empty.</p>
          </div>

          <div>
            <p className="font-medium text-foreground mb-1">Step 3: Fetch All External Data</p>
            <p>Click each button to populate all 7 metrics with real and estimated data:</p>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>Crime:</strong> Police.uk API - real-time crime statistics</li>
              <li><strong>Growth:</strong> Estimated 12-month price appreciation patterns</li>
              <li><strong>Air Quality:</strong> OpenAQ API - PM2.5 and NO2 levels</li>
              <li><strong>Schools:</strong> Outstanding schools count and quality score</li>
              <li><strong>Yield:</strong> Estimated rental yields by bedroom count</li>
              <li><strong>Green Space:</strong> OpenStreetMap - parks and green area %</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-foreground mb-1">Step 4: View Live Analysis</p>
            <p>Once data is populated, navigate to the Live Analysis page to explore interactive heatmaps across all 7 metrics. Switch between Price/Sqft, Yield, Growth, Schools, Green, Air, and Crime views.</p>
          </div>

          <div>
            <p className="font-medium text-foreground mb-1">Next Steps: Real Data Integration</p>
            <p>For production use, enhance with official APIs:</p>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>Growth:</strong> Land Registry Price Paid Data (historical transactions)</li>
              <li><strong>Schools:</strong> Ofsted API + Get Information About Schools</li>
              <li><strong>Yield:</strong> Rightmove/Zoopla rental data + VOA statistics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
