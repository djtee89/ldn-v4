import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Trash2, Eye, EyeOff } from 'lucide-react';

interface BestDeal {
  id: string;
  dev_id: string;
  unit_id: string;
  display_order: number;
  active: boolean;
  published_at: string;
  developments: {
    name: string;
    location: string;
  };
  units: {
    unit_number: string;
    beds: number;
    price: number;
    size_sqft: number;
  };
}

export const BestDealsManager = () => {
  const [selectedDevId, setSelectedDevId] = useState<string>('');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch all developments
  const { data: developments } = useQuery({
    queryKey: ['developments-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developments')
        .select('id, name, location')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Fetch units for selected development
  const { data: units } = useQuery({
    queryKey: ['units-for-dev', selectedDevId],
    queryFn: async () => {
      if (!selectedDevId) return [];
      const { data, error } = await supabase
        .from('units')
        .select('id, unit_number, beds, price, size_sqft, status')
        .eq('dev_id', selectedDevId)
        .eq('status', 'Available')
        .order('price');
      if (error) throw error;
      return data;
    },
    enabled: !!selectedDevId
  });

  // Fetch existing best deals
  const { data: bestDeals } = useQuery({
    queryKey: ['best-deals-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('best_deals')
        .select(`
          *,
          developments (name, location),
          units (unit_number, beds, price, size_sqft)
        `)
        .order('display_order');
      if (error) throw error;
      return data as BestDeal[];
    }
  });

  // Publish a new best deal
  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDevId || !selectedUnitId) {
        throw new Error('Please select both development and unit');
      }

      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('best_deals')
        .insert({
          dev_id: selectedDevId,
          unit_id: selectedUnitId,
          published_by: user.user?.id,
          active: true,
          display_order: (bestDeals?.length || 0) + 1
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['best-deals-admin'] });
      queryClient.invalidateQueries({ queryKey: ['best-deals-public'] });
      setSelectedDevId('');
      setSelectedUnitId('');
      toast.success('Best deal published successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to publish best deal');
    }
  });

  // Toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('best_deals')
        .update({ active: !active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['best-deals-admin'] });
      queryClient.invalidateQueries({ queryKey: ['best-deals-public'] });
      toast.success('Status updated');
    }
  });

  // Delete best deal
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('best_deals')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['best-deals-admin'] });
      queryClient.invalidateQueries({ queryKey: ['best-deals-public'] });
      toast.success('Best deal removed');
    }
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Publish New Best Deal</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Development</label>
            <Select value={selectedDevId} onValueChange={(value) => {
              setSelectedDevId(value);
              setSelectedUnitId('');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a development" />
              </SelectTrigger>
              <SelectContent>
                {developments?.map((dev) => (
                  <SelectItem key={dev.id} value={dev.id}>
                    {dev.name} - {dev.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDevId && (
            <div>
              <label className="text-sm font-medium mb-2 block">Select Unit</label>
              <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a unit" />
                </SelectTrigger>
                <SelectContent>
                  {units?.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      Unit {unit.unit_number} - {unit.beds} bed - £{unit.price.toLocaleString()} - {unit.size_sqft} sqft
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={() => publishMutation.mutate()}
            disabled={!selectedDevId || !selectedUnitId || publishMutation.isPending}
            className="w-full"
          >
            {publishMutation.isPending ? 'Publishing...' : 'Publish Best Deal'}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Best Deals ({bestDeals?.length || 0})</h3>
        
        <div className="space-y-3">
          {bestDeals?.map((deal) => (
            <div
              key={deal.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium">{deal.developments.name}</div>
                <div className="text-sm text-muted-foreground">
                  Unit {deal.units.unit_number} • {deal.units.beds} bed • £{deal.units.price.toLocaleString()} • {deal.units.size_sqft} sqft
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {deal.developments.location}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActiveMutation.mutate({ id: deal.id, active: deal.active })}
                >
                  {deal.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm('Remove this best deal?')) {
                      deleteMutation.mutate(deal.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}

          {(!bestDeals || bestDeals.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              No best deals published yet
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
