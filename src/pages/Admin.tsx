import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Mail, Phone, MessageSquare, Building2, Clock, RefreshCcw, Upload, AlertCircle, LogOut, Activity, Search, Database, FileText, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { DedupeDialog } from '@/components/DedupeDialog';
import { SectionHeader } from '@/components/ui/SectionHeader';

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  message?: string;
  preferred_date?: string;
  preferred_time?: string;
  created_at: string;
  development_name?: string;
};

type DashboardStats = {
  totalDevelopments: number;
  totalUnits: number;
  lastPublishTime: string | null;
  recentErrors: number;
  pendingBookings: number;
};

type RecentActivity = {
  id: string;
  dev_id: string;
  received_at: string;
  notes: string | null;
};

type RecentChange = {
  id: string;
  dev_id: string;
  change_type: string;
  changed_at: string;
  notes: string | null;
};

export default function Admin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalDevelopments: 0,
    totalUnits: 0,
    lastPublishTime: null,
    recentErrors: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [visiblePII, setVisiblePII] = useState<Set<string>>(new Set());
  const [dedupeOpen, setDedupeOpen] = useState(false);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [recentChanges, setRecentChanges] = useState<RecentChange[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const togglePIIVisibility = (bookingId: string) => {
    setVisiblePII(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    return `${local.substring(0, 2)}***@${domain}`;
  };

  const maskPhone = (phone: string) => {
    return `***${phone.slice(-4)}`;
  };

  const fetchStats = async () => {
    try {
      const [devsResult, unitsResult, publishesResult, bookingsResult] = await Promise.all([
        supabase.from('developments').select('id', { count: 'exact', head: true }),
        supabase.from('units').select('id', { count: 'exact', head: true }),
        supabase.from('publishes').select('published_at').order('published_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      setStats({
        totalDevelopments: devsResult.count || 0,
        totalUnits: unitsResult.count || 0,
        lastPublishTime: publishesResult.data?.published_at || null,
        recentErrors: 0,
        pendingBookings: bookingsResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const [priceListsResult, changesResult] = await Promise.all([
        supabase
          .from('price_lists')
          .select('id, dev_id, received_at, notes')
          .order('received_at', { ascending: false })
          .limit(5),
        supabase
          .from('change_log')
          .select('id, dev_id, change_type, changed_at, notes')
          .order('changed_at', { ascending: false })
          .limit(5),
      ]);

      if (priceListsResult.data) setRecentActivities(priceListsResult.data);
      if (changesResult.data) setRecentChanges(changesResult.data);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBookings();
    fetchRecentActivity();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          fetchBookings();
          fetchStats();
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
        title: "Success",
        description: `Booking ${status}`,
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'ai_chat':
        return <Badge variant="outline" className="gap-1"><MessageSquare className="h-3 w-3" /> AI Chat</Badge>;
      default:
        return <Badge variant="outline">{source}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="cursor-pointer hover:bg-muted/50" onClick={() => navigate('/admin/developments')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Developments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDevelopments}</div>
              <p className="text-xs text-muted-foreground">Total schemes</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50" onClick={() => navigate('/admin/pipeline')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Pipeline</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUnits}</div>
              <p className="text-xs text-muted-foreground">Upload & import</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Publish</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.lastPublishTime ? new Date(stats.lastPublishTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.lastPublishTime ? new Date(stats.lastPublishTime).toLocaleDateString() : 'No publishes yet'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Booking requests</p>
            </CardContent>
          </Card>
        </div>


        {/* Tools & Utilities Section */}
        <div className="mb-6">
          <SectionHeader 
            title="Tools & Utilities"
            subtitle="Data management and backend access"
            className="mb-4"
          />
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setDedupeOpen(true)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Search className="h-5 w-5" />
                  Find Duplicates
                </CardTitle>
                <CardDescription>Detect and merge duplicate developments</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Database className="h-5 w-5" />
                  View Backend
                </CardTitle>
                <CardDescription>Access database and storage directly</CardDescription>
              </CardHeader>
            </Card>

            <Card className="opacity-50 cursor-not-allowed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Edit className="h-5 w-5" />
                  User Permissions
                </CardTitle>
                <CardDescription>Manage admin & manager roles (coming soon)</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mb-6">
          <SectionHeader 
            title="Recent Activity"
            subtitle="Latest price lists and changes"
            className="mb-4"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Recent Price Lists
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent uploads</p>
                ) : (
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start justify-between text-sm">
                        <div>
                          <div className="font-medium">{activity.dev_id}</div>
                          {activity.notes && <div className="text-xs text-muted-foreground">{activity.notes}</div>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(activity.received_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Recent Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentChanges.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent changes</p>
                ) : (
                  <div className="space-y-3">
                    {recentChanges.map((change) => (
                      <div key={change.id} className="flex items-start justify-between text-sm">
                        <div>
                          <div className="font-medium">{change.dev_id}</div>
                          <div className="text-xs text-muted-foreground">{change.change_type}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(change.changed_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Booking Requests</h2>
              <p className="text-muted-foreground">Manage customer inquiries</p>
            </div>
            <Button
              onClick={fetchBookings}
              variant="outline"
              size="icon"
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="text-center p-8">
              <RefreshCcw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No booking requests yet
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            {booking.name}
                            {getSourceBadge(booking.source)}
                          </CardTitle>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <button
                            onClick={() => togglePIIVisibility(booking.id)}
                            className="hover:underline cursor-pointer text-left"
                          >
                            {visiblePII.has(booking.id) ? booking.email : maskEmail(booking.email)}
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <button
                            onClick={() => togglePIIVisibility(booking.id)}
                            className="hover:underline cursor-pointer text-left"
                          >
                            {visiblePII.has(booking.id) ? booking.phone : maskPhone(booking.phone)}
                          </button>
                        </div>
                        {booking.development_name && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.development_name}</span>
                          </div>
                        )}
                        {booking.preferred_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.preferred_date} {booking.preferred_time && `at ${booking.preferred_time}`}</span>
                          </div>
                        )}
                      </div>

                      {booking.message && (
                        <div className="rounded-lg bg-muted p-3">
                          <p className="text-sm">{booking.message}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(booking.created_at)}
                        </span>

                        {booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => updateStatus(booking.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateStatus(booking.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      <DedupeDialog open={dedupeOpen} onOpenChange={setDedupeOpen} />
    </div>
  );
}
