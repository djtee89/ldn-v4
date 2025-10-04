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

  // Calculate color based on price per sqft
  const getPriceColor = (pricePerSqft: number): string => {
    if (pricePerSqft < 900) return '#22c55e';
    if (pricePerSqft < 1100) return '#84cc16';
    if (pricePerSqft < 1300) return '#eab308';
    if (pricePerSqft < 1500) return '#f97316';
    return '#ef4444';
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


  // Add area polygons layer with 7-class quantile choropleth
  useEffect(() => {
    if (!map.current || !isMapLoaded || areaPolygons.length === 0) return;

    // Calculate quantile breaks (7 classes) from non-null metrics
    const validPpsf = areaMetrics
      .filter(m => m.price_per_sqft_overall && m.price_per_sqft_overall > 0)
      .map(m => m.price_per_sqft_overall!)
      .sort((a, b) => a - b);

    const getQuantileColor = (ppsf: number): string => {
      if (!ppsf || validPpsf.length === 0) return '#e5e7eb';
      
      const q1 = validPpsf[Math.floor(validPpsf.length * 1/7)];
      const q2 = validPpsf[Math.floor(validPpsf.length * 2/7)];
      const q3 = validPpsf[Math.floor(validPpsf.length * 3/7)];
      const q4 = validPpsf[Math.floor(validPpsf.length * 4/7)];
      const q5 = validPpsf[Math.floor(validPpsf.length * 5/7)];
      const q6 = validPpsf[Math.floor(validPpsf.length * 6/7)];
      
      if (ppsf <= q1) return '#22c55e'; // Green
      if (ppsf <= q2) return '#65a30d'; // Green-yellow
      if (ppsf <= q3) return '#84cc16'; // Yellow-green
      if (ppsf <= q4) return '#eab308'; // Yellow
      if (ppsf <= q5) return '#f59e0b'; // Orange-yellow
      if (ppsf <= q6) return '#f97316'; // Orange
      return '#ef4444'; // Red
    };

    // Create GeoJSON for polygons - join with metrics by area_code
    const features = areaPolygons.map(poly => {
      const metric = areaMetrics.find(m => m.area_code === poly.area_code);
      const ppsf = metric?.price_per_sqft_overall || null;
      
      return {
        type: 'Feature' as const,
        geometry: poly.geometry,
        properties: {
          area_code: poly.area_code,
          area_name: poly.area_name,
          area_ppsf: ppsf,
          color: ppsf ? getQuantileColor(ppsf) : '#e5e7eb'
        }
      };
    });

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features
    };

    // Remove existing layers
    if (map.current!.getLayer('area-fills')) map.current!.removeLayer('area-fills');
    if (map.current!.getLayer('area-borders')) map.current!.removeLayer('area-borders');
    if (map.current!.getSource('area-polygons')) map.current!.removeSource('area-polygons');

    // Add source and layers
    map.current!.addSource('area-polygons', {
      type: 'geojson',
      data: geojson
    });

    // Fill layer - smooth choropleth with 7 quantile classes
    map.current!.addLayer({
      id: 'area-fills',
      type: 'fill',
      source: 'area-polygons',
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': [
          'case',
          ['==', ['get', 'area_ppsf'], null],
          0, // Fully transparent if no data
          0.30 // 0.25-0.35 range
        ]
      }
    });

    // No border or very subtle hairline
    map.current!.addLayer({
      id: 'area-borders',
      type: 'line',
      source: 'area-polygons',
      paint: {
        'line-color': '#000000',
        'line-width': 0.5,
        'line-opacity': 0.08
      }
    });

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
      const devPpsf = stats.avgPricePerSqft;
      
      // Find the area metric for this development's location
      const areaMetric = areaMetrics.find(metric => {
        if (!metric.bounds) return false;
        const { lat, lng } = dev.coordinates;
        return lat >= metric.bounds.south && lat <= metric.bounds.north &&
               lng >= metric.bounds.west && lng <= metric.bounds.east;
      });
      
      const areaPpsf = areaMetric?.price_per_sqft_overall || null;
      const discount = areaPpsf ? ((devPpsf - areaPpsf) / areaPpsf * 100) : null;
      
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
          areaPricePerSqft: areaPpsf ? Math.round(areaPpsf) : null,
          discount: discount ? Math.round(discount) : null,
          unitCount: stats.count,
          color: getPriceColor(devPpsf),
          haloColor: discount !== null ? getHaloColor(discount) : '#9ca3af',
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

    // Hover on MSOA areas
    map.current!.on('mouseenter', 'area-fills', (e) => {
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      const props = feature.properties;
      
      if (props.area_ppsf) {
        map.current!.setPaintProperty('area-fills', 'fill-opacity', [
          'case',
          ['==', ['get', 'area_code'], props.area_code],
          0.45,
          ['==', ['get', 'area_ppsf'], null],
          0,
          0.28
        ]);
        
        popup
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm mb-1">${props.area_name}</h3>
              <p class="text-xs"><strong>Area £/ft²:</strong> £${props.area_ppsf.toLocaleString()}</p>
              <p class="text-xs text-muted-foreground">MSOA: ${props.area_code}</p>
            </div>
          `)
          .addTo(map.current!);
      }
    });

    map.current!.on('mouseleave', 'area-fills', () => {
      map.current!.setPaintProperty('area-fills', 'fill-opacity', [
        'case',
        ['==', ['get', 'area_ppsf'], null],
        0,
        0.28
      ]);
      popup.remove();
    });

    // Hover on dev pins
    map.current!.on('mouseenter', 'price-analysis-circles', (e) => {
      if (!e.features || e.features.length === 0) return;
      map.current!.getCanvas().style.cursor = 'pointer';

      const feature = e.features[0];
      const props = feature.properties;
      
      const discountText = props.discount !== null 
        ? `<p class="text-xs ${props.discount < 0 ? 'text-green-600 font-semibold' : 'text-gray-500'}">
             ${props.discount < 0 ? '' : '+'}${props.discount}% vs area
           </p>`
        : '';
      
      const areaText = props.areaPricePerSqft !== null
        ? `<p class="text-xs"><strong>Area £/ft²:</strong> £${props.areaPricePerSqft.toLocaleString()}</p>`
        : '';
      
      popup
        .setLngLat(e.lngLat)
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-sm mb-1">${props.name}</h3>
            <p class="text-xs"><strong>Dev £/ft²:</strong> £${props.avgPricePerSqft.toLocaleString()}</p>
            ${areaText}
            ${discountText}
            <p class="text-xs text-muted-foreground mt-1"><strong>Units:</strong> ${props.unitCount}</p>
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
