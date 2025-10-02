import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Development {
  id: string;
  name: string;
  location: string;
  zone: string;
  lat: number;
  lng: number;
}

export function MandatoryFieldsGate({ devId }: { devId: string }) {
  const { data: dev } = useQuery<Development>({
    queryKey: ['development', devId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developments')
        .select('id, name, location, zone, lat, lng')
        .eq('id', devId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (!dev) return null;

  const missing: string[] = [];
  if (!dev.location || dev.location.trim() === '') missing.push('Location/Postcode');
  if (!dev.zone || dev.zone.trim() === '') missing.push('Zone');
  if (!dev.lat || !dev.lng) missing.push('Coordinates (lat/lng)');

  if (missing.length === 0) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>All mandatory fields set</AlertTitle>
        <AlertDescription>
          This development has all required information and can be published.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Missing mandatory fields</AlertTitle>
      <AlertDescription>
        Cannot publish until these fields are filled: <strong>{missing.join(', ')}</strong>
      </AlertDescription>
    </Alert>
  );
}
