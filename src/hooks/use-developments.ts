import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Development, developments as localDevelopments } from '@/data/newDevelopments';

export const useDevelopments = () => {
  return useQuery({
    queryKey: ['developments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developments')
        .select('*')
        .order('name');

      if (error) throw error;

      // Create a map of local developments for quick lookup
      const localDevMap = new Map(
        localDevelopments.map(dev => [dev.id, dev])
      );

      // Transform database format to Development interface, merging with local data
      return data.map((dev): Development => {
        // Get the full local development data if it exists
        const localDev = localDevMap.get(dev.id);
        
        // Transform prices from DB format {"1": "£X", "2": "£Y"} to component format
        const dbPrices = (dev.prices as Record<string, string>) || {};
        const prices: Development['prices'] = {
          studio: dbPrices['0'] || localDev?.prices.studio,
          oneBed: dbPrices['1'] || localDev?.prices.oneBed,
          twoBed: dbPrices['2'] || localDev?.prices.twoBed,
          threeBed: dbPrices['3'] || localDev?.prices.threeBed,
          fourBed: dbPrices['4'] || localDev?.prices.fourBed,
          range: localDev?.prices.range || (typeof dev.prices === 'object' && dev.prices ? (dev.prices as any).range : undefined),
        };

        return {
          id: dev.id,
          name: dev.name,
          developer: dev.developer || localDev?.developer || '',
          zone: parseInt(String(dev.zone || localDev?.zone || 1)),
          location: dev.location || localDev?.location || '',
          postcode: localDev?.postcode || '',
          nearestTube: {
            station: dev.nearest_tube || localDev?.nearestTube.station || '',
            line: localDev?.nearestTube.line || '',
            walkTime: parseInt(String(dev.distance_to_tube || localDev?.nearestTube.walkTime || 10))
          },
          coordinates: {
            lat: parseFloat(String(dev.lat || localDev?.coordinates.lat || 0)),
            lng: parseFloat(String(dev.lng || localDev?.coordinates.lng || 0))
          },
          prices,
          tenure: dev.tenure || localDev?.tenure || 'Leasehold',
          schools: localDev?.schools || [],
          hospital: localDev?.hospital || '',
          transportScore: localDev?.transportScore || '',
          greenSpaces: localDev?.greenSpaces || '',
          amenities: dev.amenities || localDev?.amenities || [],
          areaOverview: dev.area_overview || localDev?.areaOverview || '',
          images: (dev.images && dev.images.length > 0) ? dev.images : (localDev?.images || [])
        };
      });
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
