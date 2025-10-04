import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Development } from '@/data/newDevelopments';
import { AreaMetric, AreaPolygon } from '@/hooks/use-area-metrics';
import { AnalysisMode } from '@/pages/Analysis';
import { BracketFilter } from './AnalysisLegend';

interface Unit {
  id: string;
  dev_id: string;
  unit_number: string;
  beds: number;
  price: number;
  size_sqft: number;
  pricePerSqft: number;
  development?: Development;
}

interface LiveAnalysisMapProps {
  units: Unit[];
  developments: Development[];
  areaMetrics: AreaMetric[];
  areaPolygons: AreaPolygon[];
  mode: AnalysisMode;
  brackets: BracketFilter[];
  selectedBrackets: number[];
}

const LiveAnalysisMap: React.FC<LiveAnalysisMapProps> = ({ 
  units, 
  developments, 
  areaMetrics, 
  areaPolygons,
  mode,
  brackets,
  selectedBrackets 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Use same Mapbox token as main map
  const mapboxToken = 'pk.eyJ1IjoiZGp0ZWU4OSIsImEiOiJjbWY1dmNhaGYwOXFnMmlzaTNyejZoeGY5In0.SUBlhQBZCQbBTWO1ly06Og';

  // Calculate color based on price per sqft (green = cheap, red = expensive)
  const getPriceColor = (pricePerSqft: number): string => {
    // Typical London new-build range: £800-£2000 per sqft
    if (pricePerSqft < 900) return '#22c55e'; // Green - great value
    if (pricePerSqft < 1100) return '#84cc16'; // Light green
    if (pricePerSqft < 1300) return '#eab308'; // Yellow - average
    if (pricePerSqft < 1500) return '#f97316'; // Orange
    return '#ef4444'; // Red - expensive
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-0.1276, 51.5074],
      zoom: 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setIsMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Helper to get color for a metric value
  const getColorForValue = (value: number | null): string => {
    if (value === null) return '#999999';
    
    for (const bracket of brackets) {
      if (value >= bracket.min && value < bracket.max) {
        return bracket.color;
      }
    }
    return brackets[brackets.length - 1]?.color || '#999999';
  };

  // Update area polygons when data changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;
    if (areaPolygons.length === 0 || brackets.length === 0) return;

    // Remove existing layers
    if (map.current.getLayer('area-polygons-fill')) {
      map.current.removeLayer('area-polygons-fill');
    }
    if (map.current.getLayer('area-polygons-outline')) {
      map.current.removeLayer('area-polygons-outline');
    }
    if (map.current.getSource('area-polygons')) {
      map.current.removeSource('area-polygons');
    }

    // Create features with colors based on metrics
    const features = areaPolygons.map(polygon => {
      const metric = areaMetrics.find(m => m.area_code === polygon.area_code);
      let value: number | null = null;

      if (mode === 'price-per-sqft') {
        value = metric?.price_per_sqft_overall ?? null;
      }

      const color = getColorForValue(value);

      return {
        type: 'Feature' as const,
        geometry: polygon.geometry,
        properties: {
          area_code: polygon.area_code,
          area_name: polygon.area_name,
          value,
          color,
        },
      };
    });

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features,
    };

    // Add source
    map.current.addSource('area-polygons', {
      type: 'geojson',
      data: geojson,
    });

    // Add fill layer
    map.current.addLayer({
      id: 'area-polygons-fill',
      type: 'fill',
      source: 'area-polygons',
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': 0.3,
      },
    }, 'price-analysis-circles'); // Add below pins

    // Add outline layer
    map.current.addLayer({
      id: 'area-polygons-outline',
      type: 'line',
      source: 'area-polygons',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 1,
        'line-opacity': 0.6,
      },
    }, 'price-analysis-circles');

  }, [areaMetrics, areaPolygons, mode, brackets, isMapLoaded]);

  // Update markers when units change
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Calculate average price per sqft for each development
    const devStats: Record<string, { total: number; count: number; avgPricePerSqft: number; development: Development }> = {};
    
    units.forEach(unit => {
      if (!unit.development) return;
      const devId = unit.dev_id;
      if (!devStats[devId]) {
        devStats[devId] = {
          total: 0,
          count: 0,
          avgPricePerSqft: 0,
          development: unit.development,
        };
      }
      devStats[devId].total += unit.pricePerSqft;
      devStats[devId].count += 1;
    });

    // Calculate averages
    Object.keys(devStats).forEach(devId => {
      devStats[devId].avgPricePerSqft = devStats[devId].total / devStats[devId].count;
    });

    // Create GeoJSON
    const features = Object.entries(devStats).map(([devId, stats]) => {
      const dev = stats.development;
      return {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [dev.coordinates.lng, dev.coordinates.lat],
        },
        properties: {
          devId,
          name: dev.name,
          avgPricePerSqft: Math.round(stats.avgPricePerSqft),
          unitCount: stats.count,
          color: getPriceColor(stats.avgPricePerSqft),
        },
      };
    });

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features,
    };

    // Remove existing source and layer
    if (map.current!.getLayer('price-analysis-circles')) {
      map.current!.removeLayer('price-analysis-circles');
    }
    if (map.current!.getLayer('price-analysis-labels')) {
      map.current!.removeLayer('price-analysis-labels');
    }
    if (map.current!.getSource('price-analysis')) {
      map.current!.removeSource('price-analysis');
    }

    // Add source and layers
    map.current!.addSource('price-analysis', {
      type: 'geojson',
      data: geojson,
    });

    // Circle layer
    map.current!.addLayer({
      id: 'price-analysis-circles',
      type: 'circle',
      source: 'price-analysis',
      paint: {
        'circle-radius': 12,
        'circle-color': ['get', 'color'],
        'circle-opacity': 0.8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });

    // Label layer
    map.current!.addLayer({
      id: 'price-analysis-labels',
      type: 'symbol',
      source: 'price-analysis',
      layout: {
        'text-field': ['concat', '£', ['get', 'avgPricePerSqft']],
        'text-size': 10,
        'text-offset': [0, 0],
        'text-anchor': 'center',
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 1,
      },
    });

    // Add hover popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.current!.on('mouseenter', 'price-analysis-circles', (e) => {
      if (!e.features || e.features.length === 0) return;
      map.current!.getCanvas().style.cursor = 'pointer';

      const feature = e.features[0];
      const props = feature.properties;
      
      popup
        .setLngLat(e.lngLat)
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-sm mb-1">${props.name}</h3>
            <p class="text-xs"><strong>Avg Price/sqft:</strong> £${props.avgPricePerSqft.toLocaleString()}</p>
            <p class="text-xs"><strong>Available Units:</strong> ${props.unitCount}</p>
          </div>
        `)
        .addTo(map.current!);
    });

    map.current!.on('mouseleave', 'price-analysis-circles', () => {
      map.current!.getCanvas().style.cursor = '';
      popup.remove();
    });

  }, [units, isMapLoaded]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default LiveAnalysisMap;
