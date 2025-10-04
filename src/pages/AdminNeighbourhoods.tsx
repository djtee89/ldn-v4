import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNeighbourhoods } from '@/hooks/use-neighbourhoods';
import { useAreaPolygons } from '@/hooks/use-area-metrics';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AdminNeighbourhoods() {
  const [selectedBorough, setSelectedBorough] = useState<string>('');
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedPolygonIds, setSelectedPolygonIds] = useState<string[]>([]);

  const { data: neighbourhoods, isLoading: loadingNeighbourhoods } = useNeighbourhoods();
  const { data: areaPolygons, isLoading: loadingPolygons } = useAreaPolygons();

  const boroughs = [...new Set(neighbourhoods?.map(n => n.borough) || [])].sort();
  const filteredNeighbourhoods = neighbourhoods?.filter(
    n => (!selectedBorough || n.borough === selectedBorough) &&
         (!searchTerm || n.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveMapping = async () => {
    if (!selectedNeighbourhood || selectedPolygonIds.length === 0) {
      toast.error('Select a neighbourhood and at least one polygon');
      return;
    }

    setSaving(true);
    try {
      // Check for overlaps
      const { data: existing } = await supabase
        .from('neighbourhood_polygons')
        .select('polygon_ids, neighbourhoods!inner(name, borough)')
        .neq('neighbourhood_id', selectedNeighbourhood);

      const overlaps = existing?.filter((np: any) => {
        const existingIds = np.polygon_ids || [];
        return selectedPolygonIds.some(id => existingIds.includes(id));
      });

      if (overlaps && overlaps.length > 0) {
        toast.error(`Polygon already assigned to ${overlaps[0].neighbourhoods.name}`);
        setSaving(false);
        return;
      }

      // Upsert mapping
      const { error } = await supabase
        .from('neighbourhood_polygons')
        .upsert({
          neighbourhood_id: selectedNeighbourhood,
          polygon_ids: selectedPolygonIds,
          area_type: 'Ward',
        }, { onConflict: 'neighbourhood_id' });

      if (error) throw error;

      toast.success('Mapping saved');
      setSelectedPolygonIds([]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUnionAndPublish = async () => {
    toast.info('Union & publish feature coming soon');
  };

  if (loadingNeighbourhoods || loadingPolygons) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Neighbourhood Polygon Binding</h1>
        <p className="text-muted-foreground">Map ward/MSOA polygons to neighbourhoods for clean choropleth rendering</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Select Neighbourhood</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Borough</label>
              <Select value={selectedBorough} onValueChange={setSelectedBorough}>
                <SelectTrigger>
                  <SelectValue placeholder="All boroughs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All boroughs</SelectItem>
                  {boroughs.map(borough => (
                    <SelectItem key={borough} value={borough}>{borough}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search neighbourhoods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredNeighbourhoods?.map(n => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNeighbourhood(n.id)}
                  className={`p-3 rounded border cursor-pointer transition-colors ${
                    selectedNeighbourhood === n.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="font-medium">{n.name}</div>
                  <div className="text-sm text-muted-foreground">{n.borough}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Assign Polygons</h2>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select ward/MSOA polygons for this neighbourhood. Each polygon can only belong to one neighbourhood.
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {areaPolygons?.filter(p => p.area_type === 'Ward').map(polygon => (
                <div
                  key={polygon.id}
                  onClick={() => {
                    setSelectedPolygonIds(prev =>
                      prev.includes(polygon.area_code)
                        ? prev.filter(id => id !== polygon.area_code)
                        : [...prev, polygon.area_code]
                    );
                  }}
                  className={`p-3 rounded border cursor-pointer transition-colors ${
                    selectedPolygonIds.includes(polygon.area_code)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="font-medium">{polygon.area_name}</div>
                  <div className="text-xs text-muted-foreground">{polygon.area_code}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSaveMapping}
                disabled={!selectedNeighbourhood || selectedPolygonIds.length === 0 || saving}
                className="flex-1"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Mapping ({selectedPolygonIds.length})
              </Button>
              <Button onClick={handleUnionAndPublish} variant="outline">
                Union & Publish
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Select a neighbourhood from the left panel</li>
          <li>Click ward/MSOA polygons to assign them to that neighbourhood</li>
          <li>Save mapping (enforces non-overlap within borough)</li>
          <li>Use "Union & Publish" to generate cached GeoJSON unions for fast map rendering</li>
        </ol>
      </Card>
    </div>
  );
}
