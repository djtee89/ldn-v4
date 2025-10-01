import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Mail, Phone, MessageSquare, Building2, Clock, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  development_name: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  source: 'ai_chat' | 'booking_modal' | 'website';
  created_at: string;
};

const Admin = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings((data || []) as Booking[]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Booking marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'confirmed': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-muted';
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'ai_chat': return <Badge variant="outline" className="bg-primary/10">AI Chat</Badge>;
      case 'booking_modal': return <Badge variant="outline" className="bg-blue-500/10">Booking Form</Badge>;
      case 'website': return <Badge variant="outline" className="bg-purple-500/10">Website</Badge>;
      default: return <Badge variant="outline">{source}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Booking Requests</h1>
            <p className="text-muted-foreground mt-1">Manage viewing requests from AI chat and website</p>
          </div>
          <Button onClick={fetchBookings} variant="outline" size="icon">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Loading bookings...</p>
            </CardContent>
          </Card>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No booking requests yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{booking.name}</CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getSourceBadge(booking.source)}
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(booking.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${booking.email}`} className="text-primary hover:underline">
                        {booking.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${booking.phone}`} className="text-primary hover:underline">
                        {booking.phone}
                      </a>
                    </div>
                    {booking.development_name && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.development_name}</span>
                      </div>
                    )}
                    {booking.preferred_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.preferred_date} {booking.preferred_time && `at ${booking.preferred_time}`}</span>
                      </div>
                    )}
                  </div>
                  {booking.message && (
                    <div className="flex items-start gap-2 text-sm bg-muted p-3 rounded-lg">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{booking.message}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Clock className="h-3 w-3" />
                    <span>Received {formatDate(booking.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
