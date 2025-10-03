import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EventPopup } from './EventPopup';

interface Event {
  id: string;
  title: string;
  development: string;
  date: string;
  time: string;
  description: string;
  details: string;
  image: string;
  type: string;
}

const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Mortgage Advice Event',
    development: 'Woodberry Down',
    date: '18 Oct 2025',
    time: '1:00 PM - 4:00 PM',
    description: 'Free mortgage consultation with expert advisors',
    details: 'Come to Woodberry Down between 1-4pm. Our experienced mortgage advisor will be available for one-on-one consultations. Discuss your financing options, understand the latest mortgage products, and get expert advice tailored to your needs. Complimentary refreshments will be served.',
    image: '/placeholder.svg',
    type: 'Finance'
  },
  {
    id: '2',
    title: 'Education Advice Session',
    development: 'Trent Park',
    date: '25 Oct 2025',
    time: '2:00 PM - 5:00 PM',
    description: 'Meet with education advisors about local schools',
    details: 'Join us at Trent Park for an informative session with education advisors. Learn about outstanding local schools, catchment areas, and educational opportunities in the area. Perfect for families planning their move to the neighborhood. Light refreshments provided.',
    image: '/placeholder.svg',
    type: 'Education'
  },
  {
    id: '3',
    title: 'Planning for a Career in London',
    development: 'Bow Green',
    date: '2 Nov 2025',
    time: '6:00 PM - 8:00 PM',
    description: 'Career insights from industry leaders',
    details: 'Exclusive talk from the Head of Recruitment at a leading London creative agency. Discover why Bow Green is the ideal location for young creatives - excellent transport links, vibrant community, and proximity to Central London\'s creative hub. Learn about career opportunities and networking in the capital.',
    image: '/placeholder.svg',
    type: 'Career'
  }
];

export function UpcomingEvents() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
            {upcomingEvents.map((event) => (
              <Card
                key={event.id}
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.development}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                    {event.type}
                  </Badge>
                </div>

                <div className="p-5">
                  <div className="text-xs text-muted-foreground font-medium mb-1">
                    {event.development}
                  </div>
                  <h3 className="font-bold text-lg mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {selectedEvent && (
        <EventPopup
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
