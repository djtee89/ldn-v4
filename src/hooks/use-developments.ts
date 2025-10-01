import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Development } from '@/data/newDevelopments';

export const useDevelopments = () => {
  return useQuery({
    queryKey: ['developments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developments')
        .select('*')
        .order('name');

      if (error) throw error;

      // Transform database format to Development interface
      return data.map((dev): Development => {
        // Transform prices from DB format {"1": "£X", "2": "£Y"} to component format
        const dbPrices = dev.prices as Record<string, string> || {};
        const prices: Development['prices'] = {
          oneBed: dbPrices['1'] || undefined,
          twoBed: dbPrices['2'] || undefined,
          threeBed: dbPrices['3'] || undefined,
        };

        return {
          id: dev.id,
          name: dev.name,
          developer: dev.developer || '',
          zone: parseInt(String(dev.zone || 1)),
          location: dev.location || '',
          postcode: '', // Not stored in DB
          nearestTube: {
            station: dev.nearest_tube || '',
            line: '', // Not stored separately
            walkTime: parseInt(String(dev.distance_to_tube || 10))
          },
          coordinates: {
            lat: parseFloat(String(dev.lat || 0)),
            lng: parseFloat(String(dev.lng || 0))
          },
          prices,
          tenure: dev.tenure || 'Leasehold',
          schools: [], // Not stored in DB
          hospital: '', // Not stored in DB
          transportScore: '', // Not stored in DB
          greenSpaces: '', // Not stored in DB
          amenities: dev.amenities || [],
          areaOverview: dev.area_overview || '',
          images: dev.images || []
        };
      });
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
