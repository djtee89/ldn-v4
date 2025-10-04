import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AreaMetric {
  id: string;
  area_code: string;
  area_name: string;
  area_type: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  center_lat: number;
  center_lng: number;
  price_per_sqft_1bed: number | null;
  price_per_sqft_2bed: number | null;
  price_per_sqft_3bed: number | null;
  price_per_sqft_overall: number | null;
  yield_1bed: number | null;
  yield_2bed: number | null;
  yield_3bed: number | null;
  growth_12m_pct: number | null;
  growth_rank: string | null;
  schools_outstanding_primary: number;
  schools_outstanding_secondary: number;
  schools_score: number | null;
  green_space_pct: number | null;
  parks_count: number;
  noise_air_badge: string | null;
  crime_per_1000: number | null;
  crime_category: string | null;
  sample_size: number;
  last_updated: string;
}

export interface AreaPolygon {
  id: string;
  area_code: string;
  area_name: string;
  area_type: string;
  geometry: any; // GeoJSON geometry
}

export const useAreaMetrics = () => {
  return useQuery({
    queryKey: ['area-metrics-borough'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('area_metrics')
        .select('*')
        .eq('area_type', 'Borough')
        .order('area_code');
      
      if (error) throw error;
      return (data || []) as unknown as AreaMetric[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAreaPolygons = () => {
  return useQuery({
    queryKey: ['area-polygons-borough'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('area_polygons')
        .select('*')
        .eq('area_type', 'Borough')
        .order('area_code');
      
      if (error) throw error;
      return (data || []) as unknown as AreaPolygon[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
