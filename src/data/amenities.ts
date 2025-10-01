// Best of London amenities data
export type AmenityType = 'private_schools' | 'prep_schools' | 'state_schools' | 'grammar_schools' | 'michelin_restaurants' | 'culture_landmarks' | 'shopping_lifestyle' | 'hospitals_clinics' | 'transport_hubs';

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
  private_schools: '#8B5CF6', // purple
  prep_schools: '#EC4899', // pink
  state_schools: '#3B82F6', // blue
  grammar_schools: '#10B981', // green
  michelin_restaurants: '#F59E0B', // amber
  culture_landmarks: '#EF4444', // red
  shopping_lifestyle: '#D946EF', // fuchsia
  hospitals_clinics: '#DC2626', // dark red
  transport_hubs: '#6366F1', // indigo
};

export const amenityLabels: Record<AmenityType, string> = {
  private_schools: 'Private Schools 🎓',
  prep_schools: 'Prep Schools 🏫',
  state_schools: 'State Schools 🏫',
  grammar_schools: 'Grammar Schools 🎓',
  michelin_restaurants: 'Michelin Star Restaurants 🍴',
  culture_landmarks: 'Culture & Landmarks 🎭',
  shopping_lifestyle: 'Shopping & Lifestyle 🛍️',
  hospitals_clinics: 'Hospitals & Clinics 🏥',
  transport_hubs: 'Transport Hubs 🚇',
};

