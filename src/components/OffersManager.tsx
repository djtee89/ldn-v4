import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Trash2, Eye, EyeOff, Plus, Tag, Pencil } from 'lucide-react';

interface Offer {
  id: string;
  dev_id: string;
  offer_title: string;
  offer_description: string | null;
  voucher_code: string;
  savings_amount: string | null;
  terms: any;
  active: boolean;
  expiry_date: string | null;
  image_url: string | null;
  developments: {
    name: string;
    location: string;
  };
}

export const OffersManager = () => {
  const [showNewOffer, setShowNewOffer] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDevId, setSelectedDevId] = useState<string>('');
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    voucher_code: '',
    savings_amount: '',
    expiry_date: '',
    terms: [] as string[],
    image_url: ''
  });
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

  // Fetch existing offers
  const { data: offers } = useQuery({
    queryKey: ['offers-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('development_offers')
        .select(`
          *,
          developments (name, location)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Offer[];
    }
  });

  // Create or update offer
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDevId || !newOffer.title || !newOffer.voucher_code) {
        throw new Error('Please fill in all required fields');
      }

      const offerData = {
        dev_id: selectedDevId,
        offer_title: newOffer.title,
        offer_description: newOffer.description || null,
        voucher_code: newOffer.voucher_code,
        savings_amount: newOffer.savings_amount || null,
        expiry_date: newOffer.expiry_date || null,
        terms: newOffer.terms.length > 0 ? newOffer.terms : [],
        image_url: newOffer.image_url || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('development_offers')
          .update(offerData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('development_offers')
          .insert({ ...offerData, active: true });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers-admin'] });
      queryClient.invalidateQueries({ queryKey: ['offers-public'] });
      setShowNewOffer(false);
      setEditingId(null);
      setSelectedDevId('');
      setNewOffer({
        title: '',
        description: '',
        voucher_code: '',
        savings_amount: '',
        expiry_date: '',
        terms: [],
        image_url: ''
      });
      toast.success(editingId ? 'Offer updated successfully' : 'Offer created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save offer');
    }
  });

  // Toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('development_offers')
        .update({ active: !active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers-admin'] });
      queryClient.invalidateQueries({ queryKey: ['offers-public'] });
      toast.success('Status updated');
    }
  });

  // Delete offer
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('development_offers')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers-admin'] });
      queryClient.invalidateQueries({ queryKey: ['offers-public'] });
      toast.success('Offer removed');
    }
  });

  return (
    <div className="space-y-6">
      {/* Add/Edit Offer Form */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{editingId ? 'Edit Offer' : 'Create New Offer'}</h3>
          <Button
            variant={showNewOffer ? "outline" : "default"}
            onClick={() => {
              setShowNewOffer(!showNewOffer);
              if (showNewOffer) {
                setEditingId(null);
                setSelectedDevId('');
                setNewOffer({
                  title: '',
                  description: '',
                  voucher_code: '',
                  savings_amount: '',
                  expiry_date: '',
                  terms: [],
                  image_url: ''
                });
              }
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {showNewOffer ? 'Cancel' : 'Add New Offer'}
          </Button>
        </div>

        {showNewOffer && (
          <div className="space-y-4">
            <div>
              <Label>Select Development *</Label>
              <Select value={selectedDevId} onValueChange={setSelectedDevId}>
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

            <div>
              <Label>Offer Title *</Label>
              <Input
                placeholder="e.g. 5% Stamp Duty Paid"
                value={newOffer.title}
                onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Offer Description</Label>
              <Textarea
                placeholder="Detailed description of the offer..."
                value={newOffer.description}
                onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Voucher Code *</Label>
                <Input
                  placeholder="e.g. SPRING2024"
                  value={newOffer.voucher_code}
                  onChange={(e) => setNewOffer({ ...newOffer, voucher_code: e.target.value.toUpperCase() })}
                />
              </div>

              <div>
                <Label>Savings Amount</Label>
                <Input
                  placeholder="e.g. Up to £15,000"
                  value={newOffer.savings_amount}
                  onChange={(e) => setNewOffer({ ...newOffer, savings_amount: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Offer Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  const fileExt = file.name.split('.').pop();
                  const fileName = `offer-${Date.now()}.${fileExt}`;
                  
                  const { data, error } = await supabase.storage
                    .from('development-images')
                    .upload(fileName, file);
                  
                  if (error) {
                    toast.error('Failed to upload image');
                    return;
                  }
                  
                  const { data: { publicUrl } } = supabase.storage
                    .from('development-images')
                    .getPublicUrl(fileName);
                  
                  setNewOffer({ ...newOffer, image_url: publicUrl });
                  toast.success('Image uploaded');
                }}
              />
              {newOffer.image_url && (
                <div className="mt-2">
                  <img src={newOffer.image_url} alt="Preview" className="h-20 w-20 object-cover rounded" />
                </div>
              )}
            </div>

            <div>
              <Label>Expiry Date</Label>
              <Input
                type="date"
                value={newOffer.expiry_date}
                onChange={(e) => setNewOffer({ ...newOffer, expiry_date: e.target.value })}
              />
            </div>

            <div>
              <Label>Terms & Conditions (one per line)</Label>
              <Textarea
                placeholder="Available on selected plots only&#10;Subject to status&#10;Terms apply"
                value={newOffer.terms.join('\n')}
                onChange={(e) => setNewOffer({ 
                  ...newOffer, 
                  terms: e.target.value.split('\n').filter(t => t.trim()) 
                })}
                rows={4}
              />
            </div>

            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="w-full"
            >
              {saveMutation.isPending ? 'Saving...' : (editingId ? 'Update Offer' : 'Create Offer')}
            </Button>
          </div>
        )}
      </Card>

      {/* Existing Offers */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Offers ({offers?.length || 0})</h3>
        
        <div className="space-y-3">
          {offers?.map((offer) => (
            <div
              key={offer.id}
              className="flex items-start justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="h-4 w-4 text-primary" />
                  <div className="font-medium">{offer.offer_title}</div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {offer.voucher_code}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {offer.developments.name} • {offer.developments.location}
                </div>
                {offer.offer_description && (
                  <div className="text-sm text-muted-foreground mb-1">
                    {offer.offer_description}
                  </div>
                )}
                {offer.savings_amount && (
                  <div className="text-sm font-medium text-green-600">
                    Save: {offer.savings_amount}
                  </div>
                )}
                {offer.expiry_date && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Expires: {new Date(offer.expiry_date).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingId(offer.id);
                    setSelectedDevId(offer.dev_id);
                    setNewOffer({
                      title: offer.offer_title,
                      description: offer.offer_description || '',
                      voucher_code: offer.voucher_code,
                      savings_amount: offer.savings_amount || '',
                      expiry_date: offer.expiry_date ? new Date(offer.expiry_date).toISOString().split('T')[0] : '',
                      terms: Array.isArray(offer.terms) ? offer.terms : [],
                      image_url: offer.image_url || ''
                    });
                    setShowNewOffer(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActiveMutation.mutate({ id: offer.id, active: offer.active })}
                >
                  {offer.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm('Remove this offer?')) {
                      deleteMutation.mutate(offer.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}

          {(!offers || offers.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              No offers created yet
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
