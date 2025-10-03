import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, MapPin, GraduationCap, Train } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EnrichmentManagerProps {
  devId: string;
}

export function EnrichmentManager({ devId }: EnrichmentManagerProps) {
  const queryClient = useQueryClient();
  const [options, setOptions] = useState({
    transport: true,
    amenities: true,
    summary: true,
  });

  const { data: development } = useQuery({
    queryKey: ['development', devId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developments')
        .select('*')
        .eq('id', devId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const enrichMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('enrich-development', {
        body: {
          dev_id: devId,
          enrich_transport: options.transport,
          enrich_amenities: options.amenities,
          generate_summary: options.summary,
        },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['development', devId] });
      queryClient.invalidateQueries({ queryKey: ['developments'] });
      
      const results = [];
      if (data.geocoded) results.push('Geocoded location');
      if (data.transport_added) results.push(`${data.transport_added} transport stations`);
      if (data.schools_added) results.push(`${data.schools_added} schools`);
      if (data.amenities_added) results.push(`Updated amenities`);
      if (data.summary_generated) results.push('Generated AI summary');
      
      toast.success(`Enrichment complete: ${results.join(', ')}`);
    },
    onError: (error: Error) => {
      toast.error(`Enrichment failed: ${error.message}`);
    },
  });

  const hasCoords = development?.lat && development?.lng;
  const hasStations = development?.stations && Array.isArray(development.stations) && development.stations.length > 0;
  const hasSchools = development?.schools && Array.isArray(development.schools) && development.schools.length > 0;
  const hasSummary = development?.summary;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrich Development Data</CardTitle>
        <CardDescription>
          Automatically fetch nearby transport, schools, and generate AI summaries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Current Status</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant={hasCoords ? "default" : "outline"}>
              <MapPin className="h-3 w-3 mr-1" />
              {hasCoords ? 'Has Coordinates' : 'No Coordinates'}
            </Badge>
            <Badge variant={hasStations ? "default" : "outline"}>
              <Train className="h-3 w-3 mr-1" />
              {hasStations && Array.isArray(development.stations) ? `${development.stations.length} Stations` : 'No Stations'}
            </Badge>
            <Badge variant={hasSchools ? "default" : "outline"}>
              <GraduationCap className="h-3 w-3 mr-1" />
              {hasSchools && Array.isArray(development.schools) ? `${development.schools.length} Schools` : 'No Schools'}
            </Badge>
            <Badge variant={hasSummary ? "default" : "outline"}>
              {hasSummary ? 'Has AI Summary' : 'No Summary'}
            </Badge>
          </div>
          
          {!hasCoords && development?.postcode && (
            <p className="text-sm text-muted-foreground">
              Postcode: <span className="font-mono">{development.postcode}</span> - Enrichment will geocode this
            </p>
          )}
        </div>

        {/* Enrichment Options */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Enrichment Options</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="transport"
                checked={options.transport}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, transport: checked as boolean })
                }
              />
              <Label htmlFor="transport" className="text-sm font-normal cursor-pointer">
                Fetch nearby transport stations (TfL API)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="amenities"
                checked={options.amenities}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, amenities: checked as boolean })
                }
              />
              <Label htmlFor="amenities" className="text-sm font-normal cursor-pointer">
                Fetch nearby schools & parks (OpenStreetMap API)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="summary"
                checked={options.summary}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, summary: checked as boolean })
                }
              />
              <Label htmlFor="summary" className="text-sm font-normal cursor-pointer">
                Generate AI summary
              </Label>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => enrichMutation.mutate()}
          disabled={enrichMutation.isPending || (!options.transport && !options.amenities && !options.summary)}
          className="w-full"
        >
          {enrichMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enriching Development...
            </>
          ) : (
            'Run Enrichment'
          )}
        </Button>

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
          <p>• Transport: Uses Transport for London (TfL) API to find nearby stations</p>
          <p>• Schools: Uses OpenStreetMap Overpass API to find nearby educational facilities</p>
          <p>• Summary: Uses Lovable AI to generate a property overview</p>
          <p>• If coordinates are missing, will attempt to geocode using postcode</p>
        </div>
      </CardContent>
    </Card>
  );
}
