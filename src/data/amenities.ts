// Mock amenities data - can be replaced with Google Places API or OpenStreetMap
export type AmenityType = 'gyms' | 'coffee' | 'restaurants' | 'parks' | 'schools';

export interface Amenity {
  id: string;
  name: string;
  type: AmenityType;
  coordinates: {
    lat: number;
    lng: number;
  };
  walkTime: number; // minutes
}

// Color scheme for each amenity type using design system
export const amenityColors: Record<AmenityType, string> = {
  gyms: '#EF4444', // red
  coffee: '#8B5CF6', // purple
  restaurants: '#F59E0B', // amber
  parks: '#10B981', // green
  schools: '#3B82F6', // blue
};

export const amenityLabels: Record<AmenityType, string> = {
  gyms: 'Gyms',
  coffee: 'Coffee Shops',
  restaurants: 'Restaurants',
  parks: 'Parks / Green Space',
  schools: 'Schools',
};

// Mock data - distributed around London properties
export const amenities: Amenity[] = [
  // Gyms
  { id: 'gym-1', name: 'PureGym Southwark', type: 'gyms', coordinates: { lat: 51.5045, lng: -0.0955 }, walkTime: 6 },
  { id: 'gym-2', name: 'The Gym Battersea', type: 'gyms', coordinates: { lat: 51.4755, lng: -0.1550 }, walkTime: 8 },
  { id: 'gym-3', name: 'Virgin Active Vauxhall', type: 'gyms', coordinates: { lat: 51.4865, lng: -0.1223 }, walkTime: 5 },
  { id: 'gym-4', name: 'David Lloyd Acton', type: 'gyms', coordinates: { lat: 51.5085, lng: -0.2675 }, walkTime: 12 },
  { id: 'gym-5', name: 'Nuffield Health Canary Wharf', type: 'gyms', coordinates: { lat: 51.5045, lng: -0.0200 }, walkTime: 7 },
  { id: 'gym-6', name: 'Fitness First Clapham', type: 'gyms', coordinates: { lat: 51.4620, lng: -0.1380 }, walkTime: 9 },
  { id: 'gym-7', name: 'Equinox Kensington', type: 'gyms', coordinates: { lat: 51.4990, lng: -0.1937 }, walkTime: 10 },
  { id: 'gym-8', name: 'Third Space Tower Bridge', type: 'gyms', coordinates: { lat: 51.5055, lng: -0.0754 }, walkTime: 4 },

  // Coffee Shops
  { id: 'coffee-1', name: 'Monmouth Coffee', type: 'coffee', coordinates: { lat: 51.5135, lng: -0.1271 }, walkTime: 3 },
  { id: 'coffee-2', name: 'Prufrock Coffee', type: 'coffee', coordinates: { lat: 51.5224, lng: -0.0925 }, walkTime: 5 },
  { id: 'coffee-3', name: 'Flat White Soho', type: 'coffee', coordinates: { lat: 51.5136, lng: -0.1355 }, walkTime: 4 },
  { id: 'coffee-4', name: 'Ozone Coffee', type: 'coffee', coordinates: { lat: 51.5245, lng: -0.0875 }, walkTime: 6 },
  { id: 'coffee-5', name: 'Caravan King\'s Cross', type: 'coffee', coordinates: { lat: 51.5355, lng: -0.1244 }, walkTime: 8 },
  { id: 'coffee-6', name: 'Grind Greenwich', type: 'coffee', coordinates: { lat: 51.4825, lng: -0.0075 }, walkTime: 7 },
  { id: 'coffee-7', name: 'Federation Coffee', type: 'coffee', coordinates: { lat: 51.4880, lng: -0.1410 }, walkTime: 5 },
  { id: 'coffee-8', name: 'Workshop Coffee', type: 'coffee', coordinates: { lat: 51.5200, lng: -0.1085 }, walkTime: 3 },

  // Restaurants
  { id: 'rest-1', name: 'Dishoom Shoreditch', type: 'restaurants', coordinates: { lat: 51.5245, lng: -0.0785 }, walkTime: 10 },
  { id: 'rest-2', name: 'Hawksmoor Borough', type: 'restaurants', coordinates: { lat: 51.5055, lng: -0.0909 }, walkTime: 7 },
  { id: 'rest-3', name: 'Padella Borough Market', type: 'restaurants', coordinates: { lat: 51.5056, lng: -0.0909 }, walkTime: 6 },
  { id: 'rest-4', name: 'Sketch Mayfair', type: 'restaurants', coordinates: { lat: 51.5135, lng: -0.1410 }, walkTime: 12 },
  { id: 'rest-5', name: 'Gymkhana', type: 'restaurants', coordinates: { lat: 51.5095, lng: -0.1405 }, walkTime: 8 },
  { id: 'rest-6', name: 'The Ivy Chelsea', type: 'restaurants', coordinates: { lat: 51.4870, lng: -0.1695 }, walkTime: 9 },
  { id: 'rest-7', name: 'Flat Iron Covent Garden', type: 'restaurants', coordinates: { lat: 51.5115, lng: -0.1225 }, walkTime: 5 },
  { id: 'rest-8', name: 'Bao Soho', type: 'restaurants', coordinates: { lat: 51.5135, lng: -0.1315 }, walkTime: 7 },

  // Parks
  { id: 'park-1', name: 'Hyde Park', type: 'parks', coordinates: { lat: 51.5074, lng: -0.1657 }, walkTime: 15 },
  { id: 'park-2', name: 'Regent\'s Park', type: 'parks', coordinates: { lat: 51.5313, lng: -0.1571 }, walkTime: 12 },
  { id: 'park-3', name: 'Battersea Park', type: 'parks', coordinates: { lat: 51.4813, lng: -0.1540 }, walkTime: 10 },
  { id: 'park-4', name: 'Victoria Park', type: 'parks', coordinates: { lat: 51.5340, lng: -0.0390 }, walkTime: 14 },
  { id: 'park-5', name: 'Greenwich Park', type: 'parks', coordinates: { lat: 51.4768, lng: 0.0025 }, walkTime: 13 },
  { id: 'park-6', name: 'Clapham Common', type: 'parks', coordinates: { lat: 51.4615, lng: -0.1380 }, walkTime: 11 },
  { id: 'park-7', name: 'Hampstead Heath', type: 'parks', coordinates: { lat: 51.5565, lng: -0.1650 }, walkTime: 20 },
  { id: 'park-8', name: 'Richmond Park', type: 'parks', coordinates: { lat: 51.4510, lng: -0.2855 }, walkTime: 25 },

  // Schools
  { id: 'school-1', name: 'City of London School', type: 'schools', coordinates: { lat: 51.5125, lng: -0.0954 }, walkTime: 8 },
  { id: 'school-2', name: 'Westminster School', type: 'schools', coordinates: { lat: 51.4995, lng: -0.1315 }, walkTime: 10 },
  { id: 'school-3', name: 'St Paul\'s School', type: 'schools', coordinates: { lat: 51.4730, lng: -0.2385 }, walkTime: 15 },
  { id: 'school-4', name: 'Thomas\'s Battersea', type: 'schools', coordinates: { lat: 51.4735, lng: -0.1645 }, walkTime: 9 },
  { id: 'school-5', name: 'Dulwich College', type: 'schools', coordinates: { lat: 51.4445, lng: -0.0840 }, walkTime: 12 },
  { id: 'school-6', name: 'King\'s College School', type: 'schools', coordinates: { lat: 51.4170, lng: -0.2795 }, walkTime: 18 },
  { id: 'school-7', name: 'The Hall School', type: 'schools', coordinates: { lat: 51.5490, lng: -0.1780 }, walkTime: 14 },
  { id: 'school-8', name: 'Francis Holland School', type: 'schools', coordinates: { lat: 51.4935, lng: -0.1665 }, walkTime: 11 },
];

// Function to get amenities near a location
export const getNearbyAmenities = (
  lat: number,
  lng: number,
  types: AmenityType[],
  maxWalkTime: number = 15
): Amenity[] => {
  if (types.length === 0) return [];

  const filtered = amenities.filter(amenity => {
    // Filter by type
    if (!types.includes(amenity.type)) return false;
    
    // Simple distance check (rough approximation)
    const latDiff = Math.abs(amenity.coordinates.lat - lat);
    const lngDiff = Math.abs(amenity.coordinates.lng - lng);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    
    // Rough conversion: 0.01 degrees ≈ 1km ≈ 12 min walk
    const estimatedWalkTime = distance * 1200;
    
    return estimatedWalkTime <= maxWalkTime;
  });

  // Limit to top 10 for performance
  return filtered.slice(0, 10);
};
