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
import { Trash2, Eye, EyeOff, Plus, Calendar, Pencil } from 'lucide-react';

interface Event {
  id: string;
  dev_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  location: string | null;
  registration_required: boolean;
  active: boolean;
  image_url: string | null;
  developments: {
    name: string;
    location: string;
  };
}

export const EventsManager = () => {
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDevId, setSelectedDevId] = useState<string>('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    registration_required: true,
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

  // Fetch existing events
  const { data: events } = useQuery({
    queryKey: ['events-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          developments (name, location)
        `)
        .order('event_date', { ascending: true });
      if (error) throw error;
      return data as Event[];
    }
  });

  // Create or update event
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDevId || !newEvent.title || !newEvent.event_date || !newEvent.event_time) {
        throw new Error('Please fill in all required fields');
      }

      const eventData = {
        dev_id: selectedDevId,
        title: newEvent.title,
        description: newEvent.description || null,
        event_date: newEvent.event_date,
        event_time: newEvent.event_time,
        location: newEvent.location || null,
        image_url: newEvent.image_url || null,
        registration_required: newEvent.registration_required,
      };

      if (editingId) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { data: user } = await supabase.auth.getUser();
        const { error } = await supabase
          .from('events')
          .insert({
            ...eventData,
            active: true,
            created_by: user.user?.id
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events-admin'] });
      queryClient.invalidateQueries({ queryKey: ['events-public'] });
      setShowNewEvent(false);
      setEditingId(null);
      setSelectedDevId('');
      setNewEvent({
        title: '',
        description: '',
        event_date: '',
        event_time: '',
        location: '',
        registration_required: true,
        image_url: ''
      });
      toast.success(editingId ? 'Event updated successfully' : 'Event created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save event');
    }
  });

  // Toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('events')
        .update({ active: !active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events-admin'] });
      queryClient.invalidateQueries({ queryKey: ['events-public'] });
      toast.success('Status updated');
    }
  });

  // Delete event
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events-admin'] });
      queryClient.invalidateQueries({ queryKey: ['events-public'] });
      toast.success('Event removed');
    }
  });

  return (
    <div className="space-y-6">
      {/* Add/Edit Event Form */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{editingId ? 'Edit Event' : 'Create New Event'}</h3>
          <Button
            variant={showNewEvent ? "outline" : "default"}
            onClick={() => {
              setShowNewEvent(!showNewEvent);
              if (showNewEvent) {
                setEditingId(null);
                setSelectedDevId('');
                setNewEvent({
                  title: '',
                  description: '',
                  event_date: '',
                  event_time: '',
                  location: '',
                  registration_required: true,
                  image_url: ''
                });
              }
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {showNewEvent ? 'Cancel' : 'Add New Event'}
          </Button>
        </div>

        {showNewEvent && (
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
              <Label>Event Title *</Label>
              <Input
                placeholder="e.g. Private Viewing Day"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Event Description</Label>
              <Textarea
                placeholder="Details about the event..."
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label>Event Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  const fileExt = file.name.split('.').pop();
                  const fileName = `event-${Date.now()}.${fileExt}`;
                  
                  const { error } = await supabase.storage
                    .from('development-images')
                    .upload(fileName, file);
                  
                  if (error) {
                    toast.error('Failed to upload image');
                    return;
                  }
                  
                  const { data: { publicUrl } } = supabase.storage
                    .from('development-images')
                    .getPublicUrl(fileName);
                  
                  setNewEvent({ ...newEvent, image_url: publicUrl });
                  toast.success('Image uploaded');
                }}
              />
              {newEvent.image_url && (
                <div className="mt-2">
                  <img src={newEvent.image_url} alt="Preview" className="h-20 w-20 object-cover rounded" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event Date *</Label>
                <Input
                  type="date"
                  value={newEvent.event_date}
                  onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                />
              </div>

              <div>
                <Label>Event Time *</Label>
                <Input
                  type="time"
                  value={newEvent.event_time}
                  onChange={(e) => setNewEvent({ ...newEvent, event_time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Location (optional)</Label>
              <Input
                placeholder="e.g. Marketing Suite, 123 Main St"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>

            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="w-full"
            >
              {saveMutation.isPending ? 'Saving...' : (editingId ? 'Update Event' : 'Create Event')}
            </Button>
          </div>
        )}
      </Card>

      {/* Existing Events */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Events ({events?.length || 0})</h3>
        
        <div className="space-y-3">
          {events?.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div className="font-medium">{event.title}</div>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {event.developments.name} • {event.developments.location}
                </div>
                {event.description && (
                  <div className="text-sm text-muted-foreground mb-2">
                    {event.description}
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className="font-medium">
                    📅 {new Date(event.event_date).toLocaleDateString('en-GB', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                  <div>🕒 {event.event_time}</div>
                  {event.location && <div>📍 {event.location}</div>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingId(event.id);
                    setSelectedDevId(event.dev_id);
                    setNewEvent({
                      title: event.title,
                      description: event.description || '',
                      event_date: event.event_date,
                      event_time: event.event_time,
                      location: event.location || '',
                      registration_required: event.registration_required,
                      image_url: event.image_url || ''
                    });
                    setShowNewEvent(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActiveMutation.mutate({ id: event.id, active: event.active })}
                >
                  {event.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm('Remove this event?')) {
                      deleteMutation.mutate(event.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}

          {(!events || events.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming events
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
