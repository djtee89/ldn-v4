import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Neighbourhood {
  id: string;
  borough: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface NeighbourhoodPolygon {
  id: string;
  neighbourhood_id: string;
  area_type: string;
  polygon_ids: string[];
  union_geometry: any; // GeoJSON geometry
  created_at: string;
  updated_at: string;
}

export interface NeighbourhoodMetric extends Neighbourhood {
  price_per_sqft: number | null;
  union_geometry: any;
}

export const useNeighbourhoods = () => {
  return useQuery({
    queryKey: ['neighbourhoods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('neighbourhoods')
        .select('*')
        .order('borough', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return (data || []) as Neighbourhood[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useNeighbourhoodPolygons = () => {
  return useQuery({
    queryKey: ['neighbourhood-polygons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('neighbourhood_polygons')
        .select(`
          *,
          neighbourhoods (
            id,
            borough,
            name,
            slug
          )
        `)
        .not('union_geometry', 'is', null);
      
      if (error) throw error;
      return (data || []) as any[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useNeighbourhoodMetrics = () => {
  return useQuery({
    queryKey: ['neighbourhood-metrics'],
    queryFn: async () => {
      // Join neighbourhood_polygons with neighbourhoods and calculate metrics
      const { data, error } = await supabase
        .from('neighbourhood_polygons')
        .select(`
          union_geometry,
          neighbourhoods!inner (
            id,
            borough,
            name,
            slug,
            created_at,
            updated_at
          )
        `)
        .not('union_geometry', 'is', null);
      
      if (error) throw error;
      
      // Transform and calculate metrics
      return (data || []).map((item: any) => ({
        ...item.neighbourhoods,
        union_geometry: item.union_geometry,
        price_per_sqft: null, // Will be calculated from area_metrics or units
      })) as NeighbourhoodMetric[];
    },
    staleTime: 5 * 60 * 1000,
  });
};
