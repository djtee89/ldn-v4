import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Development } from '@/data/newDevelopments';
import { AreaMetric, AreaPolygon } from '@/hooks/use-area-metrics';

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
  onDevelopmentClick: (dev: Development) => void;
}

const LiveAnalysisMap: React.FC<LiveAnalysisMapProps> = ({ 
  units, 
  developments,
  areaMetrics,
  areaPolygons,
  onDevelopmentClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Use same Mapbox token as main map
  const mapboxToken = 'pk.eyJ1IjoiZGp0ZWU4OSIsImEiOiJjbWY1dmNhaGYwOXFnMmlzaTNyejZoeGY5In0.SUBlhQBZCQbBTWO1ly06Og';

  // Calculate color based on price per sqft - wider range starting from <£600
  const getPriceColor = (pricePerSqft: number): string => {
    if (pricePerSqft < 600) return '#10b981'; // Green - great value
    if (pricePerSqft < 700) return '#34d399'; // Light green
    if (pricePerSqft < 800) return '#84cc16'; // Yellow-green
    if (pricePerSqft < 900) return '#fbbf24'; // Yellow
    if (pricePerSqft < 1000) return '#fb923c'; // Orange
    if (pricePerSqft < 1100) return '#f97316'; // Dark orange
    if (pricePerSqft < 1200) return '#ef4444'; // Red
    if (pricePerSqft < 1400) return '#dc2626'; // Dark red
    return '#991b1b'; // Very dark red - premium
  };

  const getHaloColor = (discount: number): string => {
    if (discount <= -10) return '#22c55e'; // Green - great discount
    if (discount <= -5) return '#84cc16'; // Light green
    if (discount < 0) return '#eab308'; // Yellow
    return '#9ca3af'; // Gray - no discount
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


  // Add Borough polygons layer with proper fill (no rectangles)
  useEffect(() => {
    if (!map.current || !isMapLoaded || areaPolygons.length === 0 || areaMetrics.length === 0) return;

    // Join polygons with metrics to get price data
    const features = areaPolygons.map(polygon => {
      const metric = areaMetrics.find(m => m.area_code === polygon.area_code);
      return {
        type: 'Feature' as const,
        properties: {
          area_code: polygon.area_code,
          area_name: polygon.area_name,
          ppsf: metric?.price_per_sqft_overall || null,
        },
        geometry: polygon.geometry,
      };
    });

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features,
    };

    // Remove existing layers and source
    if (map.current!.getLayer('borough-outline')) map.current!.removeLayer('borough-outline');
    if (map.current!.getLayer('borough-fill')) map.current!.removeLayer('borough-fill');
    if (map.current!.getSource('boroughs')) map.current!.removeSource('boroughs');

    // Add source
    map.current!.addSource('boroughs', {
      type: 'geojson',
      data: geojson,
    });

    // Add fill layer with 6 fixed bins
    map.current!.addLayer({
      id: 'borough-fill',
      type: 'fill',
      source: 'boroughs',
      paint: {
        'fill-color': [
          'step',
          ['get', 'ppsf'],
          '#2E7D32',          // < 600
          600, '#66BB6A',     // 600–800
          800, '#FDD835',     // 800–1000
          1000, '#FB8C00',    // 1000–1200
          1200, '#E53935',    // 1200–1400
          1400, '#B71C1C'     // > 1400
        ],
        'fill-opacity': [
          'case',
          ['==', ['get', 'ppsf'], null], 0,
          0.3
        ],
      },
    });

    // Add thin hairline outline
    map.current!.addLayer({
      id: 'borough-outline',
      type: 'line',
      source: 'boroughs',
      paint: {
        'line-color': '#000',
        'line-opacity': 0.1,
        'line-width': 0.5,
      },
    });

    return () => {
      if (!map.current) return;
      if (map.current.getLayer('borough-outline')) map.current.removeLayer('borough-outline');
      if (map.current.getLayer('borough-fill')) map.current.removeLayer('borough-fill');
      if (map.current.getSource('boroughs')) map.current.removeSource('boroughs');
    };
  }, [isMapLoaded, areaPolygons, areaMetrics]);

  // Update dev markers when units change
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

    // Calculate averages and find area metrics for comparison
    Object.keys(devStats).forEach(devId => {
      devStats[devId].avgPricePerSqft = devStats[devId].total / devStats[devId].count;
    });

    // Create GeoJSON with discount calculation
    const features = Object.entries(devStats).map(([devId, stats]) => {
      const dev = stats.development;
      const avgPrice = stats.avgPricePerSqft;
      
      // Find the borough by checking which polygon contains this development
      const areaMetric = areaPolygons.find(polygon => {
        // Check if dev coordinates are within this borough polygon
        // For now, find by matching area_metrics bounds
        const metric = areaMetrics.find(m => m.area_code === polygon.area_code);
        if (!metric || !metric.bounds) return false;
        const { lat, lng } = dev.coordinates;
        return lat >= metric.bounds.south && lat <= metric.bounds.north &&
               lng >= metric.bounds.west && lng <= metric.bounds.east;
      });
      
      const boroughName = areaMetric?.area_name || 'Unknown';
      const metric = areaMetrics.find(m => m.area_code === areaMetric?.area_code);
      const areaPrice = metric?.price_per_sqft_overall;
      const discount = (areaPrice && avgPrice) ? (1 - (avgPrice / areaPrice)) : null;
      
      return {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [dev.coordinates.lng, dev.coordinates.lat],
        },
        properties: {
          devId,
          devName: dev.name,
          avgPrice: Math.round(avgPrice),
          areaPrice: areaPrice ? Math.round(areaPrice) : null,
          discount: discount !== null ? Math.round(discount * 100) : null,
          borough: boroughName,
          unitCount: stats.count,
          color: getPriceColor(avgPrice),
          haloColor: discount !== null ? getHaloColor(discount * 100) : '#9ca3af',
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

    // Halo layer (outer circle for discount indication) - stronger for visibility
    map.current!.addLayer({
      id: 'price-analysis-halos',
      type: 'circle',
      source: 'price-analysis',
      paint: {
        'circle-radius': 18,
        'circle-color': ['get', 'haloColor'],
        'circle-opacity': 0.4,
      },
    });

    // Circle layer
    map.current!.addLayer({
      id: 'price-analysis-circles',
      type: 'circle',
      source: 'price-analysis',
      paint: {
        'circle-radius': 12,
        'circle-color': ['get', 'color'],
        'circle-opacity': 0.9,
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
        'text-field': ['concat', '£', ['get', 'avgPrice']],
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

    // Hover on borough polygons
    map.current!.on('mouseenter', 'borough-fill', (e) => {
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      const props = feature.properties;
      
      if (props.ppsf) {
        map.current!.setPaintProperty('borough-fill', 'fill-opacity', [
          'case',
          ['==', ['get', 'area_code'], props.area_code],
          0.5,
          ['==', ['get', 'ppsf'], null],
          0,
          0.3
        ]);
        
        popup
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm mb-1">${props.area_name}</h3>
              <p class="text-xs"><strong>Borough £/ft²:</strong> £${props.ppsf.toLocaleString()}</p>
            </div>
          `)
          .addTo(map.current!);
      }
    });

    map.current!.on('mouseleave', 'borough-fill', () => {
      map.current!.setPaintProperty('borough-fill', 'fill-opacity', [
        'case',
        ['==', ['get', 'ppsf'], null],
        0,
        0.3
      ]);
      popup.remove();
    });

    // Hover on dev pins
    map.current!.on('mouseenter', 'price-analysis-circles', (e) => {
      if (!e.features || e.features.length === 0) return;
      map.current!.getCanvas().style.cursor = 'pointer';

      const feature = e.features[0];
      const properties = feature.properties;
      
      popup
        .setLngLat(e.lngLat)
        .setHTML(`
          <div class="p-2">
            <div class="font-semibold">${properties.devName}</div>
            <div class="text-sm">£${properties.avgPrice}/ft²</div>
            <div class="text-xs text-gray-500">${properties.borough}</div>
            ${properties.areaPrice ? `<div class="text-sm text-gray-600">${properties.borough} avg: £${properties.areaPrice}/ft²</div>` : ''}
            ${properties.discount !== null ? `<div class="text-sm font-semibold ${properties.discount > 0 ? 'text-green-600' : properties.discount < -5 ? 'text-red-600' : 'text-gray-600'}">${properties.discount > 0 ? '−' : '+'}${Math.abs(properties.discount)}% vs borough</div>` : ''}
          </div>
        `)
        .addTo(map.current!);
    });

    map.current!.on('mouseleave', 'price-analysis-circles', () => {
      map.current!.getCanvas().style.cursor = '';
      popup.remove();
    });

    // Click on development pins
    map.current!.on('click', 'price-analysis-circles', (e) => {
      if (!e.features || e.features.length === 0) return;
      const devId = e.features[0].properties.devId;
      const dev = developments.find(d => d.id === devId);
      if (dev) {
        onDevelopmentClick(dev);
      }
    });

  }, [units, isMapLoaded, developments, onDevelopmentClick, areaMetrics]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default LiveAnalysisMap;
