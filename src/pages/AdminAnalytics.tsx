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

        {/* Schools & Yield Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Schools & Yield
            </CardTitle>
            <CardDescription>
              Coming soon - requires complex geospatial processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium mb-2">Next integrations:</p>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">
                  Schools: Ofsted API + proximity calc
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  Yield: Rental data APIs
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  Green Space: OSM processing
                </Badge>
              </div>
            </div>
            
            <Button disabled className="w-full">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
        
        {/* Green Space Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Green Space
            </CardTitle>
            <CardDescription>
              OpenStreetMap data processing required
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Requires geospatial processing:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                <li>OSM park/green space polygons</li>
                <li>Area intersection calculations</li>
                <li>Green space percentage</li>
              </ul>
            </div>
            
            <Button disabled className="w-full">
              Coming Soon
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
            <p className="font-medium text-foreground mb-1">Step 2: Fetch External Data</p>
            <p>Click each data source button to fetch live data from public APIs:</p>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>Crime:</strong> Police.uk API (free, real-time)</li>
              <li><strong>Growth:</strong> Estimated based on area patterns</li>
              <li><strong>Air Quality:</strong> OpenAQ API (free, real-time)</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-foreground mb-1">Step 3: Coming Soon</p>
            <p>Schools, Yield, and Green Space data require additional complex processing:</p>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>Schools:</strong> Ofsted API + proximity calculations</li>
              <li><strong>Yield:</strong> Rental data APIs + market analysis</li>
              <li><strong>Green Space:</strong> OpenStreetMap geospatial processing</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-foreground mb-1">Step 4: View Live Analysis</p>
            <p>Once data is populated, navigate to the Live Analysis page to explore interactive heatmaps across all 7 metrics.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
