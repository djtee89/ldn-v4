import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Development } from '@/data/newDevelopments';
import { Button } from '@/components/ui/button';

interface MapComponentProps {
  developments: Development[];
  onDevelopmentClick: (development: Development) => void;
  highlightedDeveloper: string | null;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  developments, 
  onDevelopmentClick, 
  highlightedDeveloper,
  className = "" 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapboxToken = 'pk.eyJ1IjoiZGp0ZWU4OSIsImEiOiJjbWY1dmNhaGYwOXFnMmlzaTNyejZoeGY5In0.SUBlhQBZCQbBTWO1ly06Og';

  // Initialize map once
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-0.1276, 51.5074],
      zoom: 10,
      pitch: 0,
      bearing: 0
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to fully load before allowing markers
    map.current.on('load', () => {
      setIsMapLoaded(true);
    });

    // Handle map resize
    const handleResize = () => {
      map.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
      setIsMapLoaded(false);
    };
  }, [mapboxToken]);

  // Update markers when map is loaded and developments or highlighting changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) {
      console.log('Map not ready:', { mapExists: !!map.current, isMapLoaded });
      return;
    }

    console.log('Adding markers for', developments.length, 'developments');

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add development markers
    developments.forEach((development) => {
      console.log('Creating marker for:', development.name, development.coordinates);
      const isHighlighted = highlightedDeveloper && development.developer === highlightedDeveloper;
      
      const markerEl = document.createElement('div');
      markerEl.className = 'cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10';
      
      const displayPrice = development.prices.oneBed || development.prices.range || 'POA';
      
      markerEl.innerHTML = `
        <div class="relative group">
          <div class="${isHighlighted 
            ? 'bg-gradient-to-r from-primary to-accent shadow-premium scale-125 ring-4 ring-primary/30' 
            : 'bg-primary shadow-medium hover:scale-110'} 
            w-3 h-3 rounded-full transition-smooth cursor-pointer">
          </div>
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <div class="bg-background text-foreground px-2 py-1 rounded shadow-strong text-xs font-semibold border border-border">
              ${displayPrice}
            </div>
          </div>
        </div>
      `;

      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        onDevelopmentClick(development);
      });

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([development.coordinates.lng, development.coordinates.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    console.log('Total markers created:', markersRef.current.length);

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [developments, onDevelopmentClick, highlightedDeveloper, isMapLoaded]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" style={{ minHeight: '400px' }} />
      
      {/* London context overlay */}
      <div className="absolute top-4 left-4 bg-glass backdrop-blur-sm rounded-lg p-3 shadow-medium">
        <h3 className="font-semibold text-sm text-foreground">London New Builds</h3>
        <p className="text-xs text-muted-foreground">Click pins to view details</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-glass backdrop-blur-sm rounded-lg p-3 shadow-medium">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-xs text-muted-foreground">Development</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full ring-2 ring-primary/30"></div>
          <span className="text-xs text-muted-foreground">Selected developer</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;