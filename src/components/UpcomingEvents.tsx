import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EventPopup } from './EventPopup';

interface Event {
  id: string;
  dev_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  location: string | null;
  developments: {
    name: string;
    images: string[];
  };
}

export function UpcomingEvents() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          developments (name, images)
        `)
        .eq('active', true)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(6);

      if (error) throw error;
      setEvents(data as Event[] || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || events.length === 0) {
    return null;
  }

  return (
    <>
      <section className="w-full py-12 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Community"
            title="Upcoming Events"
            subtitle="Join us at exclusive events across our developments"
            className="mb-10 text-center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.developments.images?.[0] || '/placeholder.svg'}
                    alt={event.developments.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                    Event
                  </Badge>
                </div>

                <div className="p-5">
                  <div className="text-xs text-muted-foreground font-medium mb-1">
                    {event.developments.name}
                  </div>
                  <h3 className="font-bold text-lg mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{event.event_time}</span>
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {selectedEvent && (
        <EventPopup
          event={{
            id: selectedEvent.id,
            title: selectedEvent.title,
            development: selectedEvent.developments.name,
            date: new Date(selectedEvent.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: selectedEvent.event_time,
            description: selectedEvent.description || '',
            details: selectedEvent.description || '',
            image: selectedEvent.developments.images?.[0] || '/placeholder.svg',
            type: 'Event'
          }}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
