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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Admin</h1>
        <p className="text-muted-foreground">
          Manage and compute area metrics for the Live Analysis feature
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Compute Metrics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Compute Area Metrics
            </CardTitle>
            <CardDescription>
              Calculate price/sqft metrics from available units grouped by postcode sectors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This will analyze all available units and compute:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                <li>Price per sqft by bedroom count (1-3 bed)</li>
                <li>Overall median price per sqft</li>
                <li>Area boundaries and center points</li>
                <li>Sample sizes for each area</li>
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

        {/* External Data Integration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              External Data Sources
            </CardTitle>
            <CardDescription>
              Integrate live data from external APIs for full London coverage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium mb-2">Required integrations:</p>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">
                  Yield: VOA/ONS rental data
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  Growth: Land Registry PPD
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  Schools: Ofsted API
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  Green Space: OSM/GLA data
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  Air Quality: DEFRA API
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  Crime: Met Police API
                </Badge>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              These require separate ETL pipelines and API integrations. Contact your developer to implement.
            </p>
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
            <p className="font-medium text-foreground mb-1">Step 1: Internal Data (Price/sqft)</p>
            <p>Uses your existing units data to calculate median price per sqft for each postcode sector. This gives you immediate heatmaps based on your actual inventory.</p>
          </div>
          
          <div>
            <p className="font-medium text-foreground mb-1">Step 2: External Data Integration</p>
            <p>To populate yield, growth, schools, green space, air quality, and crime data, you need to integrate with external APIs. Each requires:</p>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>API authentication setup</li>
              <li>Data transformation pipelines</li>
              <li>Polygon boundary data for London</li>
              <li>Regular refresh schedules</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-foreground mb-1">Step 3: Scheduled Updates</p>
            <p>Set up nightly cron jobs to refresh the data automatically.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