// Extensive amenities data across London
export const amenities: Amenity[] = [
  // Private Schools (Top Independent Senior Schools)
  { id: 'private-1', name: 'Westminster School', type: 'private_schools', coordinates: { lat: 51.4995, lng: -0.1315 }, walkTime: 10 },
  { id: 'private-2', name: 'St Paul\'s Girls\' School', type: 'private_schools', coordinates: { lat: 51.4895, lng: -0.2235 }, walkTime: 14 },
  { id: 'private-3', name: 'St Paul\'s School', type: 'private_schools', coordinates: { lat: 51.4715, lng: -0.2415 }, walkTime: 15 },
  { id: 'private-4', name: 'King\'s College School', type: 'private_schools', coordinates: { lat: 51.4170, lng: -0.2075 }, walkTime: 18 },
  { id: 'private-5', name: 'North London Collegiate School', type: 'private_schools', coordinates: { lat: 51.6135, lng: -0.2895 }, walkTime: 23 },
  { id: 'private-6', name: 'Godolphin & Latymer', type: 'private_schools', coordinates: { lat: 51.4915, lng: -0.2215 }, walkTime: 12 },
  { id: 'private-7', name: 'Latymer Upper School', type: 'private_schools', coordinates: { lat: 51.4935, lng: -0.2345 }, walkTime: 13 },
  { id: 'private-8', name: 'Highgate School', type: 'private_schools', coordinates: { lat: 51.5715, lng: -0.1525 }, walkTime: 16 },
  { id: 'private-9', name: 'City of London School', type: 'private_schools', coordinates: { lat: 51.5125, lng: -0.0954 }, walkTime: 8 },
  { id: 'private-10', name: 'City of London School for Girls', type: 'private_schools', coordinates: { lat: 51.5195, lng: -0.0935 }, walkTime: 8 },
  { id: 'private-11', name: 'Dulwich College', type: 'private_schools', coordinates: { lat: 51.4445, lng: -0.0840 }, walkTime: 12 },
  { id: 'private-12', name: 'Alleyn\'s School', type: 'private_schools', coordinates: { lat: 51.4415, lng: -0.0795 }, walkTime: 12 },
  { id: 'private-13', name: 'James Allen\'s Girls\' School (JAGS)', type: 'private_schools', coordinates: { lat: 51.4465, lng: -0.0785 }, walkTime: 11 },
  { id: 'private-14', name: 'University College School (UCS)', type: 'private_schools', coordinates: { lat: 51.5505, lng: -0.1775 }, walkTime: 11 },
  { id: 'private-15', name: 'South Hampstead High School', type: 'private_schools', coordinates: { lat: 51.5475, lng: -0.1785 }, walkTime: 13 },
  { id: 'private-16', name: 'Channing School', type: 'private_schools', coordinates: { lat: 51.5735, lng: -0.1495 }, walkTime: 15 },
  { id: 'private-17', name: 'Francis Holland School, Regent\'s Park', type: 'private_schools', coordinates: { lat: 51.5235, lng: -0.1565 }, walkTime: 10 },
  { id: 'private-18', name: 'Francis Holland, Sloane Square', type: 'private_schools', coordinates: { lat: 51.4935, lng: -0.1565 }, walkTime: 10 },
  { id: 'private-19', name: 'Queen\'s College London', type: 'private_schools', coordinates: { lat: 51.5195, lng: -0.1585 }, walkTime: 10 },
  { id: 'private-20', name: 'Queen\'s Gate School', type: 'private_schools', coordinates: { lat: 51.4965, lng: -0.1825 }, walkTime: 11 },
  { id: 'private-21', name: 'Notting Hill & Ealing High School', type: 'private_schools', coordinates: { lat: 51.5115, lng: -0.3065 }, walkTime: 19 },
  { id: 'private-22', name: 'Emanuel School', type: 'private_schools', coordinates: { lat: 51.4615, lng: -0.1685 }, walkTime: 15 },
  { id: 'private-23', name: 'Putney High School', type: 'private_schools', coordinates: { lat: 51.4635, lng: -0.2185 }, walkTime: 16 },
  { id: 'private-24', name: 'Wimbledon High School', type: 'private_schools', coordinates: { lat: 51.4245, lng: -0.2065 }, walkTime: 14 },
  { id: 'private-25', name: 'Whitgift School', type: 'private_schools', coordinates: { lat: 51.3715, lng: -0.0865 }, walkTime: 30 },
  { id: 'private-26', name: 'Trinity School of John Whitgift', type: 'private_schools', coordinates: { lat: 51.3615, lng: -0.0515 }, walkTime: 32 },
  { id: 'private-27', name: 'Hampton School', type: 'private_schools', coordinates: { lat: 51.4185, lng: -0.3645 }, walkTime: 25 },
  { id: 'private-28', name: 'Lady Eleanor Holles (LEH)', type: 'private_schools', coordinates: { lat: 51.4135, lng: -0.3795 }, walkTime: 25 },
  { id: 'private-29', name: 'Mill Hill School', type: 'private_schools', coordinates: { lat: 51.6135, lng: -0.2275 }, walkTime: 21 },
  { id: 'private-30', name: 'Forest School', type: 'private_schools', coordinates: { lat: 51.5895, lng: 0.0125 }, walkTime: 22 },

  // Prep Schools (Leading Feeder Schools)
  { id: 'prep-1', name: 'Norland Place School', type: 'prep_schools', coordinates: { lat: 51.5115, lng: -0.2025 }, walkTime: 12 },
  { id: 'prep-2', name: 'Pembridge Hall School', type: 'prep_schools', coordinates: { lat: 51.5125, lng: -0.2035 }, walkTime: 12 },
  { id: 'prep-3', name: 'Chepstow House School', type: 'prep_schools', coordinates: { lat: 51.5135, lng: -0.2045 }, walkTime: 12 },
  { id: 'prep-4', name: 'Glendower Preparatory School', type: 'prep_schools', coordinates: { lat: 51.4995, lng: -0.1785 }, walkTime: 11 },
  { id: 'prep-5', name: 'Falkner House', type: 'prep_schools', coordinates: { lat: 51.4915, lng: -0.1685 }, walkTime: 10 },
  { id: 'prep-6', name: 'Bute House Preparatory School', type: 'prep_schools', coordinates: { lat: 51.4935, lng: -0.2235 }, walkTime: 13 },
  { id: 'prep-7', name: 'Garden House School', type: 'prep_schools', coordinates: { lat: 51.4885, lng: -0.1705 }, walkTime: 10 },
  { id: 'prep-8', name: 'Knightsbridge School', type: 'prep_schools', coordinates: { lat: 51.4965, lng: -0.1615 }, walkTime: 9 },
  { id: 'prep-9', name: 'Sussex House School', type: 'prep_schools', coordinates: { lat: 51.4945, lng: -0.1685 }, walkTime: 10 },
  { id: 'prep-10', name: 'The Hall School, Hampstead', type: 'prep_schools', coordinates: { lat: 51.5565, lng: -0.1745 }, walkTime: 14 },
  { id: 'prep-11', name: 'Arnold House School', type: 'prep_schools', coordinates: { lat: 51.5445, lng: -0.1675 }, walkTime: 13 },
  { id: 'prep-12', name: 'Wetherby School', type: 'prep_schools', coordinates: { lat: 51.5145, lng: -0.2055 }, walkTime: 12 },
  { id: 'prep-13', name: 'Wetherby Prep', type: 'prep_schools', coordinates: { lat: 51.5135, lng: -0.1755 }, walkTime: 11 },
  { id: 'prep-14', name: 'Thomas\'s Battersea', type: 'prep_schools', coordinates: { lat: 51.4745, lng: -0.1595 }, walkTime: 13 },
  { id: 'prep-15', name: 'Thomas\'s Clapham', type: 'prep_schools', coordinates: { lat: 51.4625, lng: -0.1395 }, walkTime: 14 },
  { id: 'prep-16', name: 'Dulwich Prep London', type: 'prep_schools', coordinates: { lat: 51.4435, lng: -0.0865 }, walkTime: 12 },
  { id: 'prep-17', name: 'Newton Preparatory School', type: 'prep_schools', coordinates: { lat: 51.4755, lng: -0.1585 }, walkTime: 13 },
  { id: 'prep-18', name: 'Broomwood Prep', type: 'prep_schools', coordinates: { lat: 51.4615, lng: -0.1685 }, walkTime: 15 },
  { id: 'prep-19', name: 'Northcote Lodge', type: 'prep_schools', coordinates: { lat: 51.4615, lng: -0.1695 }, walkTime: 15 },
  { id: 'prep-20', name: 'Finton House School', type: 'prep_schools', coordinates: { lat: 51.4625, lng: -0.1705 }, walkTime: 15 },
  { id: 'prep-21', name: 'Eaton Square Belgravia', type: 'prep_schools', coordinates: { lat: 51.4955, lng: -0.1515 }, walkTime: 9 },
  { id: 'prep-22', name: 'The Study Prep', type: 'prep_schools', coordinates: { lat: 51.4245, lng: -0.2075 }, walkTime: 14 },
  { id: 'prep-23', name: 'King\'s College Junior School', type: 'prep_schools', coordinates: { lat: 51.4180, lng: -0.2085 }, walkTime: 18 },
  { id: 'prep-24', name: 'Hampton Prep School', type: 'prep_schools', coordinates: { lat: 51.4195, lng: -0.3655 }, walkTime: 25 },
  { id: 'prep-25', name: 'Latymer Prep School', type: 'prep_schools', coordinates: { lat: 51.4925, lng: -0.2265 }, walkTime: 13 },

  // State Schools (Ofsted Outstanding)
  { id: 'state-1', name: 'Fox Primary School', type: 'state_schools', coordinates: { lat: 51.5115, lng: -0.1985 }, walkTime: 12 },
  { id: 'state-2', name: 'Ark Academy', type: 'state_schools', coordinates: { lat: 51.5225, lng: -0.2245 }, walkTime: 14 },
  { id: 'state-3', name: 'Grey Coat Hospital', type: 'state_schools', coordinates: { lat: 51.4965, lng: -0.1325 }, walkTime: 9 },
  { id: 'state-4', name: 'Pimlico Academy', type: 'state_schools', coordinates: { lat: 51.4885, lng: -0.1375 }, walkTime: 8 },
  { id: 'state-5', name: 'Burlington Danes Academy', type: 'state_schools', coordinates: { lat: 51.5085, lng: -0.2425 }, walkTime: 15 },
  { id: 'state-6', name: 'Mossbourne Community Academy', type: 'state_schools', coordinates: { lat: 51.5445, lng: -0.0545 }, walkTime: 15 },
  { id: 'state-7', name: 'Harris Academy Battersea', type: 'state_schools', coordinates: { lat: 51.4745, lng: -0.1625 }, walkTime: 13 },
  { id: 'state-8', name: 'Ark Putney Academy', type: 'state_schools', coordinates: { lat: 51.4605, lng: -0.2165 }, walkTime: 16 },
  { id: 'state-9', name: 'London Oratory School', type: 'state_schools', coordinates: { lat: 51.4875, lng: -0.2165 }, walkTime: 13 },
  { id: 'state-10', name: 'Cardinal Vaughan Memorial School', type: 'state_schools', coordinates: { lat: 51.4985, lng: -0.1975 }, walkTime: 12 },
  { id: 'state-11', name: 'St Marylebone CE School', type: 'state_schools', coordinates: { lat: 51.5235, lng: -0.1565 }, walkTime: 10 },
  { id: 'state-12', name: 'Parliament Hill School', type: 'state_schools', coordinates: { lat: 51.5535, lng: -0.1585 }, walkTime: 14 },
  { id: 'state-13', name: 'Camden School for Girls', type: 'state_schools', coordinates: { lat: 51.5445, lng: -0.1415 }, walkTime: 12 },
  { id: 'state-14', name: 'La Sainte Union Catholic School', type: 'state_schools', coordinates: { lat: 51.5635, lng: -0.1385 }, walkTime: 15 },
  { id: 'state-15', name: 'Bolingbroke Academy', type: 'state_schools', coordinates: { lat: 51.4655, lng: -0.1725 }, walkTime: 15 },

  // Grammar Schools
  { id: 'grammar-1', name: 'Queen Elizabeth\'s School', type: 'grammar_schools', coordinates: { lat: 51.5785, lng: -0.3365 }, walkTime: 28 },
  { id: 'grammar-2', name: 'Henrietta Barnett School', type: 'grammar_schools', coordinates: { lat: 51.6145, lng: -0.2025 }, walkTime: 22 },
  { id: 'grammar-3', name: 'St Olave\'s Grammar School', type: 'grammar_schools', coordinates: { lat: 51.4245, lng: 0.1095 }, walkTime: 35 },
  { id: 'grammar-4', name: 'Newstead Wood School', type: 'grammar_schools', coordinates: { lat: 51.4115, lng: 0.0985 }, walkTime: 33 },
  { id: 'grammar-5', name: 'Tiffin School', type: 'grammar_schools', coordinates: { lat: 51.4105, lng: -0.3035 }, walkTime: 25 },
  { id: 'grammar-6', name: 'Tiffin Girls\' School', type: 'grammar_schools', coordinates: { lat: 51.4095, lng: -0.3025 }, walkTime: 25 },
  { id: 'grammar-7', name: 'Nonsuch High School', type: 'grammar_schools', coordinates: { lat: 51.3575, lng: -0.2305 }, walkTime: 35 },
  { id: 'grammar-8', name: 'Wilson\'s School', type: 'grammar_schools', coordinates: { lat: 51.3925, lng: -0.2885 }, walkTime: 28 },
  { id: 'grammar-9', name: 'Wallington High School for Girls', type: 'grammar_schools', coordinates: { lat: 51.3645, lng: -0.1425 }, walkTime: 32 },
  { id: 'grammar-10', name: 'Sutton Grammar School', type: 'grammar_schools', coordinates: { lat: 51.3615, lng: -0.1925 }, walkTime: 33 },

  // Michelin Star Restaurants
  { id: 'michelin-1', name: 'Restaurant Gordon Ramsay', type: 'michelin_restaurants', coordinates: { lat: 51.4875, lng: -0.1695 }, walkTime: 10 },
  { id: 'michelin-2', name: 'Alain Ducasse at The Dorchester', type: 'michelin_restaurants', coordinates: { lat: 51.5075, lng: -0.1515 }, walkTime: 9 },
  { id: 'michelin-3', name: 'Sketch (Lecture Room)', type: 'michelin_restaurants', coordinates: { lat: 51.5145, lng: -0.1415 }, walkTime: 8 },
  { id: 'michelin-4', name: 'Core by Clare Smyth', type: 'michelin_restaurants', coordinates: { lat: 51.5095, lng: -0.2045 }, walkTime: 12 },
  { id: 'michelin-5', name: 'The Ledbury', type: 'michelin_restaurants', coordinates: { lat: 51.5095, lng: -0.2055 }, walkTime: 12 },
  { id: 'michelin-6', name: 'A. Wong', type: 'michelin_restaurants', coordinates: { lat: 51.4945, lng: -0.1305 }, walkTime: 7 },
  { id: 'michelin-7', name: 'Hélène Darroze at The Connaught', type: 'michelin_restaurants', coordinates: { lat: 51.5115, lng: -0.1485 }, walkTime: 9 },
  { id: 'michelin-8', name: 'The Clove Club', type: 'michelin_restaurants', coordinates: { lat: 51.5245, lng: -0.0775 }, walkTime: 10 },
  { id: 'michelin-9', name: 'Ikoyi', type: 'michelin_restaurants', coordinates: { lat: 51.5115, lng: -0.1275 }, walkTime: 7 },
  { id: 'michelin-10', name: 'Kitchen Table', type: 'michelin_restaurants', coordinates: { lat: 51.5215, lng: -0.1305 }, walkTime: 8 },
  { id: 'michelin-11', name: 'Pollen Street Social', type: 'michelin_restaurants', coordinates: { lat: 51.5115, lng: -0.1425 }, walkTime: 8 },
  { id: 'michelin-12', name: 'Marcus', type: 'michelin_restaurants', coordinates: { lat: 51.5065, lng: -0.1535 }, walkTime: 9 },
  { id: 'michelin-13', name: 'La Dame de Pic', type: 'michelin_restaurants', coordinates: { lat: 51.5085, lng: -0.1355 }, walkTime: 8 },
  { id: 'michelin-14', name: 'Elystan Street', type: 'michelin_restaurants', coordinates: { lat: 51.4895, lng: -0.1705 }, walkTime: 10 },
  { id: 'michelin-15', name: 'Umu', type: 'michelin_restaurants', coordinates: { lat: 51.5095, lng: -0.1435 }, walkTime: 8 },
  { id: 'michelin-16', name: 'Gymkhana', type: 'michelin_restaurants', coordinates: { lat: 51.5105, lng: -0.1435 }, walkTime: 8 },
  { id: 'michelin-17', name: 'Benares', type: 'michelin_restaurants', coordinates: { lat: 51.5105, lng: -0.1445 }, walkTime: 8 },
  { id: 'michelin-18', name: 'The Greenhouse', type: 'michelin_restaurants', coordinates: { lat: 51.5065, lng: -0.1485 }, walkTime: 9 },
  { id: 'michelin-19', name: 'Pétrus by Gordon Ramsay', type: 'michelin_restaurants', coordinates: { lat: 51.4985, lng: -0.1515 }, walkTime: 9 },
  { id: 'michelin-20', name: 'Quilon', type: 'michelin_restaurants', coordinates: { lat: 51.4965, lng: -0.1385 }, walkTime: 8 },

  // Culture & Landmarks
  { id: 'culture-1', name: 'Tate Modern', type: 'culture_landmarks', coordinates: { lat: 51.5076, lng: -0.0994 }, walkTime: 7 },
  { id: 'culture-2', name: 'Victoria & Albert Museum', type: 'culture_landmarks', coordinates: { lat: 51.4966, lng: -0.1722 }, walkTime: 10 },
  { id: 'culture-3', name: 'Royal Opera House', type: 'culture_landmarks', coordinates: { lat: 51.5129, lng: -0.1220 }, walkTime: 6 },
  { id: 'culture-4', name: 'Tower of London', type: 'culture_landmarks', coordinates: { lat: 51.5081, lng: -0.0759 }, walkTime: 9 },
  { id: 'culture-5', name: 'The Shard', type: 'culture_landmarks', coordinates: { lat: 51.5045, lng: -0.0865 }, walkTime: 8 },
  { id: 'culture-6', name: 'British Museum', type: 'culture_landmarks', coordinates: { lat: 51.5194, lng: -0.1270 }, walkTime: 7 },
  { id: 'culture-7', name: 'National Gallery', type: 'culture_landmarks', coordinates: { lat: 51.5089, lng: -0.1283 }, walkTime: 6 },
  { id: 'culture-8', name: 'Natural History Museum', type: 'culture_landmarks', coordinates: { lat: 51.4967, lng: -0.1764 }, walkTime: 11 },
  { id: 'culture-9', name: 'Science Museum', type: 'culture_landmarks', coordinates: { lat: 51.4978, lng: -0.1746 }, walkTime: 11 },
  { id: 'culture-10', name: 'Tate Britain', type: 'culture_landmarks', coordinates: { lat: 51.4910, lng: -0.1278 }, walkTime: 8 },
  { id: 'culture-11', name: 'The National Theatre', type: 'culture_landmarks', coordinates: { lat: 51.5068, lng: -0.1136 }, walkTime: 7 },
  { id: 'culture-12', name: 'Shakespeare\'s Globe', type: 'culture_landmarks', coordinates: { lat: 51.5081, lng: -0.0972 }, walkTime: 7 },
  { id: 'culture-13', name: 'Barbican Centre', type: 'culture_landmarks', coordinates: { lat: 51.5200, lng: -0.0936 }, walkTime: 8 },
  { id: 'culture-14', name: 'Royal Albert Hall', type: 'culture_landmarks', coordinates: { lat: 51.5009, lng: -0.1773 }, walkTime: 11 },
  { id: 'culture-15', name: 'Buckingham Palace', type: 'culture_landmarks', coordinates: { lat: 51.5014, lng: -0.1419 }, walkTime: 8 },

  // Shopping & Lifestyle
  { id: 'shopping-1', name: 'Harrods', type: 'shopping_lifestyle', coordinates: { lat: 51.4994, lng: -0.1632 }, walkTime: 10 },
  { id: 'shopping-2', name: 'Selfridges', type: 'shopping_lifestyle', coordinates: { lat: 51.5145, lng: -0.1527 }, walkTime: 10 },
  { id: 'shopping-3', name: 'Bond Street', type: 'shopping_lifestyle', coordinates: { lat: 51.5134, lng: -0.1448 }, walkTime: 9 },
  { id: 'shopping-4', name: 'Westfield London', type: 'shopping_lifestyle', coordinates: { lat: 51.5074, lng: -0.2211 }, walkTime: 14 },
  { id: 'shopping-5', name: 'Westfield Stratford', type: 'shopping_lifestyle', coordinates: { lat: 51.5431, lng: -0.0063 }, walkTime: 18 },
  { id: 'shopping-6', name: 'Brent Cross', type: 'shopping_lifestyle', coordinates: { lat: 51.5765, lng: -0.2232 }, walkTime: 20 },
  { id: 'shopping-7', name: 'Covent Garden', type: 'shopping_lifestyle', coordinates: { lat: 51.5118, lng: -0.1226 }, walkTime: 6 },
  { id: 'shopping-8', name: 'Liberty London', type: 'shopping_lifestyle', coordinates: { lat: 51.5141, lng: -0.1399 }, walkTime: 8 },
  { id: 'shopping-9', name: 'Fortnum & Mason', type: 'shopping_lifestyle', coordinates: { lat: 51.5076, lng: -0.1373 }, walkTime: 8 },
  { id: 'shopping-10', name: 'Harvey Nichols', type: 'shopping_lifestyle', coordinates: { lat: 51.4992, lng: -0.1608 }, walkTime: 10 },
  { id: 'shopping-11', name: 'Peter Jones', type: 'shopping_lifestyle', coordinates: { lat: 51.4917, lng: -0.1579 }, walkTime: 9 },
  { id: 'shopping-12', name: 'Burlington Arcade', type: 'shopping_lifestyle', coordinates: { lat: 51.5083, lng: -0.1398 }, walkTime: 8 },
  { id: 'shopping-13', name: 'King\'s Road', type: 'shopping_lifestyle', coordinates: { lat: 51.4877, lng: -0.1688 }, walkTime: 10 },
  { id: 'shopping-14', name: 'Sloane Street', type: 'shopping_lifestyle', coordinates: { lat: 51.4962, lng: -0.1595 }, walkTime: 9 },
  { id: 'shopping-15', name: 'Carnaby Street', type: 'shopping_lifestyle', coordinates: { lat: 51.5133, lng: -0.1389 }, walkTime: 8 },

  // Hospitals & Clinics
  { id: 'hospital-1', name: 'The Harley Street Clinic', type: 'hospitals_clinics', coordinates: { lat: 51.5211, lng: -0.1489 }, walkTime: 10 },
  { id: 'hospital-2', name: 'The London Clinic', type: 'hospitals_clinics', coordinates: { lat: 51.5219, lng: -0.1466 }, walkTime: 10 },
  { id: 'hospital-3', name: 'The Cromwell Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.4965, lng: -0.1925 }, walkTime: 11 },
  { id: 'hospital-4', name: 'London Bridge Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5045, lng: -0.0865 }, walkTime: 8 },
  { id: 'hospital-5', name: 'The Portland Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5185, lng: -0.1455 }, walkTime: 10 },
  { id: 'hospital-6', name: 'The Wellington Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5345, lng: -0.1695 }, walkTime: 13 },
  { id: 'hospital-7', name: 'The Lister Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.4885, lng: -0.1675 }, walkTime: 10 },
  { id: 'hospital-8', name: 'Princess Grace Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5215, lng: -0.1545 }, walkTime: 11 },
  { id: 'hospital-9', name: 'King Edward VII\'s Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5157, lng: -0.1483 }, walkTime: 10 },
  { id: 'hospital-10', name: 'Guy\'s Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5035, lng: -0.0875 }, walkTime: 8 },
  { id: 'hospital-11', name: 'St Thomas\' Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.4985, lng: -0.1175 }, walkTime: 9 },
  { id: 'hospital-12', name: 'Chelsea & Westminster', type: 'hospitals_clinics', coordinates: { lat: 51.4815, lng: -0.1775 }, walkTime: 12 },
  { id: 'hospital-13', name: 'Royal London Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5175, lng: -0.0605 }, walkTime: 10 },
  { id: 'hospital-14', name: 'University College Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5245, lng: -0.1355 }, walkTime: 9 },
  { id: 'hospital-15', name: 'St Mary\'s Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5175, lng: -0.1725 }, walkTime: 12 },

  // Transport Hubs (Major Stations + Elizabeth Line)
  { id: 'transport-1', name: 'Paddington Station', type: 'transport_hubs', coordinates: { lat: 51.5154, lng: -0.1755 }, walkTime: 11 },
  { id: 'transport-2', name: 'King\'s Cross St Pancras', type: 'transport_hubs', coordinates: { lat: 51.5309, lng: -0.1238 }, walkTime: 10 },
  { id: 'transport-3', name: 'Liverpool Street', type: 'transport_hubs', coordinates: { lat: 51.5179, lng: -0.0813 }, walkTime: 8 },
  { id: 'transport-4', name: 'Victoria Station', type: 'transport_hubs', coordinates: { lat: 51.4952, lng: -0.1441 }, walkTime: 8 },
  { id: 'transport-5', name: 'Waterloo Station', type: 'transport_hubs', coordinates: { lat: 51.5031, lng: -0.1132 }, walkTime: 7 },
  { id: 'transport-6', name: 'London Bridge', type: 'transport_hubs', coordinates: { lat: 51.5049, lng: -0.0863 }, walkTime: 8 },
  { id: 'transport-7', name: 'Euston Station', type: 'transport_hubs', coordinates: { lat: 51.5282, lng: -0.1337 }, walkTime: 9 },
  { id: 'transport-8', name: 'Canary Wharf', type: 'transport_hubs', coordinates: { lat: 51.5054, lng: -0.0195 }, walkTime: 12 },
  { id: 'transport-9', name: 'Bond Street (Elizabeth Line)', type: 'transport_hubs', coordinates: { lat: 51.5142, lng: -0.1494 }, walkTime: 9 },
  { id: 'transport-10', name: 'Tottenham Court Road (Elizabeth Line)', type: 'transport_hubs', coordinates: { lat: 51.5165, lng: -0.1308 }, walkTime: 7 },
  { id: 'transport-11', name: 'Farringdon (Elizabeth Line)', type: 'transport_hubs', coordinates: { lat: 51.5203, lng: -0.1053 }, walkTime: 7 },
  { id: 'transport-12', name: 'Whitechapel (Elizabeth Line)', type: 'transport_hubs', coordinates: { lat: 51.5195, lng: -0.0612 }, walkTime: 10 },
  { id: 'transport-13', name: 'Custom House (Elizabeth Line)', type: 'transport_hubs', coordinates: { lat: 51.5094, lng: 0.0258 }, walkTime: 15 },
  { id: 'transport-14', name: 'Woolwich (Elizabeth Line)', type: 'transport_hubs', coordinates: { lat: 51.4920, lng: 0.0685 }, walkTime: 20 },
  { id: 'transport-15', name: 'Abbey Wood (Elizabeth Line)', type: 'transport_hubs', coordinates: { lat: 51.4907, lng: 0.1210 }, walkTime: 25 },
  { id: 'transport-16', name: 'Stratford', type: 'transport_hubs', coordinates: { lat: 51.5416, lng: -0.0042 }, walkTime: 18 },
  { id: 'transport-17', name: 'Old Street', type: 'transport_hubs', coordinates: { lat: 51.5258, lng: -0.0875 }, walkTime: 9 },
  { id: 'transport-18', name: 'Angel', type: 'transport_hubs', coordinates: { lat: 51.5322, lng: -0.1058 }, walkTime: 10 },
  { id: 'transport-19', name: 'Clapham Junction', type: 'transport_hubs', coordinates: { lat: 51.4644, lng: -0.1705 }, walkTime: 15 },
  { id: 'transport-20', name: 'Vauxhall', type: 'transport_hubs', coordinates: { lat: 51.4861, lng: -0.1253 }, walkTime: 7 },
];

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Helper functions for amenity filtering and proximity
export const getNearbyAmenities = (
  lat: number,
  lng: number,
  types?: AmenityType[],
  radiusKm: number = 2
): Amenity[] => {
  const filteredAmenities = types 
    ? amenities.filter(a => types.includes(a.type))
    : amenities;

  return filteredAmenities
    .map(amenity => ({
      ...amenity,
      distance: calculateDistance(lat, lng, amenity.coordinates.lat, amenity.coordinates.lng)
    }))
    .filter(amenity => amenity.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .map(({ distance, ...amenity }) => amenity);
};

export const getAmenitiesByTypes = (types: AmenityType[]): Amenity[] => {
  return amenities.filter(amenity => types.includes(amenity.type));
};
