import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Flame, Zap, RotateCcw, Upload, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HottestUnitManagerProps {
  devId: string;
}

export function HottestUnitManager({ devId }: HottestUnitManagerProps) {
  const [units, setUnits] = useState<any[]>([]);
  const [currentHottest, setCurrentHottest] = useState<any>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [floorplanFile, setFloorplanFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUnits();
    fetchCurrentHottest();
  }, [devId]);

  const fetchUnits = async () => {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('dev_id', devId)
      .eq('status', 'Available')
      .order('price');

    if (!error && data) {
      setUnits(data);
    }
  };

  const fetchCurrentHottest = async () => {
    const { data, error } = await supabase
      .from('hottest_unit')
      .select('*, units(*)')
      .eq('dev_id', devId)
      .maybeSingle();

    if (!error && data) {
      setCurrentHottest(data);
    }
  };

  const handleManualOverride = async () => {
    if (!selectedUnitId) {
      toast({
        title: 'Error',
        description: 'Please select a unit',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('hot-override', {
        body: {
          dev_id: devId,
          unit_id: selectedUnitId,
          note: overrideReason,
        },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Hottest unit updated with manual override',
      });

      fetchCurrentHottest();
      setOverrideReason('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAutoCalculate = async () => {
    setLoading(true);
    try {
      // Clear the manual override first
      const { error: deleteError } = await supabase
        .from('hottest_unit')
        .delete()
        .eq('dev_id', devId);

      if (deleteError) throw deleteError;

      // Run auto calculation
      const { data, error } = await supabase.functions.invoke('hot-auto', {
        body: { dev_id: devId },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Hottest unit recalculated automatically',
      });

      fetchCurrentHottest();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFloorplanUpload = async () => {
    if (!floorplanFile || !currentHottest) {
      toast({
        title: 'Error',
        description: 'Please select a floorplan file',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      // Upload to storage
      const fileExt = floorplanFile.name.split('.').pop();
      const fileName = `${devId}_hottest_floorplan.${fileExt}`;
      const filePath = `floorplans/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('developments')
        .upload(filePath, floorplanFile, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('developments')
        .getPublicUrl(filePath);

      // Update hottest_unit record
      const { error: updateError } = await supabase
        .from('hottest_unit')
        .update({ floorplan_url: publicUrl })
        .eq('dev_id', devId);

      if (updateError) throw updateError;

      toast({
        title: 'Success',
        description: 'Floorplan uploaded successfully',
      });

      setFloorplanFile(null);
      fetchCurrentHottest();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFloorplan = async () => {
    if (!currentHottest) return;

    try {
      const { error } = await supabase
        .from('hottest_unit')
        .update({ floorplan_url: null })
        .eq('dev_id', devId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Floorplan removed',
      });

      fetchCurrentHottest();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Hottest Unit
        </CardTitle>
        <CardDescription>
          Manually override or auto-calculate the best-value unit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current hottest unit display */}
        {currentHottest && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Current: Unit {currentHottest.units?.unit_number}</span>
              </div>
              <div className="flex items-center gap-2">
                {currentHottest.manual_override ? (
                  <Badge variant="default" className="gap-1">
                    <Zap className="h-3 w-3" />
                    Manual Override
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <RotateCcw className="h-3 w-3" />
                    Auto-calculated
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  Score: {currentHottest.score}
                </span>
              </div>
            </div>
            {currentHottest.override_reason && (
              <div className="text-sm text-muted-foreground whitespace-pre-line bg-background/50 p-3 rounded border">
                {currentHottest.override_reason}
              </div>
            )}
            {currentHottest.units && (
              <div className="text-sm text-muted-foreground">
                £{currentHottest.units.price?.toLocaleString()} • {currentHottest.units.beds} bed • {currentHottest.units.size_sqft} sqft
              </div>
            )}
            
            {/* Floorplan section */}
            <div className="mt-4 pt-4 border-t">
              <Label className="text-sm font-medium">Floorplan</Label>
              {currentHottest.floorplan_url ? (
                <div className="mt-2 space-y-2">
                  <div className="relative">
                    <img 
                      src={currentHottest.floorplan_url} 
                      alt="Floorplan" 
                      className="w-full max-w-md rounded border"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveFloorplan}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setFloorplanFile(e.target.files?.[0] || null)}
                  />
                  <Button
                    onClick={handleFloorplanUpload}
                    disabled={uploading || !floorplanFile}
                    size="sm"
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Upload Floorplan'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manual override section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unit-select">Select Unit for Manual Override</Label>
            <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a unit..." />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    Unit {unit.unit_number} - {unit.beds} bed - £{unit.price?.toLocaleString()} - {unit.size_sqft} sqft
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Override (optional)</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Best river view, recently renovated, corner unit..."
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleManualOverride}
              disabled={loading || !selectedUnitId}
              className="flex-1 gap-2"
            >
              <Zap className="h-4 w-4" />
              Set Manual Override
            </Button>
            <Button
              onClick={handleAutoCalculate}
              variant="outline"
              disabled={loading}
              className="flex-1 gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Switch to Auto
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
