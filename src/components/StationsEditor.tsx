import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Train } from 'lucide-react';

interface Station {
  name: string;
  walk_minutes: number;
}

interface StationsEditorProps {
  stations: Station[];
  onChange: (stations: Station[]) => void;
}

export function StationsEditor({ stations, onChange }: StationsEditorProps) {
  const [newStation, setNewStation] = useState<Station>({ name: '', walk_minutes: 0 });

  const handleAdd = () => {
    if (!newStation.name || newStation.walk_minutes <= 0) return;
    onChange([...stations, newStation]);
    setNewStation({ name: '', walk_minutes: 0 });
  };

  const handleRemove = (index: number) => {
    onChange(stations.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: keyof Station, value: string | number) => {
    const updated = [...stations];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Train className="h-5 w-5" />
          Nearby Stations
        </CardTitle>
        <CardDescription>Add tube/rail stations and walking times</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing stations */}
        <div className="space-y-2">
          {stations.map((station, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={station.name}
                onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                placeholder="Station name"
                className="flex-1"
              />
              <Input
                type="number"
                value={station.walk_minutes}
                onChange={(e) => handleUpdate(index, 'walk_minutes', parseInt(e.target.value)) }
                placeholder="Minutes"
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">min</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add new station */}
        <div className="space-y-3 pt-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="new-station-name">Station Name</Label>
              <Input
                id="new-station-name"
                value={newStation.name}
                onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
                placeholder="e.g., Fulham Broadway"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-station-walk">Walk Time (minutes)</Label>
              <Input
                id="new-station-walk"
                type="number"
                value={newStation.walk_minutes || ''}
                onChange={(e) => setNewStation({ ...newStation, walk_minutes: parseInt(e.target.value) || 0 })}
                placeholder="5"
              />
            </div>
          </div>
          <Button
            onClick={handleAdd}
            disabled={!newStation.name || newStation.walk_minutes <= 0}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Station
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
