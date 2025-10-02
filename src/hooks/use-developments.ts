import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Development } from '@/data/newDevelopments';

export const useDevelopments = () => {
  return useQuery({
    queryKey: ['developments'],
    queryFn: async () => {
      // Check if user is authenticated to determine which table to query
      const { data: { session } } = await supabase.auth.getSession();
      const isAuthenticated = !!session?.user;

      let data: any[];
      let error: any;

      if (isAuthenticated) {
        // Authenticated users get full access to developments table
        const result = await supabase
          .from('developments')
          .select('*')
          .order('name');
        data = result.data || [];
        error = result.error;
      } else {
        // Public users only see developments_public view (customer-facing data)
        const result = await supabase
          .from('developments_public' as any)
          .select('*')
          .order('name');
        data = result.data || [];
        error = result.error;
      }

      if (error) throw error;

      // Transform database format to Development interface - DB is now single source of truth
      return data.map((dev): Development => {
        // Keep raw prices object - let the parser handle all variations
        const prices = dev.prices || {};

        // Parse nearby stations
        const nearbyStations = (dev.nearby_stations as any[]) || [];
        const primaryStation = nearbyStations[0] || {};

        // Parse schools from JSONB or array
        let schools: string[] = [];
        if (dev.schools) {
          if (typeof dev.schools === 'string') {
            try {
              schools = JSON.parse(dev.schools);
            } catch {
              schools = [dev.schools];
            }
          } else if (Array.isArray(dev.schools)) {
            schools = dev.schools.map(s => String(s));
          }
        }

        // Get additional details from raw_details (only available for authenticated users)
        const rawDetails = (dev.raw_details as any) || {};

        return {
          id: dev.id,
          name: dev.name,
          developer: dev.developer || '',
          zone: parseInt(String(dev.zone || 1)),
          location: dev.location || '',
          postcode: dev.postcode || '',
          nearestTube: {
            station: primaryStation.station || dev.nearest_tube || '',
            line: primaryStation.line || dev.nearest_tube_line || '',
            walkTime: primaryStation.walk_time || parseInt(String(dev.distance_to_tube || 10))
          },
          coordinates: {
            lat: parseFloat(String(dev.lat || 0)),
            lng: parseFloat(String(dev.lng || 0))
          },
          prices,
          tenure: dev.tenure || 'Leasehold',
          schools: schools,
          hospital: rawDetails.hospital || '',
          transportScore: dev.transport_score || '',
          greenSpaces: dev.green_spaces || '',
          amenities: dev.amenities || [],
          areaOverview: dev.area_overview || '',
          images: dev.images || [],
          videoUrl: rawDetails.videoUrl
        };
      });
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
