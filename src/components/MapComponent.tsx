import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Development } from '@/data/newDevelopments';
import { Button } from '@/components/ui/button';
import DirectionsPanel from './DirectionsPanel';
import { getDirections, DirectionsData, estimateStationCoordinates } from '@/lib/directions';
interface MapComponentProps {
  developments: Development[];
  onDevelopmentClick: (development: Development) => void;
  highlightedDeveloper: string | null;
  className?: string;
  activeDirections?: { developmentId: string } | null;
  onDirectionsClose?: () => void;
}
const MapComponent: React.FC<MapComponentProps> = ({
  developments,
  onDevelopmentClick,
  highlightedDeveloper,
  className = "",
  activeDirections = null,
  onDirectionsClose = () => {}
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [directionsData, setDirectionsData] = useState<DirectionsData | null>(null);
  const [isLoadingDirections, setIsLoadingDirections] = useState(false);
  const [currentDevelopment, setCurrentDevelopment] = useState<Development | null>(null);
  const mapboxToken = 'pk.eyJ1IjoiZGp0ZWU4OSIsImEiOiJjbWY1dmNhaGYwOXFnMmlzaTNyejZoeGY5In0.SUBlhQBZCQbBTWO1ly06Og';

  // Initialize map once
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    mapboxgl.accessToken = mapboxToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-0.1276, 51.5074],
      zoom: 10,
      minZoom: 8,
      maxZoom: 15,
      pitch: 0,
      bearing: 0
    });
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to fully load
    map.current.on('load', () => {
      // Add source for development pins
      map.current!.addSource('developments', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Add layer for normal pins
      map.current!.addLayer({
        id: 'development-pins',
        type: 'circle',
        source: 'developments',
        paint: {
          'circle-radius': 6,
          'circle-color': '#FF6B6B',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add layer for highlighted pins
      map.current!.addLayer({
        id: 'development-pins-highlighted',
        type: 'circle',
        source: 'developments',
        filter: ['==', ['get', 'highlighted'], true],
        paint: {
          'circle-radius': 8,
          'circle-color': '#FF6B6B',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#FFD700',
          'circle-opacity': 0.9
        }
      });

      // Add price labels
      map.current!.addLayer({
        id: 'development-labels',
        type: 'symbol',
        source: 'developments',
        layout: {
          'text-field': ['get', 'price'],
          'text-size': 11,
          'text-offset': [0, -1.5],
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#1a1a1a',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5
        }
      });

      // Handle clicks
      map.current!.on('click', 'development-pins', e => {
        if (e.features && e.features[0]) {
          const id = e.features[0].properties?.id;
          setSelectedId(id);
        }
      });
      map.current!.on('click', 'development-pins-highlighted', e => {
        if (e.features && e.features[0]) {
          const id = e.features[0].properties?.id;
          setSelectedId(id);
        }
      });

      // Change cursor on hover
      map.current!.on('mouseenter', 'development-pins', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });
      map.current!.on('mouseleave', 'development-pins', () => {
        map.current!.getCanvas().style.cursor = '';
      });
      map.current!.on('mouseenter', 'development-pins-highlighted', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });
      map.current!.on('mouseleave', 'development-pins-highlighted', () => {
        map.current!.getCanvas().style.cursor = '';
      });
      setIsMapLoaded(true);
    });

    // Handle map resize
    const handleResize = () => {
      map.current?.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      map.current?.remove();
      map.current = null;
      setIsMapLoaded(false);
    };
  }, [mapboxToken]);

  // Update map data when developments or highlighting changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;
    const source = map.current.getSource('developments') as mapboxgl.GeoJSONSource;
    if (!source) return;

    // Create GeoJSON features from developments
    const features = developments.map(dev => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [dev.coordinates.lng, dev.coordinates.lat]
      },
      properties: {
        id: dev.id,
        name: dev.name,
        developer: dev.developer,
        price: dev.prices.oneBed || dev.prices.range || 'POA',
        highlighted: highlightedDeveloper ? dev.developer === highlightedDeveloper : false
      }
    }));
    source.setData({
      type: 'FeatureCollection',
      features
    });
  }, [developments, highlightedDeveloper, isMapLoaded]);

  // Handle click events from map
  useEffect(() => {
    if (!selectedId) return;
    const development = developments.find(d => d.id === selectedId);
    if (development) {
      onDevelopmentClick(development);
      setSelectedId(null);
    }
  }, [selectedId, developments, onDevelopmentClick]);

  // Handle directions request
  useEffect(() => {
    if (!activeDirections || !map.current || !isMapLoaded) {
      // Clear directions if none active
      if (map.current && map.current.getSource('directions-route')) {
        const routeLayer = map.current.getLayer('directions-route');
        if (routeLayer) map.current.removeLayer('directions-route');
        map.current.removeSource('directions-route');
      }
      setDirectionsData(null);
      setCurrentDevelopment(null);
      return;
    }

    const development = developments.find(d => d.id === activeDirections.developmentId);
    if (!development) return;

    setCurrentDevelopment(development);
    setIsLoadingDirections(true);

    // Estimate station coordinates based on walk time
    const stationCoords = estimateStationCoordinates(
      development.coordinates,
      development.nearestTube.walkTime
    );

    // Fetch directions
    getDirections(development.coordinates, stationCoords, 'walking')
      .then((directions) => {
        if (directions && map.current) {
          setDirectionsData(directions);

          // Add route to map
          if (map.current.getSource('directions-route')) {
            const routeLayer = map.current.getLayer('directions-route');
            if (routeLayer) map.current.removeLayer('directions-route');
            map.current.removeSource('directions-route');
          }

          map.current.addSource('directions-route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: directions.geometry
            }
          });

          map.current.addLayer({
            id: 'directions-route',
            type: 'line',
            source: 'directions-route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 4,
              'line-opacity': 0.8
            }
          });

          // Fit bounds to show entire route
          const coordinates = directions.geometry.coordinates;
          const bounds = coordinates.reduce(
            (bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
              return bounds.extend(coord as [number, number]);
            },
            new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
          );
          map.current.fitBounds(bounds, { padding: 50 });
        }
        setIsLoadingDirections(false);
      })
      .catch((error) => {
        console.error('Error fetching directions:', error);
        setIsLoadingDirections(false);
      });
  }, [activeDirections, developments, isMapLoaded]);

  return <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" style={{
      minHeight: '400px'
    }} />
      
      {/* Directions Panel */}
      {activeDirections && currentDevelopment && (
        <DirectionsPanel
          directions={directionsData}
          fromName={currentDevelopment.name}
          toName={currentDevelopment.nearestTube.station}
          onClose={onDirectionsClose}
          isLoading={isLoadingDirections}
        />
      )}
    </div>;
};
export default MapComponent;