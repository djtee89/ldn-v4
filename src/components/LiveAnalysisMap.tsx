import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Development } from '@/data/newDevelopments';

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
}

const LiveAnalysisMap: React.FC<LiveAnalysisMapProps> = ({ units, developments }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

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

    mapboxgl.accessToken = 'pk.eyJ1IjoibGRubmV3YnVpbGRzIiwiYSI6ImNtNTV4c2lpbjBhNW0ycXNlZnc0emI2M2oifQ.nk7y0a6XvvGb52xaK_t99w';

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
