// Mock amenities data - can be replaced with Google Places API or OpenStreetMap
export type AmenityType = 'tennis' | 'grammar_schools' | 'chinese_restaurants' | 'supermarkets' | 'parks' | 'gyms' | 'hospitals' | 'cafes';

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

// Color scheme for each amenity type
export const amenityColors: Record<AmenityType, string> = {
  tennis: '#EC4899', // pink
  grammar_schools: '#8B5CF6', // purple
  chinese_restaurants: '#EF4444', // red
  supermarkets: '#F59E0B', // amber
  parks: '#10B981', // green
  gyms: '#3B82F6', // blue
  hospitals: '#DC2626', // dark red
  cafes: '#6366F1', // indigo
};

export const amenityLabels: Record<AmenityType, string> = {
  tennis: 'Tennis Clubs',
  grammar_schools: 'Top Grammar Schools',
  chinese_restaurants: 'Chinese Restaurants',
  supermarkets: 'Supermarkets',
  parks: 'Parks / Green Space',
  gyms: 'Gyms',
  hospitals: 'Hospitals / Clinics',
  cafes: 'Cafés',
};

// Mock data - distributed around London properties
export const amenities: Amenity[] = [
  // Tennis Clubs
  { id: 'tennis-1', name: 'Queen\'s Club', type: 'tennis', coordinates: { lat: 51.4895, lng: -0.2085 }, walkTime: 12 },
  { id: 'tennis-2', name: 'Southbank Club', type: 'tennis', coordinates: { lat: 51.5015, lng: -0.1165 }, walkTime: 8 },
  { id: 'tennis-3', name: 'David Lloyd Acton', type: 'tennis', coordinates: { lat: 51.5085, lng: -0.2675 }, walkTime: 15 },
  { id: 'tennis-4', name: 'Islington Tennis Centre', type: 'tennis', coordinates: { lat: 51.5425, lng: -0.1065 }, walkTime: 10 },
  { id: 'tennis-5', name: 'Battersea Park Tennis', type: 'tennis', coordinates: { lat: 51.4813, lng: -0.1540 }, walkTime: 11 },

  // Grammar Schools
  { id: 'grammar-1', name: 'Westminster School', type: 'grammar_schools', coordinates: { lat: 51.4995, lng: -0.1315 }, walkTime: 10 },
  { id: 'grammar-2', name: 'St Paul\'s School', type: 'grammar_schools', coordinates: { lat: 51.4730, lng: -0.2385 }, walkTime: 15 },
  { id: 'grammar-3', name: 'City of London School', type: 'grammar_schools', coordinates: { lat: 51.5125, lng: -0.0954 }, walkTime: 8 },
  { id: 'grammar-4', name: 'King\'s College School', type: 'grammar_schools', coordinates: { lat: 51.4170, lng: -0.2795 }, walkTime: 18 },
  { id: 'grammar-5', name: 'Dulwich College', type: 'grammar_schools', coordinates: { lat: 51.4445, lng: -0.0840 }, walkTime: 12 },

  // Chinese Restaurants
  { id: 'chinese-1', name: 'Hakkasan Mayfair', type: 'chinese_restaurants', coordinates: { lat: 51.5115, lng: -0.1410 }, walkTime: 9 },
  { id: 'chinese-2', name: 'Yauatcha Soho', type: 'chinese_restaurants', coordinates: { lat: 51.5135, lng: -0.1325 }, walkTime: 7 },
  { id: 'chinese-3', name: 'Royal China Club', type: 'chinese_restaurants', coordinates: { lat: 51.5155, lng: -0.1585 }, walkTime: 10 },
  { id: 'chinese-4', name: 'Din Tai Fung', type: 'chinese_restaurants', coordinates: { lat: 51.5115, lng: -0.1205 }, walkTime: 6 },
  { id: 'chinese-5', name: 'Xi\'an Impression', type: 'chinese_restaurants', coordinates: { lat: 51.5325, lng: -0.1255 }, walkTime: 11 },

  // Supermarkets
  { id: 'super-1', name: 'Waitrose Borough', type: 'supermarkets', coordinates: { lat: 51.5055, lng: -0.0909 }, walkTime: 5 },
  { id: 'super-2', name: 'Tesco Kennington', type: 'supermarkets', coordinates: { lat: 51.4885, lng: -0.1115 }, walkTime: 7 },
  { id: 'super-3', name: 'Sainsbury\'s Vauxhall', type: 'supermarkets', coordinates: { lat: 51.4865, lng: -0.1223 }, walkTime: 6 },
  { id: 'super-4', name: 'M&S Chelsea', type: 'supermarkets', coordinates: { lat: 51.4870, lng: -0.1695 }, walkTime: 8 },
  { id: 'super-5', name: 'Whole Foods Piccadilly', type: 'supermarkets', coordinates: { lat: 51.5075, lng: -0.1355 }, walkTime: 9 },

  // Parks
  { id: 'park-1', name: 'Hyde Park', type: 'parks', coordinates: { lat: 51.5074, lng: -0.1657 }, walkTime: 15 },
  { id: 'park-2', name: 'Regent\'s Park', type: 'parks', coordinates: { lat: 51.5313, lng: -0.1571 }, walkTime: 12 },
  { id: 'park-3', name: 'Battersea Park', type: 'parks', coordinates: { lat: 51.4813, lng: -0.1540 }, walkTime: 10 },
  { id: 'park-4', name: 'Victoria Park', type: 'parks', coordinates: { lat: 51.5340, lng: -0.0390 }, walkTime: 14 },
  { id: 'park-5', name: 'Greenwich Park', type: 'parks', coordinates: { lat: 51.4768, lng: 0.0025 }, walkTime: 13 },

  // Gyms
  { id: 'gym-1', name: 'PureGym Southwark', type: 'gyms', coordinates: { lat: 51.5045, lng: -0.0955 }, walkTime: 6 },
  { id: 'gym-2', name: 'The Gym Battersea', type: 'gyms', coordinates: { lat: 51.4755, lng: -0.1550 }, walkTime: 8 },
  { id: 'gym-3', name: 'Virgin Active Vauxhall', type: 'gyms', coordinates: { lat: 51.4865, lng: -0.1223 }, walkTime: 5 },
  { id: 'gym-4', name: 'Equinox Kensington', type: 'gyms', coordinates: { lat: 51.4990, lng: -0.1937 }, walkTime: 10 },
  { id: 'gym-5', name: 'Third Space Tower Bridge', type: 'gyms', coordinates: { lat: 51.5055, lng: -0.0754 }, walkTime: 4 },

  // Hospitals / Clinics
  { id: 'hospital-1', name: 'Guy\'s Hospital', type: 'hospitals', coordinates: { lat: 51.5035, lng: -0.0875 }, walkTime: 8 },
  { id: 'hospital-2', name: 'St Thomas\' Hospital', type: 'hospitals', coordinates: { lat: 51.4985, lng: -0.1175 }, walkTime: 9 },
  { id: 'hospital-3', name: 'Chelsea & Westminster', type: 'hospitals', coordinates: { lat: 51.4815, lng: -0.1775 }, walkTime: 12 },
  { id: 'hospital-4', name: 'Royal London Hospital', type: 'hospitals', coordinates: { lat: 51.5175, lng: -0.0605 }, walkTime: 10 },
  { id: 'hospital-5', name: 'King\'s College Hospital', type: 'hospitals', coordinates: { lat: 51.4685, lng: -0.0925 }, walkTime: 11 },

  // Cafés
  { id: 'cafe-1', name: 'Monmouth Coffee', type: 'cafes', coordinates: { lat: 51.5135, lng: -0.1271 }, walkTime: 3 },
  { id: 'cafe-2', name: 'Prufrock Coffee', type: 'cafes', coordinates: { lat: 51.5224, lng: -0.0925 }, walkTime: 5 },
  { id: 'cafe-3', name: 'Flat White Soho', type: 'cafes', coordinates: { lat: 51.5136, lng: -0.1355 }, walkTime: 4 },
  { id: 'cafe-4', name: 'Caravan King\'s Cross', type: 'cafes', coordinates: { lat: 51.5355, lng: -0.1244 }, walkTime: 8 },
  { id: 'cafe-5', name: 'Workshop Coffee', type: 'cafes', coordinates: { lat: 51.5200, lng: -0.1085 }, walkTime: 3 },
];

// Function to get amenities near a location (within 1.5km / ~18 min walk)
export const getNearbyAmenities = (
  lat: number,
  lng: number,
  types: AmenityType[],
  maxDistanceKm: number = 1.5
): Amenity[] => {
  if (types.length === 0) return [];

  const filtered = amenities.filter(amenity => {
    // Filter by type
    if (!types.includes(amenity.type)) return false;
    
    // Calculate distance in km (rough approximation)
    const latDiff = Math.abs(amenity.coordinates.lat - lat);
    const lngDiff = Math.abs(amenity.coordinates.lng - lng);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // degrees to km
    
    return distance <= maxDistanceKm;
  });

  // Sort by distance and limit to top 10 per type for performance
  return filtered
    .sort((a, b) => {
      const distA = Math.sqrt(
        Math.pow(a.coordinates.lat - lat, 2) + Math.pow(a.coordinates.lng - lng, 2)
      );
      const distB = Math.sqrt(
        Math.pow(b.coordinates.lat - lat, 2) + Math.pow(b.coordinates.lng - lng, 2)
      );
      return distA - distB;
    })
    .slice(0, 10);
};
