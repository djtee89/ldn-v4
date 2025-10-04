import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Development } from '@/data/newDevelopments';
import { useNeighbourhoodMetrics } from '@/hooks/use-neighbourhoods';

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

export interface LiveAnalysisMapProps {
  units: Unit[];
  developments: Development[];
  onDevelopmentClick: (development: Development) => void;
}

export default function LiveAnalysisMap({ 
  units, 
  developments, 
  onDevelopmentClick 
}: LiveAnalysisMapProps) {
  const { data: neighbourhoodMetrics = [], isLoading } = useNeighbourhoodMetrics();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  const mapboxToken = 'pk.eyJ1IjoiZGp0ZWU4OSIsImEiOiJjbWY1dmNhaGYwOXFnMmlzaTNyejZoeGY5In0.SUBlhQBZCQbBTWO1ly06Og';

  const getPriceColor = (pricePerSqft: number): string => {
    if (pricePerSqft < 600) return '#22c55e';      // Green
    if (pricePerSqft < 800) return '#84cc16';      // Lime
    if (pricePerSqft < 1000) return '#eab308';     // Yellow
    if (pricePerSqft < 1200) return '#f97316';     // Orange
    if (pricePerSqft < 1400) return '#ef4444';     // Red
    return '#dc2626';                              // Dark red
  };

  const getHaloColor = (discount: number): string => {
    if (discount <= -10) return '#22c55e';
    if (discount <= 0) return '#84cc16';
    return '#9ca3af';
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

  // Add neighbourhood polygon layer
  useEffect(() => {
    if (!isMapLoaded || !map.current || neighbourhoodMetrics.length === 0) return;

    // Calculate price per sqft for each neighbourhood based on units
    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: neighbourhoodMetrics
        .filter(nm => nm.union_geometry)
        .map(nm => {
          // Simple price calculation - you may want to refine this with proper geocoding
          const avgPrice = nm.price_per_sqft || 900; // Fallback to average if null

          return {
            type: 'Feature',
            properties: {
              name: nm.name,
              borough: nm.borough,
              price_per_sqft: avgPrice,
            },
            geometry: nm.union_geometry,
          } as GeoJSON.Feature;
        }),
    };

    if (map.current.getSource('neighbourhoods')) {
      (map.current.getSource('neighbourhoods') as mapboxgl.GeoJSONSource).setData(geojsonData);
    } else {
      map.current.addSource('neighbourhoods', {
        type: 'geojson',
        data: geojsonData,
      });
    }

    // Define legend bins: < £600, £600-800, £800-1000, £1000-1200, £1200-1400, > £1400
    const colorStops: [number, string][] = [
      [0, '#22c55e'],      // < 600: green
      [600, '#84cc16'],    // 600-800: lime
      [800, '#eab308'],    // 800-1000: yellow
      [1000, '#f97316'],   // 1000-1200: orange
      [1200, '#ef4444'],   // 1200-1400: red
      [1400, '#dc2626'],   // > 1400: dark red
    ];

    if (!map.current.getLayer('neighbourhood-fills')) {
      map.current.addLayer({
        id: 'neighbourhood-fills',
        type: 'fill',
        source: 'neighbourhoods',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'price_per_sqft'], null],
            'transparent',
            [
              'interpolate',
              ['linear'],
              ['get', 'price_per_sqft'],
              ...colorStops.flatMap(([value, color]) => [value, color]),
            ],
          ],
          'fill-opacity': 0.3,
          'fill-antialias': true,
        },
      });
    }

    // Hover popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'neighbourhood-popup',
    });

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const { name, borough, price_per_sqft } = feature.properties || {};
        
        popup
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-2">
              <div class="font-semibold">${name}</div>
              <div class="text-xs text-muted-foreground">${borough}</div>
              ${price_per_sqft ? `<div class="text-sm mt-1">£${Math.round(price_per_sqft)}/ft²</div>` : '<div class="text-sm mt-1 text-muted-foreground">No data</div>'}
            </div>
          `)
          .addTo(map.current!);
      }
    };

    const handleMouseLeave = () => {
      popup.remove();
    };

    map.current.on('mousemove', 'neighbourhood-fills', handleMouseMove);
    map.current.on('mouseleave', 'neighbourhood-fills', handleMouseLeave);

    return () => {
      if (map.current) {
        map.current.off('mousemove', 'neighbourhood-fills', handleMouseMove);
        map.current.off('mouseleave', 'neighbourhood-fills', handleMouseLeave);
      }
      popup.remove();
    };
  }, [isMapLoaded, neighbourhoodMetrics]);

  // Update dev markers
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

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

    Object.keys(devStats).forEach(devId => {
      devStats[devId].avgPricePerSqft = devStats[devId].total / devStats[devId].count;
    });

    const features = Object.entries(devStats).map(([devId, stats]) => {
      const dev = stats.development;
      const devPpsf = stats.avgPricePerSqft;
      
      // For now, use a simple fallback - you may enhance with proper neighbourhood lookup
      const neighbourhoodPpsf = 900; // Fallback
      const discount = ((devPpsf - neighbourhoodPpsf) / neighbourhoodPpsf * 100);
      
      return {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [dev.coordinates.lng, dev.coordinates.lat],
        },
        properties: {
          devId,
          name: dev.name,
          avgPricePerSqft: Math.round(devPpsf),
          areaPricePerSqft: Math.round(neighbourhoodPpsf),
          discount: Math.round(discount),
          unitCount: stats.count,
          color: getPriceColor(devPpsf),
          haloColor: getHaloColor(discount),
        },
      };
    });

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features,
    };

    if (map.current!.getLayer('price-analysis-circles')) {
      map.current!.removeLayer('price-analysis-circles');
    }
    if (map.current!.getLayer('price-analysis-halos')) {
      map.current!.removeLayer('price-analysis-halos');
    }
    if (map.current!.getLayer('price-analysis-labels')) {
      map.current!.removeLayer('price-analysis-labels');
    }
    if (map.current!.getSource('price-analysis')) {
      map.current!.removeSource('price-analysis');
    }

    map.current!.addSource('price-analysis', {
      type: 'geojson',
      data: geojson,
    });

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
            <p class="text-xs"><strong>Dev £/ft²:</strong> £${props.avgPricePerSqft.toLocaleString()}</p>
            <p class="text-xs"><strong>Area £/ft²:</strong> £${props.areaPricePerSqft.toLocaleString()}</p>
            <p class="text-xs ${props.discount < 0 ? 'text-green-600 font-semibold' : 'text-gray-500'}">
              ${props.discount < 0 ? '' : '+'}${props.discount}% vs area
            </p>
            <p class="text-xs text-muted-foreground mt-1"><strong>Units:</strong> ${props.unitCount}</p>
          </div>
        `)
        .addTo(map.current!);
    });

    map.current!.on('mouseleave', 'price-analysis-circles', () => {
      map.current!.getCanvas().style.cursor = '';
      popup.remove();
    });

    map.current!.on('click', 'price-analysis-circles', (e) => {
      if (!e.features || e.features.length === 0) return;
      const devId = e.features[0].properties.devId;
      const dev = developments.find(d => d.id === devId);
      if (dev) {
        onDevelopmentClick(dev);
      }
    });

  }, [units, isMapLoaded, developments, onDevelopmentClick]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
