import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

interface EventPopupProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export function EventPopup({ event, isOpen, onClose }: EventPopupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: event.id,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        });

      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: `You've signed up for ${event.title} at ${event.development}. We'll send you a confirmation email shortly.`,
      });
      
      setName('');
      setEmail('');
      setPhone('');
      onClose();
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="relative w-full h-48 -mx-6 -mt-6 mb-4">
            <img
              src={event.image}
              alt={event.development}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
              {event.type}
            </Badge>
          </div>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">{event.development}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span>{event.time}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">About This Event</h3>
            <p className="text-muted-foreground leading-relaxed">
              {event.details}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Sign Up for This Event
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+44 7XXX XXXXXX"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up Now'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
