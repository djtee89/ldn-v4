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
  const mapboxToken = 'pk.eyJ1IjoiZGp0ZWU4OSIsImEiOiJjbWY1dmNhaGYwOXFnMmlzaTNyejZoeGY5In0.SUBlhQBZCQbBTWO1ly06Og';

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Set Mapbox access token
    mapboxgl.accessToken = mapboxToken;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11', // Clean, low-detail style
      center: [-0.1276, 51.5074], // London center
      zoom: 10,
      pitch: 0,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add development markers
    developments.forEach((development) => {
      // Determine if this development's developer is highlighted
      const isHighlighted = highlightedDeveloper && development.developer === highlightedDeveloper;
      
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10';
      
      // Get price to display
      const displayPrice = development.prices.oneBed || development.prices.range || 'POA';
      
      // Create price pin HTML with conditional styling
      markerEl.innerHTML = `
        <div class="${isHighlighted 
          ? 'bg-gradient-to-r from-primary to-accent text-white shadow-premium scale-110' 
          : 'bg-price-pin text-price-pin-foreground shadow-medium'} 
          px-3 py-1 rounded-full font-bold text-sm hover:shadow-strong transition-smooth whitespace-nowrap">
          ${displayPrice}
        </div>
      `;

      // Add click event
      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        onDevelopmentClick(development);
      });

      // Create and add marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([development.coordinates.lng, development.coordinates.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [developments, onDevelopmentClick, mapboxToken, highlightedDeveloper]);

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
          <div className="bg-price-pin text-price-pin-foreground px-2 py-1 rounded-full font-bold text-xs">
            £XXXk
          </div>
          <span className="text-xs text-muted-foreground">Starting price</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;