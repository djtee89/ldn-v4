const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGp0ZWU4OSIsImEiOiJjbWY1dmNhaGYwOXFnMmlzaTNyejZoeGY5In0.SUBlhQBZCQbBTWO1ly06Og';

export interface DirectionsStep {
  instruction: string;
  distance: number;
  duration: number;
}

export interface DirectionsData {
  distance: number;
  duration: number;
  steps: DirectionsStep[];
  mode: 'walking' | 'driving';
  geometry: any; // GeoJSON geometry for the route
}

export interface Coordinates {
  lng: number;
  lat: number;
}

/**
 * Fetches directions from MapBox Directions API
 * @param from - Starting coordinates
 * @param to - Ending coordinates
 * @param mode - Transportation mode (walking or driving)
 */
export async function getDirections(
  from: Coordinates,
  to: Coordinates,
  mode: 'walking' | 'driving' = 'walking'
): Promise<DirectionsData | null> {
  try {
    const profile = mode === 'walking' ? 'walking' : 'driving';
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${from.lng},${from.lat};${to.lng},${to.lat}?geometries=geojson&steps=true&access_token=${MAPBOX_TOKEN}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch directions');
    }
    
    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      return null;
    }
    
    const route = data.routes[0];
    
    // Extract steps with instructions
    const steps: DirectionsStep[] = route.legs[0].steps.map((step: any) => ({
      instruction: step.maneuver.instruction,
      distance: step.distance,
      duration: step.duration
    }));
    
    return {
      distance: route.distance,
      duration: route.duration,
      steps,
      mode,
      geometry: route.geometry
    };
  } catch (error) {
    console.error('Error fetching directions:', error);
    return null;
  }
}

/**
 * Estimates station coordinates based on development location
 * This is a fallback - ideally station coordinates should be in the data
 */
export function estimateStationCoordinates(
  developmentCoords: Coordinates,
  walkTimeMinutes: number
): Coordinates {
  // Average walking speed: 5 km/h = 83.33 m/min
  const distanceMeters = walkTimeMinutes * 83.33;
  
  // Convert to approximate degrees (very rough estimate)
  // 1 degree latitude ≈ 111 km
  // 1 degree longitude ≈ 111 km * cos(latitude)
  const latOffset = (distanceMeters / 111000) * (Math.random() > 0.5 ? 1 : -1);
  const lngOffset = (distanceMeters / (111000 * Math.cos(developmentCoords.lat * Math.PI / 180))) * (Math.random() > 0.5 ? 1 : -1);
  
  return {
    lat: developmentCoords.lat + latOffset,
    lng: developmentCoords.lng + lngOffset
  };
}
