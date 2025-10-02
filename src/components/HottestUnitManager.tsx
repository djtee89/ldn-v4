import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Flame, Zap, RotateCcw } from 'lucide-react';
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
              <p className="text-sm text-muted-foreground">
                <strong>Reason:</strong> {currentHottest.override_reason}
              </p>
            )}
            {currentHottest.units && (
              <div className="text-sm text-muted-foreground">
                £{currentHottest.units.price?.toLocaleString()} • {currentHottest.units.beds} bed • {currentHottest.units.size_sqft} sqft
              </div>
            )}
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
