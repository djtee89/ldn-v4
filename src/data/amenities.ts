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

// Extensive amenities data across London
export const amenities: Amenity[] = [
  // Tennis Clubs (20 locations)
  { id: 'tennis-1', name: 'Queen\'s Club', type: 'tennis', coordinates: { lat: 51.4895, lng: -0.2085 }, walkTime: 12 },
  { id: 'tennis-2', name: 'Southbank Club', type: 'tennis', coordinates: { lat: 51.5015, lng: -0.1165 }, walkTime: 8 },
  { id: 'tennis-3', name: 'David Lloyd Acton', type: 'tennis', coordinates: { lat: 51.5085, lng: -0.2675 }, walkTime: 15 },
  { id: 'tennis-4', name: 'Islington Tennis Centre', type: 'tennis', coordinates: { lat: 51.5425, lng: -0.1065 }, walkTime: 10 },
  { id: 'tennis-5', name: 'Battersea Park Tennis', type: 'tennis', coordinates: { lat: 51.4813, lng: -0.1540 }, walkTime: 11 },
  { id: 'tennis-6', name: 'Wimbledon Club', type: 'tennis', coordinates: { lat: 51.4345, lng: -0.2145 }, walkTime: 14 },
  { id: 'tennis-7', name: 'Regent\'s Park Tennis', type: 'tennis', coordinates: { lat: 51.5265, lng: -0.1535 }, walkTime: 9 },
  { id: 'tennis-8', name: 'Holland Park LTC', type: 'tennis', coordinates: { lat: 51.5015, lng: -0.2025 }, walkTime: 13 },
  { id: 'tennis-9', name: 'Paddington Sports Club', type: 'tennis', coordinates: { lat: 51.5225, lng: -0.1755 }, walkTime: 11 },
  { id: 'tennis-10', name: 'Westway Sports Centre', type: 'tennis', coordinates: { lat: 51.5215, lng: -0.2105 }, walkTime: 10 },
  { id: 'tennis-11', name: 'Finsbury Park Tennis', type: 'tennis', coordinates: { lat: 51.5655, lng: -0.1075 }, walkTime: 12 },
  { id: 'tennis-12', name: 'Highbury Fields', type: 'tennis', coordinates: { lat: 51.5465, lng: -0.0985 }, walkTime: 8 },
  { id: 'tennis-13', name: 'Clapham Common LTC', type: 'tennis', coordinates: { lat: 51.4615, lng: -0.1385 }, walkTime: 13 },
  { id: 'tennis-14', name: 'Dulwich Sports Club', type: 'tennis', coordinates: { lat: 51.4435, lng: -0.0865 }, walkTime: 15 },
  { id: 'tennis-15', name: 'Brockwell Park Tennis', type: 'tennis', coordinates: { lat: 51.4525, lng: -0.1105 }, walkTime: 11 },
  { id: 'tennis-16', name: 'Greenwich Peninsula TC', type: 'tennis', coordinates: { lat: 51.4975, lng: 0.0045 }, walkTime: 14 },
  { id: 'tennis-17', name: 'Mile End Park Tennis', type: 'tennis', coordinates: { lat: 51.5245, lng: -0.0345 }, walkTime: 9 },
  { id: 'tennis-18', name: 'Victoria Park Tennis', type: 'tennis', coordinates: { lat: 51.5365, lng: -0.0415 }, walkTime: 10 },
  { id: 'tennis-19', name: 'Chiswick Sports Club', type: 'tennis', coordinates: { lat: 51.4875, lng: -0.2545 }, walkTime: 12 },
  { id: 'tennis-20', name: 'Fulham Palace Tennis', type: 'tennis', coordinates: { lat: 51.4745, lng: -0.2095 }, walkTime: 13 },

  // Grammar Schools (25 locations)
  { id: 'grammar-1', name: 'Westminster School', type: 'grammar_schools', coordinates: { lat: 51.4995, lng: -0.1315 }, walkTime: 10 },
  { id: 'grammar-2', name: 'St Paul\'s School', type: 'grammar_schools', coordinates: { lat: 51.4730, lng: -0.2385 }, walkTime: 15 },
  { id: 'grammar-3', name: 'City of London School', type: 'grammar_schools', coordinates: { lat: 51.5125, lng: -0.0954 }, walkTime: 8 },
  { id: 'grammar-4', name: 'King\'s College School', type: 'grammar_schools', coordinates: { lat: 51.4170, lng: -0.2795 }, walkTime: 18 },
  { id: 'grammar-5', name: 'Dulwich College', type: 'grammar_schools', coordinates: { lat: 51.4445, lng: -0.0840 }, walkTime: 12 },
  { id: 'grammar-6', name: 'Haberdashers\' Aske\'s', type: 'grammar_schools', coordinates: { lat: 51.6535, lng: -0.1465 }, walkTime: 20 },
  { id: 'grammar-7', name: 'St Paul\'s Girls\' School', type: 'grammar_schools', coordinates: { lat: 51.4895, lng: -0.2235 }, walkTime: 14 },
  { id: 'grammar-8', name: 'Highgate School', type: 'grammar_schools', coordinates: { lat: 51.5715, lng: -0.1525 }, walkTime: 16 },
  { id: 'grammar-9', name: 'University College School', type: 'grammar_schools', coordinates: { lat: 51.5505, lng: -0.1775 }, walkTime: 11 },
  { id: 'grammar-10', name: 'Latymer Upper School', type: 'grammar_schools', coordinates: { lat: 51.4935, lng: -0.2345 }, walkTime: 13 },
  { id: 'grammar-11', name: 'Alleyn\'s School', type: 'grammar_schools', coordinates: { lat: 51.4415, lng: -0.0795 }, walkTime: 12 },
  { id: 'grammar-12', name: 'Emanuel School', type: 'grammar_schools', coordinates: { lat: 51.4615, lng: -0.1685 }, walkTime: 15 },
  { id: 'grammar-13', name: 'Forest School', type: 'grammar_schools', coordinates: { lat: 51.5895, lng: 0.0125 }, walkTime: 22 },
  { id: 'grammar-14', name: 'James Allen\'s Girls\' School', type: 'grammar_schools', coordinates: { lat: 51.4465, lng: -0.0785 }, walkTime: 11 },
  { id: 'grammar-15', name: 'The Harrodian School', type: 'grammar_schools', coordinates: { lat: 51.4675, lng: -0.2575 }, walkTime: 17 },
  { id: 'grammar-16', name: 'Godolphin & Latymer', type: 'grammar_schools', coordinates: { lat: 51.4915, lng: -0.2215 }, walkTime: 12 },
  { id: 'grammar-17', name: 'Hampton School', type: 'grammar_schools', coordinates: { lat: 51.4185, lng: -0.3645 }, walkTime: 25 },
  { id: 'grammar-18', name: 'Kingston Grammar', type: 'grammar_schools', coordinates: { lat: 51.4145, lng: -0.3015 }, walkTime: 20 },
  { id: 'grammar-19', name: 'Wimbledon High School', type: 'grammar_schools', coordinates: { lat: 51.4245, lng: -0.2065 }, walkTime: 14 },
  { id: 'grammar-20', name: 'North London Collegiate', type: 'grammar_schools', coordinates: { lat: 51.6035, lng: -0.2785 }, walkTime: 23 },
  { id: 'grammar-21', name: 'Mill Hill School', type: 'grammar_schools', coordinates: { lat: 51.6135, lng: -0.2275 }, walkTime: 21 },
  { id: 'grammar-22', name: 'Merchant Taylors\'', type: 'grammar_schools', coordinates: { lat: 51.5985, lng: -0.4155 }, walkTime: 28 },
  { id: 'grammar-23', name: 'Channing School', type: 'grammar_schools', coordinates: { lat: 51.5735, lng: -0.1495 }, walkTime: 15 },
  { id: 'grammar-24', name: 'Francis Holland', type: 'grammar_schools', coordinates: { lat: 51.4935, lng: -0.1635 }, walkTime: 10 },
  { id: 'grammar-25', name: 'South Hampstead High', type: 'grammar_schools', coordinates: { lat: 51.5475, lng: -0.1785 }, walkTime: 13 },

  // Chinese Restaurants (30 locations)
  { id: 'chinese-1', name: 'Hakkasan Mayfair', type: 'chinese_restaurants', coordinates: { lat: 51.5115, lng: -0.1410 }, walkTime: 9 },
  { id: 'chinese-2', name: 'Yauatcha Soho', type: 'chinese_restaurants', coordinates: { lat: 51.5135, lng: -0.1325 }, walkTime: 7 },
  { id: 'chinese-3', name: 'Royal China Club', type: 'chinese_restaurants', coordinates: { lat: 51.5155, lng: -0.1585 }, walkTime: 10 },
  { id: 'chinese-4', name: 'Din Tai Fung', type: 'chinese_restaurants', coordinates: { lat: 51.5115, lng: -0.1205 }, walkTime: 6 },
  { id: 'chinese-5', name: 'Xi\'an Impression', type: 'chinese_restaurants', coordinates: { lat: 51.5325, lng: -0.1255 }, walkTime: 11 },
  { id: 'chinese-6', name: 'Kai Mayfair', type: 'chinese_restaurants', coordinates: { lat: 51.5085, lng: -0.1445 }, walkTime: 8 },
  { id: 'chinese-7', name: 'A Wong', type: 'chinese_restaurants', coordinates: { lat: 51.4945, lng: -0.1305 }, walkTime: 7 },
  { id: 'chinese-8', name: 'HKK', type: 'chinese_restaurants', coordinates: { lat: 51.5215, lng: -0.0885 }, walkTime: 9 },
  { id: 'chinese-9', name: 'Hutong', type: 'chinese_restaurants', coordinates: { lat: 51.5045, lng: -0.0325 }, walkTime: 12 },
  { id: 'chinese-10', name: 'Min Jiang', type: 'chinese_restaurants', coordinates: { lat: 51.5025, lng: -0.1955 }, walkTime: 11 },
  { id: 'chinese-11', name: 'Park Chinois', type: 'chinese_restaurants', coordinates: { lat: 51.5075, lng: -0.1445 }, walkTime: 8 },
  { id: 'chinese-12', name: 'Duddell\'s', type: 'chinese_restaurants', coordinates: { lat: 51.5115, lng: -0.1285 }, walkTime: 7 },
  { id: 'chinese-13', name: 'Xu', type: 'chinese_restaurants', coordinates: { lat: 51.5135, lng: -0.1365 }, walkTime: 8 },
  { id: 'chinese-14', name: 'Barshu', type: 'chinese_restaurants', coordinates: { lat: 51.5125, lng: -0.1305 }, walkTime: 7 },
  { id: 'chinese-15', name: 'Murger Han', type: 'chinese_restaurants', coordinates: { lat: 51.5145, lng: -0.1295 }, walkTime: 7 },
  { id: 'chinese-16', name: 'Sichuan Folk', type: 'chinese_restaurants', coordinates: { lat: 51.5245, lng: -0.0885 }, walkTime: 9 },
  { id: 'chinese-17', name: 'Hutong Shard', type: 'chinese_restaurants', coordinates: { lat: 51.5045, lng: -0.0865 }, walkTime: 8 },
  { id: 'chinese-18', name: 'Yi-Ban', type: 'chinese_restaurants', coordinates: { lat: 51.5055, lng: -0.1365 }, walkTime: 6 },
  { id: 'chinese-19', name: 'Pearl Liang', type: 'chinese_restaurants', coordinates: { lat: 51.5165, lng: -0.1765 }, walkTime: 12 },
  { id: 'chinese-20', name: 'Phoenix Palace', type: 'chinese_restaurants', coordinates: { lat: 51.5435, lng: -0.1835 }, walkTime: 13 },
  { id: 'chinese-21', name: 'Good Earth', type: 'chinese_restaurants', coordinates: { lat: 51.5025, lng: -0.1955 }, walkTime: 11 },
  { id: 'chinese-22', name: 'Mr Chow', type: 'chinese_restaurants', coordinates: { lat: 51.5085, lng: -0.1535 }, walkTime: 9 },
  { id: 'chinese-23', name: 'Hutong Brookfield', type: 'chinese_restaurants', coordinates: { lat: 51.5075, lng: -0.0325 }, walkTime: 12 },
  { id: 'chinese-24', name: 'Lotus Chinese', type: 'chinese_restaurants', coordinates: { lat: 51.5385, lng: -0.1065 }, walkTime: 10 },
  { id: 'chinese-25', name: 'Mandarin Kitchen', type: 'chinese_restaurants', coordinates: { lat: 51.5135, lng: -0.1885 }, walkTime: 13 },
  { id: 'chinese-26', name: 'Royal China Baker St', type: 'chinese_restaurants', coordinates: { lat: 51.5225, lng: -0.1585 }, walkTime: 11 },
  { id: 'chinese-27', name: 'Four Seasons', type: 'chinese_restaurants', coordinates: { lat: 51.5125, lng: -0.1315 }, walkTime: 7 },
  { id: 'chinese-28', name: 'Joy King Lau', type: 'chinese_restaurants', coordinates: { lat: 51.5115, lng: -0.1305 }, walkTime: 7 },
  { id: 'chinese-29', name: 'Leong\'s Legend', type: 'chinese_restaurants', coordinates: { lat: 51.5145, lng: -0.1285 }, walkTime: 7 },
  { id: 'chinese-30', name: 'Shanghai Modern', type: 'chinese_restaurants', coordinates: { lat: 51.5065, lng: -0.1445 }, walkTime: 8 },

  // Supermarkets (35 locations)
  { id: 'super-1', name: 'Waitrose Borough', type: 'supermarkets', coordinates: { lat: 51.5055, lng: -0.0909 }, walkTime: 5 },
  { id: 'super-2', name: 'Tesco Kennington', type: 'supermarkets', coordinates: { lat: 51.4885, lng: -0.1115 }, walkTime: 7 },
  { id: 'super-3', name: 'Sainsbury\'s Vauxhall', type: 'supermarkets', coordinates: { lat: 51.4865, lng: -0.1223 }, walkTime: 6 },
  { id: 'super-4', name: 'M&S Chelsea', type: 'supermarkets', coordinates: { lat: 51.4870, lng: -0.1695 }, walkTime: 8 },
  { id: 'super-5', name: 'Whole Foods Piccadilly', type: 'supermarkets', coordinates: { lat: 51.5075, lng: -0.1355 }, walkTime: 9 },
  { id: 'super-6', name: 'Waitrose King\'s Cross', type: 'supermarkets', coordinates: { lat: 51.5305, lng: -0.1225 }, walkTime: 8 },
  { id: 'super-7', name: 'Tesco Covent Garden', type: 'supermarkets', coordinates: { lat: 51.5125, lng: -0.1235 }, walkTime: 6 },
  { id: 'super-8', name: 'Sainsbury\'s Holborn', type: 'supermarkets', coordinates: { lat: 51.5175, lng: -0.1165 }, walkTime: 7 },
  { id: 'super-9', name: 'M&S Marble Arch', type: 'supermarkets', coordinates: { lat: 51.5135, lng: -0.1595 }, walkTime: 10 },
  { id: 'super-10', name: 'Whole Foods Kensington', type: 'supermarkets', coordinates: { lat: 51.4995, lng: -0.1925 }, walkTime: 11 },
  { id: 'super-11', name: 'Waitrose Canary Wharf', type: 'supermarkets', coordinates: { lat: 51.5045, lng: -0.0195 }, walkTime: 8 },
  { id: 'super-12', name: 'Tesco Tower Bridge', type: 'supermarkets', coordinates: { lat: 51.5055, lng: -0.0745 }, walkTime: 5 },
  { id: 'super-13', name: 'Sainsbury\'s Angel', type: 'supermarkets', coordinates: { lat: 51.5325, lng: -0.1055 }, walkTime: 9 },
  { id: 'super-14', name: 'M&S Bank', type: 'supermarkets', coordinates: { lat: 51.5135, lng: -0.0885 }, walkTime: 6 },
  { id: 'super-15', name: 'Waitrose Belgravia', type: 'supermarkets', coordinates: { lat: 51.4965, lng: -0.1475 }, walkTime: 8 },
  { id: 'super-16', name: 'Tesco Battersea', type: 'supermarkets', coordinates: { lat: 51.4755, lng: -0.1665 }, walkTime: 10 },
  { id: 'super-17', name: 'Sainsbury\'s Clapham', type: 'supermarkets', coordinates: { lat: 51.4625, lng: -0.1385 }, walkTime: 12 },
  { id: 'super-18', name: 'M&S Notting Hill', type: 'supermarkets', coordinates: { lat: 51.5095, lng: -0.2065 }, walkTime: 11 },
  { id: 'super-19', name: 'Whole Foods Camden', type: 'supermarkets', coordinates: { lat: 51.5415, lng: -0.1435 }, walkTime: 10 },
  { id: 'super-20', name: 'Waitrose Bloomsbury', type: 'supermarkets', coordinates: { lat: 51.5215, lng: -0.1265 }, walkTime: 7 },
  { id: 'super-21', name: 'Tesco Shoreditch', type: 'supermarkets', coordinates: { lat: 51.5245, lng: -0.0775 }, walkTime: 8 },
  { id: 'super-22', name: 'Sainsbury\'s Victoria', type: 'supermarkets', coordinates: { lat: 51.4945, lng: -0.1435 }, walkTime: 7 },
  { id: 'super-23', name: 'M&S Liverpool Street', type: 'supermarkets', coordinates: { lat: 51.5185, lng: -0.0825 }, walkTime: 6 },
  { id: 'super-24', name: 'Waitrose Finsbury', type: 'supermarkets', coordinates: { lat: 51.5455, lng: -0.1025 }, walkTime: 9 },
  { id: 'super-25', name: 'Tesco Fulham', type: 'supermarkets', coordinates: { lat: 51.4815, lng: -0.1955 }, walkTime: 11 },
  { id: 'super-26', name: 'Sainsbury\'s Greenwich', type: 'supermarkets', coordinates: { lat: 51.4835, lng: -0.0075 }, walkTime: 10 },
  { id: 'super-27', name: 'M&S Stratford', type: 'supermarkets', coordinates: { lat: 51.5435, lng: -0.0035 }, walkTime: 12 },
  { id: 'super-28', name: 'Whole Foods Stoke Newington', type: 'supermarkets', coordinates: { lat: 51.5625, lng: -0.0755 }, walkTime: 13 },
  { id: 'super-29', name: 'Waitrose Marylebone', type: 'supermarkets', coordinates: { lat: 51.5225, lng: -0.1545 }, walkTime: 9 },
  { id: 'super-30', name: 'Tesco Pimlico', type: 'supermarkets', coordinates: { lat: 51.4885, lng: -0.1345 }, walkTime: 7 },
  { id: 'super-31', name: 'Sainsbury\'s Balham', type: 'supermarkets', coordinates: { lat: 51.4435, lng: -0.1525 }, walkTime: 14 },
  { id: 'super-32', name: 'M&S Hammersmith', type: 'supermarkets', coordinates: { lat: 51.4935, lng: -0.2235 }, walkTime: 12 },
  { id: 'super-33', name: 'Waitrose Wimbledon', type: 'supermarkets', coordinates: { lat: 51.4215, lng: -0.2065 }, walkTime: 16 },
  { id: 'super-34', name: 'Tesco Islington', type: 'supermarkets', coordinates: { lat: 51.5385, lng: -0.1035 }, walkTime: 10 },
  { id: 'super-35', name: 'Sainsbury\'s Blackheath', type: 'supermarkets', coordinates: { lat: 51.4645, lng: 0.0065 }, walkTime: 13 },

  // Parks (20 locations)
  { id: 'park-1', name: 'Hyde Park', type: 'parks', coordinates: { lat: 51.5074, lng: -0.1657 }, walkTime: 15 },
  { id: 'park-2', name: 'Regent\'s Park', type: 'parks', coordinates: { lat: 51.5313, lng: -0.1571 }, walkTime: 12 },
  { id: 'park-3', name: 'Battersea Park', type: 'parks', coordinates: { lat: 51.4813, lng: -0.1540 }, walkTime: 10 },
  { id: 'park-4', name: 'Victoria Park', type: 'parks', coordinates: { lat: 51.5340, lng: -0.0390 }, walkTime: 14 },
  { id: 'park-5', name: 'Greenwich Park', type: 'parks', coordinates: { lat: 51.4768, lng: 0.0025 }, walkTime: 13 },
  { id: 'park-6', name: 'Richmond Park', type: 'parks', coordinates: { lat: 51.4510, lng: -0.2760 }, walkTime: 25 },
  { id: 'park-7', name: 'Hampstead Heath', type: 'parks', coordinates: { lat: 51.5565, lng: -0.1645 }, walkTime: 18 },
  { id: 'park-8', name: 'Clapham Common', type: 'parks', coordinates: { lat: 51.4615, lng: -0.1385 }, walkTime: 12 },
  { id: 'park-9', name: 'Holland Park', type: 'parks', coordinates: { lat: 51.5025, lng: -0.2035 }, walkTime: 13 },
  { id: 'park-10', name: 'Kensington Gardens', type: 'parks', coordinates: { lat: 51.5065, lng: -0.1795 }, walkTime: 14 },
  { id: 'park-11', name: 'St James\'s Park', type: 'parks', coordinates: { lat: 51.5045, lng: -0.1335 }, walkTime: 8 },
  { id: 'park-12', name: 'Green Park', type: 'parks', coordinates: { lat: 51.5055, lng: -0.1425 }, walkTime: 9 },
  { id: 'park-13', name: 'Finsbury Park', type: 'parks', coordinates: { lat: 51.5655, lng: -0.1075 }, walkTime: 15 },
  { id: 'park-14', name: 'Brockwell Park', type: 'parks', coordinates: { lat: 51.4525, lng: -0.1105 }, walkTime: 11 },
  { id: 'park-15', name: 'Burgess Park', type: 'parks', coordinates: { lat: 51.4815, lng: -0.0825 }, walkTime: 10 },
  { id: 'park-16', name: 'Dulwich Park', type: 'parks', coordinates: { lat: 51.4445, lng: -0.0825 }, walkTime: 12 },
  { id: 'park-17', name: 'Bushy Park', type: 'parks', coordinates: { lat: 51.4105, lng: -0.3345 }, walkTime: 28 },
  { id: 'park-18', name: 'Primrose Hill', type: 'parks', coordinates: { lat: 51.5405, lng: -0.1635 }, walkTime: 11 },
  { id: 'park-19', name: 'Blackheath', type: 'parks', coordinates: { lat: 51.4665, lng: 0.0045 }, walkTime: 13 },
  { id: 'park-20', name: 'Tooting Common', type: 'parks', coordinates: { lat: 51.4365, lng: -0.1615 }, walkTime: 16 },

  // Gyms (30 locations)
  { id: 'gym-1', name: 'PureGym Southwark', type: 'gyms', coordinates: { lat: 51.5045, lng: -0.0955 }, walkTime: 6 },
  { id: 'gym-2', name: 'The Gym Battersea', type: 'gyms', coordinates: { lat: 51.4755, lng: -0.1550 }, walkTime: 8 },
  { id: 'gym-3', name: 'Virgin Active Vauxhall', type: 'gyms', coordinates: { lat: 51.4865, lng: -0.1223 }, walkTime: 5 },
  { id: 'gym-4', name: 'Equinox Kensington', type: 'gyms', coordinates: { lat: 51.4990, lng: -0.1937 }, walkTime: 10 },
  { id: 'gym-5', name: 'Third Space Tower Bridge', type: 'gyms', coordinates: { lat: 51.5055, lng: -0.0754 }, walkTime: 4 },
  { id: 'gym-6', name: 'David Lloyd Marble Arch', type: 'gyms', coordinates: { lat: 51.5145, lng: -0.1625 }, walkTime: 11 },
  { id: 'gym-7', name: 'Nuffield Health Moorgate', type: 'gyms', coordinates: { lat: 51.5185, lng: -0.0885 }, walkTime: 7 },
  { id: 'gym-8', name: 'Fitness First Tottenham Ct', type: 'gyms', coordinates: { lat: 51.5175, lng: -0.1305 }, walkTime: 8 },
  { id: 'gym-9', name: 'Gymbox Holborn', type: 'gyms', coordinates: { lat: 51.5175, lng: -0.1185 }, walkTime: 6 },
  { id: 'gym-10', name: 'Barry\'s Bootcamp Soho', type: 'gyms', coordinates: { lat: 51.5135, lng: -0.1345 }, walkTime: 7 },
  { id: 'gym-11', name: 'F45 Shoreditch', type: 'gyms', coordinates: { lat: 51.5235, lng: -0.0795 }, walkTime: 9 },
  { id: 'gym-12', name: 'Orangetheory Chelsea', type: 'gyms', coordinates: { lat: 51.4875, lng: -0.1685 }, walkTime: 10 },
  { id: 'gym-13', name: '1Rebel Victoria', type: 'gyms', coordinates: { lat: 51.4955, lng: -0.1445 }, walkTime: 8 },
  { id: 'gym-14', name: 'Pure Gym Covent Garden', type: 'gyms', coordinates: { lat: 51.5125, lng: -0.1245 }, walkTime: 6 },
  { id: 'gym-15', name: 'Fitness First Barbican', type: 'gyms', coordinates: { lat: 51.5205, lng: -0.0975 }, walkTime: 7 },
  { id: 'gym-16', name: 'Gymbox Bank', type: 'gyms', coordinates: { lat: 51.5135, lng: -0.0895 }, walkTime: 5 },
  { id: 'gym-17', name: 'Virgin Active Canary Wharf', type: 'gyms', coordinates: { lat: 51.5045, lng: -0.0205 }, walkTime: 9 },
  { id: 'gym-18', name: 'Third Space Canary Wharf', type: 'gyms', coordinates: { lat: 51.5035, lng: -0.0185 }, walkTime: 9 },
  { id: 'gym-19', name: 'Equinox St James\'s', type: 'gyms', coordinates: { lat: 51.5085, lng: -0.1385 }, walkTime: 8 },
  { id: 'gym-20', name: 'Pure Gym Angel', type: 'gyms', coordinates: { lat: 51.5325, lng: -0.1065 }, walkTime: 10 },
  { id: 'gym-21', name: 'David Lloyd Acton', type: 'gyms', coordinates: { lat: 51.5085, lng: -0.2685 }, walkTime: 14 },
  { id: 'gym-22', name: 'Nuffield Health Moorgate', type: 'gyms', coordinates: { lat: 51.5185, lng: -0.0895 }, walkTime: 7 },
  { id: 'gym-23', name: 'Barry\'s Bootcamp Fulham', type: 'gyms', coordinates: { lat: 51.4815, lng: -0.1935 }, walkTime: 11 },
  { id: 'gym-24', name: 'F45 Clapham', type: 'gyms', coordinates: { lat: 51.4625, lng: -0.1395 }, walkTime: 13 },
  { id: 'gym-25', name: 'Pure Gym Camden', type: 'gyms', coordinates: { lat: 51.5415, lng: -0.1445 }, walkTime: 11 },
  { id: 'gym-26', name: 'Fitness First Stratford', type: 'gyms', coordinates: { lat: 51.5435, lng: -0.0045 }, walkTime: 12 },
  { id: 'gym-27', name: 'Gymbox Farringdon', type: 'gyms', coordinates: { lat: 51.5205, lng: -0.1045 }, walkTime: 7 },
  { id: 'gym-28', name: '1Rebel St Mary Axe', type: 'gyms', coordinates: { lat: 51.5145, lng: -0.0785 }, walkTime: 6 },
  { id: 'gym-29', name: 'Third Space Marylebone', type: 'gyms', coordinates: { lat: 51.5215, lng: -0.1545 }, walkTime: 10 },
  { id: 'gym-30', name: 'Equinox Bishopsgate', type: 'gyms', coordinates: { lat: 51.5165, lng: -0.0815 }, walkTime: 7 },

  // Hospitals / Clinics (25 locations)
  { id: 'hospital-1', name: 'Guy\'s Hospital', type: 'hospitals', coordinates: { lat: 51.5035, lng: -0.0875 }, walkTime: 8 },
  { id: 'hospital-2', name: 'St Thomas\' Hospital', type: 'hospitals', coordinates: { lat: 51.4985, lng: -0.1175 }, walkTime: 9 },
  { id: 'hospital-3', name: 'Chelsea & Westminster', type: 'hospitals', coordinates: { lat: 51.4815, lng: -0.1775 }, walkTime: 12 },
  { id: 'hospital-4', name: 'Royal London Hospital', type: 'hospitals', coordinates: { lat: 51.5175, lng: -0.0605 }, walkTime: 10 },
  { id: 'hospital-5', name: 'King\'s College Hospital', type: 'hospitals', coordinates: { lat: 51.4685, lng: -0.0925 }, walkTime: 11 },
  { id: 'hospital-6', name: 'University College Hospital', type: 'hospitals', coordinates: { lat: 51.5245, lng: -0.1355 }, walkTime: 9 },
  { id: 'hospital-7', name: 'St Mary\'s Hospital', type: 'hospitals', coordinates: { lat: 51.5175, lng: -0.1725 }, walkTime: 12 },
  { id: 'hospital-8', name: 'The Royal Marsden', type: 'hospitals', coordinates: { lat: 51.4865, lng: -0.1765 }, walkTime: 11 },
  { id: 'hospital-9', name: 'Great Ormond Street', type: 'hospitals', coordinates: { lat: 51.5215, lng: -0.1205 }, walkTime: 8 },
  { id: 'hospital-10', name: 'Moorfields Eye Hospital', type: 'hospitals', coordinates: { lat: 51.5235, lng: -0.0885 }, walkTime: 7 },
  { id: 'hospital-11', name: 'The Lister Hospital', type: 'hospitals', coordinates: { lat: 51.4885, lng: -0.1675 }, walkTime: 10 },
  { id: 'hospital-12', name: 'The Wellington Hospital', type: 'hospitals', coordinates: { lat: 51.5345, lng: -0.1695 }, walkTime: 13 },
  { id: 'hospital-13', name: 'The Portland Hospital', type: 'hospitals', coordinates: { lat: 51.5185, lng: -0.1455 }, walkTime: 10 },
  { id: 'hospital-14', name: 'London Bridge Hospital', type: 'hospitals', coordinates: { lat: 51.5045, lng: -0.0865 }, walkTime: 8 },
  { id: 'hospital-15', name: 'Princess Grace Hospital', type: 'hospitals', coordinates: { lat: 51.5215, lng: -0.1545 }, walkTime: 11 },
  { id: 'hospital-16', name: 'Royal Free Hospital', type: 'hospitals', coordinates: { lat: 51.5505, lng: -0.1645 }, walkTime: 14 },
  { id: 'hospital-17', name: 'Whittington Hospital', type: 'hospitals', coordinates: { lat: 51.5645, lng: -0.1385 }, walkTime: 15 },
  { id: 'hospital-18', name: 'Homerton Hospital', type: 'hospitals', coordinates: { lat: 51.5505, lng: -0.0425 }, walkTime: 13 },
  { id: 'hospital-19', name: 'St George\'s Hospital', type: 'hospitals', coordinates: { lat: 51.4265, lng: -0.1735 }, walkTime: 16 },
  { id: 'hospital-20', name: 'Charing Cross Hospital', type: 'hospitals', coordinates: { lat: 51.4875, lng: -0.2205 }, walkTime: 13 },
  { id: 'hospital-21', name: 'Queen Mary\'s Hospital', type: 'hospitals', coordinates: { lat: 51.4225, lng: -0.3325 }, walkTime: 25 },
  { id: 'hospital-22', name: 'Hammersmith Hospital', type: 'hospitals', coordinates: { lat: 51.5175, lng: -0.2325 }, walkTime: 14 },
  { id: 'hospital-23', name: 'Newham Hospital', type: 'hospitals', coordinates: { lat: 51.5255, lng: 0.0295 }, walkTime: 15 },
  { id: 'hospital-24', name: 'The Cromwell Hospital', type: 'hospitals', coordinates: { lat: 51.4965, lng: -0.1925 }, walkTime: 11 },
  { id: 'hospital-25', name: 'Guys & St Thomas Private', type: 'hospitals', coordinates: { lat: 51.5025, lng: -0.1165 }, walkTime: 9 },

  // Cafés (40 locations)
  { id: 'cafe-1', name: 'Monmouth Coffee', type: 'cafes', coordinates: { lat: 51.5135, lng: -0.1271 }, walkTime: 3 },
  { id: 'cafe-2', name: 'Prufrock Coffee', type: 'cafes', coordinates: { lat: 51.5224, lng: -0.0925 }, walkTime: 5 },
  { id: 'cafe-3', name: 'Flat White Soho', type: 'cafes', coordinates: { lat: 51.5136, lng: -0.1355 }, walkTime: 4 },
  { id: 'cafe-4', name: 'Caravan King\'s Cross', type: 'cafes', coordinates: { lat: 51.5355, lng: -0.1244 }, walkTime: 8 },
  { id: 'cafe-5', name: 'Workshop Coffee', type: 'cafes', coordinates: { lat: 51.5200, lng: -0.1085 }, walkTime: 3 },
  { id: 'cafe-6', name: 'Attendant', type: 'cafes', coordinates: { lat: 51.5185, lng: -0.1305 }, walkTime: 4 },
  { id: 'cafe-7', name: 'Kaffeine', type: 'cafes', coordinates: { lat: 51.5195, lng: -0.1365 }, walkTime: 5 },
  { id: 'cafe-8', name: 'The Espresso Room', type: 'cafes', coordinates: { lat: 51.5145, lng: -0.1285 }, walkTime: 4 },
  { id: 'cafe-9', name: 'TAP Coffee Tottenham Ct', type: 'cafes', coordinates: { lat: 51.5175, lng: -0.1315 }, walkTime: 5 },
  { id: 'cafe-10', name: 'Ozone Coffee', type: 'cafes', coordinates: { lat: 51.5245, lng: -0.0885 }, walkTime: 6 },
  { id: 'cafe-11', name: 'Grind Holborn', type: 'cafes', coordinates: { lat: 51.5175, lng: -0.1175 }, walkTime: 4 },
  { id: 'cafe-12', name: 'Department of Coffee', type: 'cafes', coordinates: { lat: 51.5225, lng: -0.0895 }, walkTime: 5 },
  { id: 'cafe-13', name: 'Nude Espresso', type: 'cafes', coordinates: { lat: 51.5235, lng: -0.0775 }, walkTime: 6 },
  { id: 'cafe-14', name: 'Fix Coffee', type: 'cafes', coordinates: { lat: 51.5225, lng: -0.0805 }, walkTime: 6 },
  { id: 'cafe-15', name: 'Ginger & White', type: 'cafes', coordinates: { lat: 51.5455, lng: -0.1735 }, walkTime: 10 },
  { id: 'cafe-16', name: 'Coffee Plant', type: 'cafes', coordinates: { lat: 51.5165, lng: -0.1765 }, walkTime: 8 },
  { id: 'cafe-17', name: 'Fernandez & Wells', type: 'cafes', coordinates: { lat: 51.5135, lng: -0.1335 }, walkTime: 4 },
  { id: 'cafe-18', name: 'Rapha Cycle Club', type: 'cafes', coordinates: { lat: 51.5135, lng: -0.1315 }, walkTime: 4 },
  { id: 'cafe-19', name: 'Notes Coffee', type: 'cafes', coordinates: { lat: 51.5115, lng: -0.1265 }, walkTime: 3 },
  { id: 'cafe-20', name: 'Alchemy Cafe', type: 'cafes', coordinates: { lat: 51.5075, lng: -0.0895 }, walkTime: 5 },
  { id: 'cafe-21', name: 'Look Mum No Hands', type: 'cafes', coordinates: { lat: 51.5225, lng: -0.1055 }, walkTime: 5 },
  { id: 'cafe-22', name: 'Timberyard', type: 'cafes', coordinates: { lat: 51.5125, lng: -0.1285 }, walkTime: 4 },
  { id: 'cafe-23', name: 'Saint Espresso', type: 'cafes', coordinates: { lat: 51.5335, lng: -0.1055 }, walkTime: 7 },
  { id: 'cafe-24', name: 'Bea\'s of Bloomsbury', type: 'cafes', coordinates: { lat: 51.5215, lng: -0.1255 }, walkTime: 4 },
  { id: 'cafe-25', name: 'Lantana', type: 'cafes', coordinates: { lat: 51.5195, lng: -0.1345 }, walkTime: 5 },
  { id: 'cafe-26', name: 'Store Street Espresso', type: 'cafes', coordinates: { lat: 51.5215, lng: -0.1315 }, walkTime: 5 },
  { id: 'cafe-27', name: 'Farm Girl', type: 'cafes', coordinates: { lat: 51.5155, lng: -0.2045 }, walkTime: 9 },
  { id: 'cafe-28', name: 'Gail\'s Bakery Shoreditch', type: 'cafes', coordinates: { lat: 51.5255, lng: -0.0805 }, walkTime: 6 },
  { id: 'cafe-29', name: 'Black Sheep Coffee', type: 'cafes', coordinates: { lat: 51.5145, lng: -0.0785 }, walkTime: 5 },
  { id: 'cafe-30', name: 'Daisy Green', type: 'cafes', coordinates: { lat: 51.5145, lng: -0.1585 }, walkTime: 7 },
  { id: 'cafe-31', name: 'Iris & June', type: 'cafes', coordinates: { lat: 51.5335, lng: -0.1025 }, walkTime: 7 },
  { id: 'cafe-32', name: 'Ethos Coffee', type: 'cafes', coordinates: { lat: 51.5195, lng: -0.1375 }, walkTime: 5 },
  { id: 'cafe-33', name: 'Origin Coffee', type: 'cafes', coordinates: { lat: 51.5115, lng: -0.1285 }, walkTime: 4 },
  { id: 'cafe-34', name: 'Campbell & Syme', type: 'cafes', coordinates: { lat: 51.5185, lng: -0.1385 }, walkTime: 5 },
  { id: 'cafe-35', name: 'Scooter Caffé', type: 'cafes', coordinates: { lat: 51.4625, lng: -0.1405 }, walkTime: 9 },
  { id: 'cafe-36', name: 'Pavilion Café', type: 'cafes', coordinates: { lat: 51.5345, lng: -0.0405 }, walkTime: 10 },
  { id: 'cafe-37', name: 'E5 Bakehouse', type: 'cafes', coordinates: { lat: 51.5605, lng: -0.0545 }, walkTime: 12 },
  { id: 'cafe-38', name: 'Climpson & Sons', type: 'cafes', coordinates: { lat: 51.5465, lng: -0.0545 }, walkTime: 11 },
  { id: 'cafe-39', name: 'The Watch House', type: 'cafes', coordinates: { lat: 51.5055, lng: -0.0815 }, walkTime: 5 },
  { id: 'cafe-40', name: 'Copper Grind', type: 'cafes', coordinates: { lat: 51.5115, lng: -0.0895 }, walkTime: 4 },
];

// Get all amenities by selected types (for map display)
export const getAmenitiesByTypes = (types: AmenityType[]): Amenity[] => {
  if (types.length === 0) return [];
  return amenities.filter(amenity => types.includes(amenity.type));
};

// Function to get amenities near a location (for property popup - top 3)
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
