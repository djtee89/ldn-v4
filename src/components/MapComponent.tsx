import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Development } from '@/data/newDevelopments';
import { Button } from '@/components/ui/button';
import DirectionsPanel from './DirectionsPanel';
import { getDirections, DirectionsData, estimateStationCoordinates } from '@/lib/directions';
import { AmenityType, getNearbyAmenities, getAmenitiesByTypes, amenityColors, Amenity } from '@/data/amenities';
import AmenityLegend from './AmenityLegend';
import { extractAllPrices } from '@/lib/priceParser';

interface MapComponentProps {
  developments: Development[];
  onDevelopmentClick: (development: Development, nearbyAmenities?: Record<AmenityType, Amenity[]>) => void;
  highlightedDeveloper: string | null;
  className?: string;
  activeDirections?: { 
    developmentId: string;
    destination: {
      lat: number;
      lng: number;
      name: string;
      line: string;
    };
  } | null;
  onDirectionsClose?: () => void;
  lifestyleFilters?: AmenityType[];
}
const MapComponent: React.FC<MapComponentProps> = ({
  developments,
  onDevelopmentClick,
  highlightedDeveloper,
  className = "",
  activeDirections = null,
  onDirectionsClose = () => {},
  lifestyleFilters = []
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [directionsData, setDirectionsData] = useState<DirectionsData | null>(null);
  const [isLoadingDirections, setIsLoadingDirections] = useState(false);
  const [currentDevelopment, setCurrentDevelopment] = useState<Development | null>(null);
  const mapboxToken = 'pk.eyJ1IjoiZGp0ZWU4OSIsImEiOiJjbWY1dmNhaGYwOXFnMmlzaTNyejZoeGY5In0.SUBlhQBZCQbBTWO1ly06Og';

  // Force map resize on visibility change and orientation change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && map.current) {
        setTimeout(() => {
          map.current?.resize();
          console.log('[Map] Resized after visibility change');
        }, 100);
      }
    };

    const handleOrientationChange = () => {
      if (map.current) {
        setTimeout(() => {
          map.current?.resize();
          console.log('[Map] Resized after orientation change');
        }, 200);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

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
    map.current.on('load', async () => {
      console.log('[Map] Map loaded successfully');
      
      // Add source for development pins
      map.current!.addSource('developments', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
      console.log('[Map] Development source added');

      // Add source for amenity pins
      map.current!.addSource('amenities', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Add amenity pins layer (BELOW property pins)
      map.current!.addLayer({
        id: 'amenity-pins',
        type: 'circle',
        source: 'amenities',
        paint: {
          'circle-radius': 6,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.85
        }
      });
      console.log('[Map] Amenity pins layer added');

      // Add amenity labels
      map.current!.addLayer({
        id: 'amenity-labels',
        type: 'symbol',
        source: 'amenities',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 10,
          'text-offset': [0, -1.2],
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#1a1a1a',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5
        }
      });

      // Add layer for normal property pins (ABOVE amenity pins) - simple blue circles
      map.current!.addLayer({
        id: 'development-pins',
        type: 'circle',
        source: 'developments',
        filter: ['!=', ['get', 'highlighted'], true],
        paint: {
          'circle-radius': 10,
          'circle-color': '#3b82f6',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add layer for highlighted property pins - larger blue circles with glow
      map.current!.addLayer({
        id: 'development-pins-highlighted',
        type: 'circle',
        source: 'developments',
        filter: ['==', ['get', 'highlighted'], true],
        paint: {
          'circle-radius': 12,
          'circle-color': '#3b82f6',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#fbbf24'
        }
      });
      console.log('[Map] All development pin layers added');

      // Add price labels (ABOVE all pins)
      map.current!.addLayer({
        id: 'development-labels',
        type: 'symbol',
        source: 'developments',
        layout: {
          'text-field': ['get', 'price'],
          'text-size': 11,
          'text-offset': [0, -1.3],
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#1a1a1a',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5
        }
      });

      // Development hover popup
      const devPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
        className: 'development-hover-popup'
      });

      const showDevelopmentPopup = (e: any, layerId: string) => {
        if (e.features && e.features[0]) {
          const id = e.features[0].properties?.id;
          const development = developments.find(d => d.id === id);
          if (!development) return;

          const coordinates = [development.coordinates.lng, development.coordinates.lat];
          
          // Build comprehensive prices string using robust parser
          const priceData = extractAllPrices(development.prices);
          
          let pricesHtml = '<div style="margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">';
          pricesHtml += '<div style="font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #1a1a1a;">Prices from:</div>';
          
          let hasPrices = false;
          if (priceData.studio) {
            pricesHtml += `<div style="font-size: 12px;"><strong>Studio:</strong> ${priceData.studio}</div>`;
            hasPrices = true;
          }
          if (priceData.oneBed) {
            pricesHtml += `<div style="font-size: 12px;"><strong>1-bed:</strong> ${priceData.oneBed}</div>`;
            hasPrices = true;
          }
          if (priceData.twoBed) {
            pricesHtml += `<div style="font-size: 12px;"><strong>2-bed:</strong> ${priceData.twoBed}</div>`;
            hasPrices = true;
          }
          if (priceData.threeBed) {
            pricesHtml += `<div style="font-size: 12px;"><strong>3-bed:</strong> ${priceData.threeBed}</div>`;
            hasPrices = true;
          }
          if (priceData.fourBed) {
            pricesHtml += `<div style="font-size: 12px;"><strong>4-bed:</strong> ${priceData.fourBed}</div>`;
            hasPrices = true;
          }
          
          if (!hasPrices) {
            pricesHtml += '<div style="font-size: 12px; color: #666;">Contact for pricing</div>';
          }
          
          pricesHtml += '</div>';

          // Build transport info with fallbacks
          const station = development.nearestTube?.station || 'Contact for details';
          const walkTime = development.nearestTube?.walkTime ? `${development.nearestTube.walkTime} min` : '';
          
          const transportHtml = `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <div style="font-size: 11px; color: #666; margin-bottom: 4px;">
                🚇 <strong>${station}</strong>${walkTime ? ` (${walkTime})` : ''}
              </div>
              ${development.nearestTube?.line ? `<div style="font-size: 10px; color: #888;">${development.nearestTube.line}</div>` : ''}
              ${development.transportScore ? `<div style="font-size: 10px; color: #888; margin-top: 2px;">Transport: ${development.transportScore}</div>` : ''}
            </div>
          `;

          // Build additional details with fallbacks
          const zone = development.zone || 'Central London';
          const tenure = development.tenure || 'Contact for details';
          
          const detailsHtml = `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <div style="font-size: 11px; color: #666; margin-bottom: 4px;">
                <strong>Zone ${zone}</strong> • ${tenure}
              </div>
              ${development.completionDate ? `<div style="font-size: 11px; color: #666; margin-bottom: 2px;">Completion: ${development.completionDate}</div>` : ''}
              ${development.status ? `<div style="font-size: 11px; color: ${development.status === 'Available' ? '#16a34a' : '#ea580c'}; font-weight: 500;">Status: ${development.status}</div>` : ''}
            </div>
          `;

          const popupContent = `
            <div style="padding: 12px; min-width: 260px; max-width: 320px;">
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #1a1a1a;">${development.name}</div>
              <div style="color: #666; font-size: 12px; margin-bottom: 2px;">${development.developer}</div>
              <div style="color: #666; font-size: 11px; margin-bottom: 8px;">${development.location}${development.postcode ? ` • ${development.postcode}` : ''}</div>
              ${pricesHtml}
              ${transportHtml}
              ${detailsHtml}
              ${development.greenSpaces ? `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                  <div style="font-size: 11px; color: #666;">
                    🌳 ${development.greenSpaces}
                  </div>
                </div>
              ` : ''}
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; text-align: center;">
                <div style="font-size: 10px; color: #999;">Click for full details</div>
              </div>
            </div>
          `;
          
          devPopup.setLngLat(coordinates as [number, number])
            .setHTML(popupContent)
            .addTo(map.current!);
        }
      };

      // Handle property pin clicks
      map.current!.on('click', 'development-pins', e => {
        if (e.features && e.features[0]) {
          const id = e.features[0].properties?.id;
          const development = developments.find(d => d.id === id);
          if (development) {
            // Get nearby amenities for active filters
            const nearbyByType: Record<AmenityType, Amenity[]> = {} as any;
            lifestyleFilters.forEach(type => {
              const nearby = getNearbyAmenities(
                development.coordinates.lat,
                development.coordinates.lng,
                [type],
                1.5
              ).slice(0, 3); // Top 3 per type
              if (nearby.length > 0) {
                nearbyByType[type] = nearby;
              }
            });
            onDevelopmentClick(development, nearbyByType);
          }
        }
      });
      map.current!.on('click', 'development-pins-highlighted', e => {
        if (e.features && e.features[0]) {
          const id = e.features[0].properties?.id;
          const development = developments.find(d => d.id === id);
          if (development) {
            // Get nearby amenities for active filters
            const nearbyByType: Record<AmenityType, Amenity[]> = {} as any;
            lifestyleFilters.forEach(type => {
              const nearby = getNearbyAmenities(
                development.coordinates.lat,
                development.coordinates.lng,
                [type],
                1.5
              ).slice(0, 3); // Top 3 per type
              if (nearby.length > 0) {
                nearbyByType[type] = nearby;
              }
            });
            onDevelopmentClick(development, nearbyByType);
          }
        }
      });

      // Change cursor and show popup on hover
      map.current!.on('mouseenter', 'development-pins', (e) => {
        map.current!.getCanvas().style.cursor = 'pointer';
        showDevelopmentPopup(e, 'development-pins');
      });
      map.current!.on('mouseleave', 'development-pins', () => {
        map.current!.getCanvas().style.cursor = '';
        devPopup.remove();
      });
      map.current!.on('mouseenter', 'development-pins-highlighted', (e) => {
        map.current!.getCanvas().style.cursor = 'pointer';
        showDevelopmentPopup(e, 'development-pins-highlighted');
      });
      map.current!.on('mouseleave', 'development-pins-highlighted', () => {
        map.current!.getCanvas().style.cursor = '';
        devPopup.remove();
      });

      // Amenity hover handlers
      map.current!.on('mouseenter', 'amenity-pins', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });
      map.current!.on('mouseleave', 'amenity-pins', () => {
        map.current!.getCanvas().style.cursor = '';
      });

      // Show popup on amenity hover with "View route" option
      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        offset: 15,
        className: 'amenity-popup'
      });

      map.current!.on('click', 'amenity-pins', (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const coordinates = (feature.geometry as any).coordinates.slice();
          const name = feature.properties?.name;
          const walkTime = feature.properties?.walkTime;
          const type = feature.properties?.type;
          
          // Create a URL-safe slug from the name
          const schoolSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          
          const popupContent = `
            <div style="padding: 8px; font-size: 13px; min-width: 180px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${name}</div>
              
              <a 
                href="https://www.google.com/search?q=${encodeURIComponent(name + ' London')}"
                target="_blank"
                rel="noopener noreferrer"
                style="
                  display: block;
                  width: 100%;
                  padding: 6px 12px;
                  background: #3b82f6;
                  color: white;
                  text-decoration: none;
                  text-align: center;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: 500;
                "
              >
                Learn More
              </a>
            </div>
          `;
          
          popup.setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map.current!);
        }
      });

      map.current!.on('mouseenter', 'amenity-pins', (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const coordinates = (feature.geometry as any).coordinates.slice();
          const name = feature.properties?.name;
          const walkTime = feature.properties?.walkTime;
          
          // Show simple tooltip on hover
          const tooltip = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 10
          });
          
          tooltip.setLngLat(coordinates)
            .setHTML(`<div style="padding: 4px 8px; font-size: 11px;"><strong>${name}</strong>${feature.properties?.description ? `<br/><span style="color: #666; font-size: 10px;">${feature.properties.description}</span>` : ''}</div>`)
            .addTo(map.current!);
            
          map.current!.on('mouseleave', 'amenity-pins', () => {
            tooltip.remove();
          });
        }
      });

      setIsMapLoaded(true);
      console.log('[Map] Map fully initialized and ready');
    });

    // Handle map resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        map.current?.resize();
        console.log('[Map] Resized after window resize');
      }, 100);
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

    console.log(`[Map] Updating ${developments.length} developments on map`);

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
        price: (() => {
          const priceData = extractAllPrices(dev.prices);
          const firstPrice = priceData.studio || priceData.oneBed || priceData.twoBed || priceData.threeBed || priceData.fourBed;
          return firstPrice ? `From ${firstPrice}` : (priceData.range || 'POA');
        })(),
        highlighted: highlightedDeveloper ? dev.developer === highlightedDeveloper : false
      }
    }));
    
    source.setData({
      type: 'FeatureCollection',
      features
    });
    
    console.log(`[Map] Added ${features.length} markers to map`);
    
    // Show toast if no markers after filtering
    if (features.length === 0 && developments.length === 0) {
      console.warn('[Map] No developments to display - check filters or data fetch');
    }
  }, [developments, highlightedDeveloper, isMapLoaded]);

  // Update amenity layers when lifestyle filters change
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;
    const source = map.current.getSource('amenities') as mapboxgl.GeoJSONSource;
    if (!source) return;

    if (lifestyleFilters.length === 0) {
      // Clear amenities
      source.setData({
        type: 'FeatureCollection',
        features: []
      });
      console.log('[Map] Cleared amenity filters');
      return;
    }

    // Get all amenities across London for selected types
    const allAmenities = getAmenitiesByTypes(lifestyleFilters);
    console.log(`[Map] Loading ${allAmenities.length} amenities for filters:`, lifestyleFilters);

    // Create GeoJSON features
    const features = allAmenities.map(amenity => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [amenity.coordinates.lng, amenity.coordinates.lat]
      },
      properties: {
        id: amenity.id,
        name: amenity.name,
        type: amenity.type,
        walkTime: amenity.walkTime,
        color: amenityColors[amenity.type]
      }
    }));

    source.setData({
      type: 'FeatureCollection',
      features
    });
    console.log(`[Map] Added ${features.length} amenity markers`);
  }, [lifestyleFilters, isMapLoaded]);

  // This effect is no longer needed as we handle clicks directly in the map event handlers
  // Removed to prevent duplicate calls to onDevelopmentClick

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

    const destinationCoords = activeDirections.destination;

    // Fetch directions to selected destination
    getDirections(development.coordinates, destinationCoords, 'walking')
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

  return <div className={`relative ${className}`} style={{ height: '100%', minHeight: '500px' }}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg ring-1 ring-black/5" />
      
      {/* Amenity Legend */}
      <AmenityLegend activeTypes={lifestyleFilters} />
      
      {/* Directions Panel */}
      {activeDirections && currentDevelopment && (
        <DirectionsPanel
          directions={directionsData}
          fromName={currentDevelopment.name}
          toName={activeDirections.destination.name}
          onClose={onDirectionsClose}
          isLoading={isLoadingDirections}
        />
      )}
    </div>;
};
export default MapComponent;