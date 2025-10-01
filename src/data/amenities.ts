// Mock amenities data - can be replaced with Google Places API or OpenStreetMap
export type AmenityType = 'tennis' | 'grammar_schools' | 'chinese_restaurants' | 'supermarkets' | 'parks' | 'gyms' | 'hospitals' | 'cafes' | 'private_schools';

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
  private_schools: '#D946EF', // fuchsia
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
  private_schools: 'Top Private Schools',
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

  // Grammar Schools (50 locations)
  { id: 'grammar-1', name: 'Westminster School', type: 'grammar_schools', coordinates: { lat: 51.4995, lng: -0.1315 }, walkTime: 10 },
  { id: 'grammar-2', name: 'St Paul\'s Girls\' School', type: 'grammar_schools', coordinates: { lat: 51.4895, lng: -0.2235 }, walkTime: 14 },
  { id: 'grammar-3', name: 'St Paul\'s School', type: 'grammar_schools', coordinates: { lat: 51.4715, lng: -0.2415 }, walkTime: 15 },
  { id: 'grammar-4', name: 'King\'s College School', type: 'grammar_schools', coordinates: { lat: 51.4170, lng: -0.2075 }, walkTime: 18 },
  { id: 'grammar-5', name: 'North London Collegiate School', type: 'grammar_schools', coordinates: { lat: 51.6135, lng: -0.2895 }, walkTime: 23 },
  { id: 'grammar-6', name: 'Godolphin & Latymer', type: 'grammar_schools', coordinates: { lat: 51.4915, lng: -0.2215 }, walkTime: 12 },
  { id: 'grammar-7', name: 'Latymer Upper School', type: 'grammar_schools', coordinates: { lat: 51.4935, lng: -0.2345 }, walkTime: 13 },
  { id: 'grammar-8', name: 'Highgate School', type: 'grammar_schools', coordinates: { lat: 51.5715, lng: -0.1525 }, walkTime: 16 },
  { id: 'grammar-9', name: 'City of London School', type: 'grammar_schools', coordinates: { lat: 51.5125, lng: -0.0954 }, walkTime: 8 },
  { id: 'grammar-10', name: 'City of London School for Girls', type: 'grammar_schools', coordinates: { lat: 51.5195, lng: -0.0935 }, walkTime: 8 },
  { id: 'grammar-11', name: 'Dulwich College', type: 'grammar_schools', coordinates: { lat: 51.4445, lng: -0.0840 }, walkTime: 12 },
  { id: 'grammar-12', name: 'Alleyn\'s School', type: 'grammar_schools', coordinates: { lat: 51.4415, lng: -0.0795 }, walkTime: 12 },
  { id: 'grammar-13', name: 'James Allen\'s Girls\' School (JAGS)', type: 'grammar_schools', coordinates: { lat: 51.4465, lng: -0.0785 }, walkTime: 11 },
  { id: 'grammar-14', name: 'University College School (UCS)', type: 'grammar_schools', coordinates: { lat: 51.5505, lng: -0.1775 }, walkTime: 11 },
  { id: 'grammar-15', name: 'South Hampstead High School', type: 'grammar_schools', coordinates: { lat: 51.5475, lng: -0.1785 }, walkTime: 13 },
  { id: 'grammar-16', name: 'Channing School', type: 'grammar_schools', coordinates: { lat: 51.5735, lng: -0.1495 }, walkTime: 15 },
  { id: 'grammar-17', name: 'Francis Holland School, Regent\'s Park', type: 'grammar_schools', coordinates: { lat: 51.5235, lng: -0.1565 }, walkTime: 10 },
  { id: 'grammar-18', name: 'Francis Holland, Sloane Square', type: 'grammar_schools', coordinates: { lat: 51.4935, lng: -0.1565 }, walkTime: 10 },
  { id: 'grammar-19', name: 'Queen\'s College London', type: 'grammar_schools', coordinates: { lat: 51.5195, lng: -0.1585 }, walkTime: 10 },
  { id: 'grammar-20', name: 'Queen\'s Gate School', type: 'grammar_schools', coordinates: { lat: 51.4965, lng: -0.1825 }, walkTime: 11 },
  { id: 'grammar-21', name: 'Notting Hill & Ealing High School', type: 'grammar_schools', coordinates: { lat: 51.5115, lng: -0.3065 }, walkTime: 19 },
  { id: 'grammar-22', name: 'St Augustine\'s Priory', type: 'grammar_schools', coordinates: { lat: 51.5135, lng: -0.3145 }, walkTime: 20 },
  { id: 'grammar-23', name: 'Ibstock Place School', type: 'grammar_schools', coordinates: { lat: 51.4565, lng: -0.2515 }, walkTime: 17 },
  { id: 'grammar-24', name: 'Emanuel School', type: 'grammar_schools', coordinates: { lat: 51.4615, lng: -0.1685 }, walkTime: 15 },
  { id: 'grammar-25', name: 'Putney High School', type: 'grammar_schools', coordinates: { lat: 51.4635, lng: -0.2185 }, walkTime: 16 },
  { id: 'grammar-26', name: 'Wimbledon High School', type: 'grammar_schools', coordinates: { lat: 51.4245, lng: -0.2065 }, walkTime: 14 },
  { id: 'grammar-27', name: 'Lady Eleanor Holles (LEH)', type: 'grammar_schools', coordinates: { lat: 51.4135, lng: -0.3795 }, walkTime: 25 },
  { id: 'grammar-28', name: 'Hampton School', type: 'grammar_schools', coordinates: { lat: 51.4185, lng: -0.3645 }, walkTime: 25 },
  { id: 'grammar-29', name: 'St Helen\'s School', type: 'grammar_schools', coordinates: { lat: 51.6065, lng: -0.4265 }, walkTime: 28 },
  { id: 'grammar-30', name: 'Northwood College for Girls', type: 'grammar_schools', coordinates: { lat: 51.6095, lng: -0.4185 }, walkTime: 28 },
  { id: 'grammar-31', name: 'Mill Hill School', type: 'grammar_schools', coordinates: { lat: 51.6135, lng: -0.2275 }, walkTime: 21 },
  { id: 'grammar-32', name: 'Forest School', type: 'grammar_schools', coordinates: { lat: 51.5895, lng: 0.0125 }, walkTime: 22 },
  { id: 'grammar-33', name: 'Bancroft\'s School', type: 'grammar_schools', coordinates: { lat: 51.5915, lng: 0.0265 }, walkTime: 23 },
  { id: 'grammar-34', name: 'Colfe\'s School', type: 'grammar_schools', coordinates: { lat: 51.4665, lng: 0.0145 }, walkTime: 18 },
  { id: 'grammar-35', name: 'Eltham College', type: 'grammar_schools', coordinates: { lat: 51.4515, lng: 0.0575 }, walkTime: 20 },
  { id: 'grammar-36', name: 'Blackheath High School', type: 'grammar_schools', coordinates: { lat: 51.4685, lng: 0.0035 }, walkTime: 17 },
  { id: 'grammar-37', name: 'St Dunstan\'s College', type: 'grammar_schools', coordinates: { lat: 51.4425, lng: -0.0205 }, walkTime: 16 },
  { id: 'grammar-38', name: 'Harrodian School', type: 'grammar_schools', coordinates: { lat: 51.4675, lng: -0.2575 }, walkTime: 17 },
  { id: 'grammar-39', name: 'King Alfred School', type: 'grammar_schools', coordinates: { lat: 51.5565, lng: -0.1735 }, walkTime: 14 },
  { id: 'grammar-40', name: 'American School in London', type: 'grammar_schools', coordinates: { lat: 51.5415, lng: -0.1705 }, walkTime: 13 },
  { id: 'grammar-41', name: 'Southbank International School', type: 'grammar_schools', coordinates: { lat: 51.5035, lng: -0.1445 }, walkTime: 9 },
  { id: 'grammar-42', name: 'Lycée Français Charles de Gaulle', type: 'grammar_schools', coordinates: { lat: 51.4975, lng: -0.1785 }, walkTime: 11 },
  { id: 'grammar-43', name: 'Kensington Park School', type: 'grammar_schools', coordinates: { lat: 51.5045, lng: -0.1895 }, walkTime: 11 },
  { id: 'grammar-44', name: 'Portland Place School', type: 'grammar_schools', coordinates: { lat: 51.5215, lng: -0.1445 }, walkTime: 9 },
  { id: 'grammar-45', name: 'Kew House School', type: 'grammar_schools', coordinates: { lat: 51.4815, lng: -0.2895 }, walkTime: 18 },
  { id: 'grammar-46', name: 'St Benedict\'s School', type: 'grammar_schools', coordinates: { lat: 51.5085, lng: -0.3185 }, walkTime: 20 },
  { id: 'grammar-47', name: 'Whitgift School', type: 'grammar_schools', coordinates: { lat: 51.3715, lng: -0.0865 }, walkTime: 30 },
  { id: 'grammar-48', name: 'Trinity School of John Whitgift', type: 'grammar_schools', coordinates: { lat: 51.3615, lng: -0.0515 }, walkTime: 32 },
  { id: 'grammar-49', name: 'Royal Russell School', type: 'grammar_schools', coordinates: { lat: 51.3565, lng: -0.0695 }, walkTime: 31 },
  { id: 'grammar-50', name: 'Kingston Grammar School', type: 'grammar_schools', coordinates: { lat: 51.4145, lng: -0.3015 }, walkTime: 20 },

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

  // Top Private Schools (150+ locations across London)
  // Central / Kensington & Chelsea / Westminster / H&F
  { id: 'private-1', name: 'Norland Place School', type: 'private_schools', coordinates: { lat: 51.5115, lng: -0.2025 }, walkTime: 12 },
  { id: 'private-2', name: 'Pembridge Hall School', type: 'private_schools', coordinates: { lat: 51.5125, lng: -0.2035 }, walkTime: 12 },
  { id: 'private-3', name: 'Chepstow House School', type: 'private_schools', coordinates: { lat: 51.5135, lng: -0.2045 }, walkTime: 12 },
  { id: 'private-4', name: 'Glendower Preparatory School', type: 'private_schools', coordinates: { lat: 51.4995, lng: -0.1785 }, walkTime: 11 },
  { id: 'private-5', name: 'Falkner House', type: 'private_schools', coordinates: { lat: 51.4915, lng: -0.1685 }, walkTime: 10 },
  { id: 'private-6', name: 'Bute House Preparatory School', type: 'private_schools', coordinates: { lat: 51.4935, lng: -0.2235 }, walkTime: 13 },
  { id: 'private-7', name: 'St James Preparatory School', type: 'private_schools', coordinates: { lat: 51.4895, lng: -0.1825 }, walkTime: 11 },
  { id: 'private-8', name: 'St James Senior Girls\' School', type: 'private_schools', coordinates: { lat: 51.4905, lng: -0.1835 }, walkTime: 11 },
  { id: 'private-9', name: 'Garden House School', type: 'private_schools', coordinates: { lat: 51.4885, lng: -0.1705 }, walkTime: 10 },
  { id: 'private-10', name: 'Knightsbridge School', type: 'private_schools', coordinates: { lat: 51.4965, lng: -0.1615 }, walkTime: 9 },
  { id: 'private-11', name: 'Sussex House School', type: 'private_schools', coordinates: { lat: 51.4945, lng: -0.1685 }, walkTime: 10 },
  { id: 'private-12', name: 'Cameron Vale School', type: 'private_schools', coordinates: { lat: 51.4975, lng: -0.1745 }, walkTime: 10 },
  { id: 'private-13', name: 'Hill House International Junior School', type: 'private_schools', coordinates: { lat: 51.4975, lng: -0.1665 }, walkTime: 10 },
  { id: 'private-14', name: 'Eaton Square Belgravia', type: 'private_schools', coordinates: { lat: 51.4955, lng: -0.1515 }, walkTime: 9 },
  { id: 'private-15', name: 'Eaton Square Mayfair (Senior)', type: 'private_schools', coordinates: { lat: 51.5095, lng: -0.1485 }, walkTime: 9 },
  { id: 'private-16', name: 'Kensington Wade (Bilingual)', type: 'private_schools', coordinates: { lat: 51.5005, lng: -0.1895 }, walkTime: 11 },
  { id: 'private-17', name: 'More House School (Knightsbridge)', type: 'private_schools', coordinates: { lat: 51.4975, lng: -0.1625 }, walkTime: 9 },
  { id: 'private-18', name: 'Queen\'s College Preparatory School', type: 'private_schools', coordinates: { lat: 51.5205, lng: -0.1595 }, walkTime: 10 },
  { id: 'private-19', name: 'Abercorn School', type: 'private_schools', coordinates: { lat: 51.5345, lng: -0.1705 }, walkTime: 12 },
  { id: 'private-20', name: 'Wetherby School (Notting Hill)', type: 'private_schools', coordinates: { lat: 51.5145, lng: -0.2055 }, walkTime: 12 },
  { id: 'private-21', name: 'Wetherby Kensington', type: 'private_schools', coordinates: { lat: 51.5015, lng: -0.1935 }, walkTime: 11 },
  { id: 'private-22', name: 'Wetherby Prep', type: 'private_schools', coordinates: { lat: 51.5135, lng: -0.1755 }, walkTime: 11 },
  { id: 'private-23', name: 'Wetherby Senior', type: 'private_schools', coordinates: { lat: 51.5125, lng: -0.1765 }, walkTime: 11 },
  { id: 'private-24', name: 'Latymer Prep School (Hammersmith)', type: 'private_schools', coordinates: { lat: 51.4925, lng: -0.2265 }, walkTime: 13 },
  { id: 'private-25', name: 'Ravenscourt Park Preparatory School', type: 'private_schools', coordinates: { lat: 51.4945, lng: -0.2365 }, walkTime: 14 },
  { id: 'private-26', name: 'ArtsEd Day School & Sixth Form', type: 'private_schools', coordinates: { lat: 51.4925, lng: -0.2455 }, walkTime: 14 },
  { id: 'private-27', name: 'Kew Green Preparatory School', type: 'private_schools', coordinates: { lat: 51.4825, lng: -0.2885 }, walkTime: 18 },
  { id: 'private-28', name: 'Kew College Prep', type: 'private_schools', coordinates: { lat: 51.4835, lng: -0.2895 }, walkTime: 18 },
  { id: 'private-29', name: 'Unicorn School (Kew)', type: 'private_schools', coordinates: { lat: 51.4845, lng: -0.2905 }, walkTime: 18 },
  { id: 'private-30', name: 'Broomfield House School (Kew)', type: 'private_schools', coordinates: { lat: 51.4855, lng: -0.2915 }, walkTime: 18 },

  // Hampstead / St John's Wood / Camden / Islington / North Inner
  { id: 'private-31', name: 'The Hall School, Hampstead', type: 'private_schools', coordinates: { lat: 51.5525, lng: -0.1785 }, walkTime: 14 },
  { id: 'private-32', name: 'Arnold House School', type: 'private_schools', coordinates: { lat: 51.5345, lng: -0.1715 }, walkTime: 12 },
  { id: 'private-33', name: 'Devonshire House Preparatory School', type: 'private_schools', coordinates: { lat: 51.5485, lng: -0.1745 }, walkTime: 13 },
  { id: 'private-34', name: 'St Anthony\'s School for Boys', type: 'private_schools', coordinates: { lat: 51.5465, lng: -0.1805 }, walkTime: 13 },
  { id: 'private-35', name: 'St Anthony\'s School for Girls', type: 'private_schools', coordinates: { lat: 51.5455, lng: -0.1815 }, walkTime: 13 },
  { id: 'private-36', name: 'St Christina\'s School', type: 'private_schools', coordinates: { lat: 51.5435, lng: -0.1765 }, walkTime: 13 },
  { id: 'private-37', name: 'Trevor-Roberts School', type: 'private_schools', coordinates: { lat: 51.5445, lng: -0.1755 }, walkTime: 13 },
  { id: 'private-38', name: 'UCS Junior Branch', type: 'private_schools', coordinates: { lat: 51.5495, lng: -0.1785 }, walkTime: 11 },
  { id: 'private-39', name: 'North Bridge House Prep (Regent\'s Park)', type: 'private_schools', coordinates: { lat: 51.5305, lng: -0.1545 }, walkTime: 10 },
  { id: 'private-40', name: 'North Bridge House Senior Hampstead', type: 'private_schools', coordinates: { lat: 51.5515, lng: -0.1775 }, walkTime: 14 },
  { id: 'private-41', name: 'North Bridge House Senior Canonbury', type: 'private_schools', coordinates: { lat: 51.5385, lng: -0.0985 }, walkTime: 10 },
  { id: 'private-42', name: 'Southbank International School (Westminster campus)', type: 'private_schools', coordinates: { lat: 51.5025, lng: -0.1435 }, walkTime: 9 },
  { id: 'private-43', name: 'Southbank International School (Kensington campus)', type: 'private_schools', coordinates: { lat: 51.5015, lng: -0.1945 }, walkTime: 11 },
  { id: 'private-44', name: 'ICS London (International Community School)', type: 'private_schools', coordinates: { lat: 51.5445, lng: -0.1655 }, walkTime: 12 },
  { id: 'private-45', name: 'The Cavendish School (Camden)', type: 'private_schools', coordinates: { lat: 51.5355, lng: -0.1435 }, walkTime: 10 },
  { id: 'private-46', name: 'Halcyon London International School', type: 'private_schools', coordinates: { lat: 51.5215, lng: -0.1755 }, walkTime: 11 },
  { id: 'private-47', name: 'The Lyceum School (City)', type: 'private_schools', coordinates: { lat: 51.5165, lng: -0.0925 }, walkTime: 7 },

  // West / Ealing / Hounslow / Hammersmith & Fulham / Richmond
  { id: 'private-48', name: 'Notting Hill & Ealing High Junior', type: 'private_schools', coordinates: { lat: 51.5105, lng: -0.3055 }, walkTime: 19 },
  { id: 'private-49', name: 'St Benedict\'s Junior School (Ealing)', type: 'private_schools', coordinates: { lat: 51.5095, lng: -0.3175 }, walkTime: 20 },
  { id: 'private-50', name: 'Durston House School', type: 'private_schools', coordinates: { lat: 51.5085, lng: -0.3115 }, walkTime: 20 },
  { id: 'private-51', name: 'Harrodian Prep (within The Harrodian)', type: 'private_schools', coordinates: { lat: 51.4685, lng: -0.2585 }, walkTime: 17 },
  { id: 'private-52', name: 'Falcons Prep Richmond', type: 'private_schools', coordinates: { lat: 51.4625, lng: -0.2685 }, walkTime: 18 },
  { id: 'private-53', name: 'Falcons School for Girls (Putney edge)', type: 'private_schools', coordinates: { lat: 51.4645, lng: -0.2195 }, walkTime: 16 },
  { id: 'private-54', name: 'The Mall School (Twickenham)', type: 'private_schools', coordinates: { lat: 51.4465, lng: -0.3345 }, walkTime: 24 },
  { id: 'private-55', name: 'Newland House School (Twickenham)', type: 'private_schools', coordinates: { lat: 51.4455, lng: -0.3365 }, walkTime: 24 },
  { id: 'private-56', name: 'Jack & Jill School (Twickenham/Hampton)', type: 'private_schools', coordinates: { lat: 51.4285, lng: -0.3545 }, walkTime: 26 },
  { id: 'private-57', name: 'St Catherine\'s School, Twickenham', type: 'private_schools', coordinates: { lat: 51.4475, lng: -0.3385 }, walkTime: 24 },
  { id: 'private-58', name: 'Old Vicarage School (Richmond)', type: 'private_schools', coordinates: { lat: 51.4565, lng: -0.2985 }, walkTime: 20 },
  { id: 'private-59', name: 'Twickenham Preparatory School (Teddington)', type: 'private_schools', coordinates: { lat: 51.4275, lng: -0.3335 }, walkTime: 25 },
  { id: 'private-60', name: 'Hampton Prep School', type: 'private_schools', coordinates: { lat: 51.4195, lng: -0.3655 }, walkTime: 25 },
  { id: 'private-61', name: 'Lady Eleanor Holles Junior', type: 'private_schools', coordinates: { lat: 51.4145, lng: -0.3785 }, walkTime: 25 },
  { id: 'private-62', name: 'Hampton Court House', type: 'private_schools', coordinates: { lat: 51.4035, lng: -0.3485 }, walkTime: 27 },
  { id: 'private-63', name: 'Ibstock Place (Prep)', type: 'private_schools', coordinates: { lat: 51.4575, lng: -0.2525 }, walkTime: 17 },
  { id: 'private-64', name: 'St James Senior Boys (Ashford)', type: 'private_schools', coordinates: { lat: 51.4315, lng: -0.4635 }, walkTime: 30 },
  { id: 'private-65', name: 'The German School London (DSL)', type: 'private_schools', coordinates: { lat: 51.4225, lng: -0.3835 }, walkTime: 26 },
  { id: 'private-66', name: 'The Swedish School in London', type: 'private_schools', coordinates: { lat: 51.4565, lng: -0.2475 }, walkTime: 17 },

  // South West / Wandsworth / Merton / Kingston
  { id: 'private-67', name: 'Newton Preparatory School (Battersea)', type: 'private_schools', coordinates: { lat: 51.4735, lng: -0.1585 }, walkTime: 11 },
  { id: 'private-68', name: 'Dolphin School (Battersea)', type: 'private_schools', coordinates: { lat: 51.4745, lng: -0.1595 }, walkTime: 11 },
  { id: 'private-69', name: 'Thomas\'s Battersea', type: 'private_schools', coordinates: { lat: 51.4755, lng: -0.1565 }, walkTime: 11 },
  { id: 'private-70', name: 'Thomas\'s Clapham', type: 'private_schools', coordinates: { lat: 51.4595, lng: -0.1415 }, walkTime: 13 },
  { id: 'private-71', name: 'Thomas\'s Fulham', type: 'private_schools', coordinates: { lat: 51.4765, lng: -0.1945 }, walkTime: 12 },
  { id: 'private-72', name: 'Thomas\'s Kensington', type: 'private_schools', coordinates: { lat: 51.4985, lng: -0.1915 }, walkTime: 11 },
  { id: 'private-73', name: 'Broomwood Prep Boys', type: 'private_schools', coordinates: { lat: 51.4625, lng: -0.1695 }, walkTime: 14 },
  { id: 'private-74', name: 'Broomwood Prep Girls', type: 'private_schools', coordinates: { lat: 51.4635, lng: -0.1705 }, walkTime: 14 },
  { id: 'private-75', name: 'Northcote Lodge', type: 'private_schools', coordinates: { lat: 51.4655, lng: -0.1725 }, walkTime: 14 },
  { id: 'private-76', name: 'Finton House School', type: 'private_schools', coordinates: { lat: 51.4615, lng: -0.1725 }, walkTime: 14 },
  { id: 'private-77', name: 'Oliver House School', type: 'private_schools', coordinates: { lat: 51.4665, lng: -0.1745 }, walkTime: 14 },
  { id: 'private-78', name: 'Prospect House School (Putney)', type: 'private_schools', coordinates: { lat: 51.4645, lng: -0.2155 }, walkTime: 16 },
  { id: 'private-79', name: 'Merlin School (Putney)', type: 'private_schools', coordinates: { lat: 51.4655, lng: -0.2165 }, walkTime: 16 },
  { id: 'private-80', name: 'The Study Prep (Wimbledon)', type: 'private_schools', coordinates: { lat: 51.4255, lng: -0.2075 }, walkTime: 14 },
  { id: 'private-81', name: 'Donhead Preparatory School', type: 'private_schools', coordinates: { lat: 51.4285, lng: -0.2085 }, walkTime: 14 },
  { id: 'private-82', name: 'Willington School (Wimbledon)', type: 'private_schools', coordinates: { lat: 51.4215, lng: -0.2045 }, walkTime: 14 },
  { id: 'private-83', name: 'King\'s College Junior School (Wimbledon)', type: 'private_schools', coordinates: { lat: 51.4175, lng: -0.2065 }, walkTime: 14 },
  { id: 'private-84', name: 'Wimbledon High Junior School', type: 'private_schools', coordinates: { lat: 51.4235, lng: -0.2055 }, walkTime: 14 },
  { id: 'private-85', name: 'Rokeby School (Kingston)', type: 'private_schools', coordinates: { lat: 51.4125, lng: -0.2955 }, walkTime: 20 },
  { id: 'private-86', name: 'Surbiton High School', type: 'private_schools', coordinates: { lat: 51.3965, lng: -0.3045 }, walkTime: 21 },
  { id: 'private-87', name: 'Surbiton High Boys\' Prep', type: 'private_schools', coordinates: { lat: 51.3975, lng: -0.3035 }, walkTime: 21 },
  { id: 'private-88', name: 'Surbiton High Girls\' Prep', type: 'private_schools', coordinates: { lat: 51.3985, lng: -0.3025 }, walkTime: 21 },
  { id: 'private-89', name: 'Shrewsbury House School (Surbiton)', type: 'private_schools', coordinates: { lat: 51.3995, lng: -0.3055 }, walkTime: 21 },
  { id: 'private-90', name: 'Holy Cross Preparatory School (Kingston)', type: 'private_schools', coordinates: { lat: 51.4115, lng: -0.2985 }, walkTime: 20 },
  { id: 'private-91', name: 'Marymount International School (Kingston)', type: 'private_schools', coordinates: { lat: 51.4085, lng: -0.2895 }, walkTime: 20 },
  { id: 'private-92', name: 'Canbury School (Kingston)', type: 'private_schools', coordinates: { lat: 51.4135, lng: -0.2995 }, walkTime: 20 },
  { id: 'private-93', name: 'Park Hill School (Kingston)', type: 'private_schools', coordinates: { lat: 51.4155, lng: -0.3025 }, walkTime: 20 },

  // North West / Barnet / Brent / Harrow / Hillingdon
  { id: 'private-94', name: 'Mill Hill International', type: 'private_schools', coordinates: { lat: 51.6145, lng: -0.2285 }, walkTime: 21 },
  { id: 'private-95', name: 'Belmont (Mill Hill Prep)', type: 'private_schools', coordinates: { lat: 51.6125, lng: -0.2295 }, walkTime: 21 },
  { id: 'private-96', name: 'Grimsdell (Mill Hill Pre-Prep)', type: 'private_schools', coordinates: { lat: 51.6155, lng: -0.2265 }, walkTime: 21 },
  { id: 'private-97', name: 'John Lyon School (Harrow)', type: 'private_schools', coordinates: { lat: 51.5755, lng: -0.3365 }, walkTime: 23 },
  { id: 'private-98', name: 'Orley Farm School (Harrow)', type: 'private_schools', coordinates: { lat: 51.5785, lng: -0.3345 }, walkTime: 23 },
  { id: 'private-99', name: 'Quainton Hall School (Harrow)', type: 'private_schools', coordinates: { lat: 51.5765, lng: -0.3385 }, walkTime: 23 },
  { id: 'private-100', name: 'Alpha Preparatory School (Harrow)', type: 'private_schools', coordinates: { lat: 51.5745, lng: -0.3405 }, walkTime: 23 },
  { id: 'private-101', name: 'Reddiford School (Pinner)', type: 'private_schools', coordinates: { lat: 51.5935, lng: -0.3865 }, walkTime: 27 },
  { id: 'private-102', name: 'St John\'s School (Northwood)', type: 'private_schools', coordinates: { lat: 51.6085, lng: -0.4195 }, walkTime: 28 },
  { id: 'private-103', name: 'St Martin\'s School (Northwood)', type: 'private_schools', coordinates: { lat: 51.6075, lng: -0.4175 }, walkTime: 28 },
  { id: 'private-104', name: 'Merchant Taylors\' School (Northwood)', type: 'private_schools', coordinates: { lat: 51.6105, lng: -0.4215 }, walkTime: 28 },
  { id: 'private-105', name: 'North London Grammar School (Hendon)', type: 'private_schools', coordinates: { lat: 51.5835, lng: -0.2175 }, walkTime: 19 },
  { id: 'private-106', name: 'Dwight School London (Friern Barnet)', type: 'private_schools', coordinates: { lat: 51.6155, lng: -0.1505 }, walkTime: 18 },
  { id: 'private-107', name: 'Lycée International de Londres Winston Churchill (Wembley)', type: 'private_schools', coordinates: { lat: 51.5555, lng: -0.2845 }, walkTime: 17 },
  { id: 'private-108', name: 'St Mary\'s School, Hampstead (RC)', type: 'private_schools', coordinates: { lat: 51.5545, lng: -0.1785 }, walkTime: 14 },
  { id: 'private-109', name: 'Immanuel College (Bushey)', type: 'private_schools', coordinates: { lat: 51.6465, lng: -0.3635 }, walkTime: 30 },

  // North / North East / Enfield / Haringey / Waltham Forest / Redbridge
  { id: 'private-110', name: 'Highgate Pre-Prep / Junior', type: 'private_schools', coordinates: { lat: 51.5705, lng: -0.1515 }, walkTime: 16 },
  { id: 'private-111', name: 'Channing Junior', type: 'private_schools', coordinates: { lat: 51.5745, lng: -0.1485 }, walkTime: 15 },
  { id: 'private-112', name: 'Keble Preparatory School (Winchmore Hill)', type: 'private_schools', coordinates: { lat: 51.6235, lng: -0.1075 }, walkTime: 18 },
  { id: 'private-113', name: 'Palmers Green High School', type: 'private_schools', coordinates: { lat: 51.6185, lng: -0.1125 }, walkTime: 18 },
  { id: 'private-114', name: 'Vita et Pax Preparatory School (Southgate)', type: 'private_schools', coordinates: { lat: 51.6315, lng: -0.1245 }, walkTime: 20 },
  { id: 'private-115', name: 'Bancroft\'s Prep (Woodford Green)', type: 'private_schools', coordinates: { lat: 51.5905, lng: 0.0255 }, walkTime: 23 },
  { id: 'private-116', name: 'Forest School Prep (Walthamstow)', type: 'private_schools', coordinates: { lat: 51.5885, lng: 0.0115 }, walkTime: 22 },
  { id: 'private-117', name: 'St Aubyn\'s School (Woodford Green)', type: 'private_schools', coordinates: { lat: 51.5925, lng: 0.0265 }, walkTime: 23 },
  { id: 'private-118', name: 'Snaresbrook Preparatory School', type: 'private_schools', coordinates: { lat: 51.5855, lng: 0.0185 }, walkTime: 22 },
  { id: 'private-119', name: 'Woodford Green Preparatory School', type: 'private_schools', coordinates: { lat: 51.5965, lng: 0.0295 }, walkTime: 24 },
  { id: 'private-120', name: 'Gatehouse School (Victoria Park)', type: 'private_schools', coordinates: { lat: 51.5355, lng: -0.0425 }, walkTime: 10 },
  { id: 'private-121', name: 'Faraday Preparatory School (Trinity Buoy Wharf)', type: 'private_schools', coordinates: { lat: 51.5095, lng: 0.0085 }, walkTime: 12 },

  // South / South East / Dulwich / Lewisham / Greenwich / Bromley / Croydon
  { id: 'private-122', name: 'Dulwich Prep London', type: 'private_schools', coordinates: { lat: 51.4455, lng: -0.0835 }, walkTime: 12 },
  { id: 'private-123', name: 'Rosemead Preparatory School', type: 'private_schools', coordinates: { lat: 51.4435, lng: -0.0815 }, walkTime: 12 },
  { id: 'private-124', name: 'Herne Hill School', type: 'private_schools', coordinates: { lat: 51.4535, lng: -0.1015 }, walkTime: 11 },
  { id: 'private-125', name: 'Sydenham High School (GDST)', type: 'private_schools', coordinates: { lat: 51.4325, lng: -0.0545 }, walkTime: 15 },
  { id: 'private-126', name: 'Colfe\'s Junior School', type: 'private_schools', coordinates: { lat: 51.4655, lng: 0.0135 }, walkTime: 18 },
  { id: 'private-127', name: 'Blackheath Prep (formerly Blackheath Preparatory)', type: 'private_schools', coordinates: { lat: 51.4675, lng: 0.0025 }, walkTime: 17 },
  { id: 'private-128', name: 'Pointers School (Blackheath)', type: 'private_schools', coordinates: { lat: 51.4685, lng: 0.0045 }, walkTime: 17 },
  { id: 'private-129', name: 'Eltham College Junior School', type: 'private_schools', coordinates: { lat: 51.4505, lng: 0.0565 }, walkTime: 20 },
  { id: 'private-130', name: 'Babington House School (Chislehurst)', type: 'private_schools', coordinates: { lat: 51.4185, lng: 0.0735 }, walkTime: 23 },
  { id: 'private-131', name: 'Bromley High School (GDST)', type: 'private_schools', coordinates: { lat: 51.4075, lng: 0.0205 }, walkTime: 22 },
  { id: 'private-132', name: 'Bickley Park School', type: 'private_schools', coordinates: { lat: 51.3965, lng: 0.0425 }, walkTime: 24 },
  { id: 'private-133', name: 'Farringtons School (Chislehurst)', type: 'private_schools', coordinates: { lat: 51.4195, lng: 0.0745 }, walkTime: 23 },
  { id: 'private-134', name: 'Croydon High School (GDST)', type: 'private_schools', coordinates: { lat: 51.3715, lng: -0.0945 }, walkTime: 30 },
  { id: 'private-135', name: 'Cumnor House School for Boys (Purley)', type: 'private_schools', coordinates: { lat: 51.3375, lng: -0.1125 }, walkTime: 33 },
  { id: 'private-136', name: 'Cumnor House School for Girls (Purley)', type: 'private_schools', coordinates: { lat: 51.3385, lng: -0.1135 }, walkTime: 33 },

  // Specialist / SEN independents
  { id: 'private-137', name: 'Fairley House School (Westminster)', type: 'private_schools', coordinates: { lat: 51.5005, lng: -0.1345 }, walkTime: 8 },
  { id: 'private-138', name: 'The Moat School (Fulham)', type: 'private_schools', coordinates: { lat: 51.4795, lng: -0.1925 }, walkTime: 12 },
  { id: 'private-139', name: 'Centre Academy London (Battersea)', type: 'private_schools', coordinates: { lat: 51.4765, lng: -0.1575 }, walkTime: 11 },
  { id: 'private-140', name: 'The Chelsea Group of Children – Chelsea Hall School', type: 'private_schools', coordinates: { lat: 51.4885, lng: -0.1725 }, walkTime: 10 },
  { id: 'private-141', name: 'Riverston School (Eltham)', type: 'private_schools', coordinates: { lat: 51.4485, lng: 0.0595 }, walkTime: 20 },
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
