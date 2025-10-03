// Best of London amenities data
export type AmenityType = 'private_schools' | 'prep_schools' | 'state_schools' | 'grammar_schools' | 'universities' | 'michelin_restaurants' | 'culture_landmarks' | 'shopping_lifestyle' | 'hospitals_clinics' | 'transport_hubs';

export interface Amenity {
  id: string;
  name: string;
  type: AmenityType;
  coordinates: {
    lat: number;
    lng: number;
  };
  walkTime: number; // minutes
  description?: string; // optional tagline/description
}

// Color scheme for each amenity type
export const amenityColors: Record<AmenityType, string> = {
  private_schools: '#8B5CF6', // purple
  prep_schools: '#EC4899', // pink
  state_schools: '#3B82F6', // blue
  grammar_schools: '#10B981', // green
  universities: '#06B6D4', // cyan
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
  universities: 'Universities 🎓',
  michelin_restaurants: 'Michelin Star Restaurants 🍴',
  culture_landmarks: 'Culture & Landmarks 🎭',
  shopping_lifestyle: 'Shopping & Lifestyle 🛍️',
  hospitals_clinics: 'Hospitals & Clinics 🏥',
  transport_hubs: 'Transport Hubs 🚇',
};

// Extensive amenities data across London
export const amenities: Amenity[] = [
  // Private Schools (Comprehensive London List - A-Z)
  { id: 'private-1', name: 'Abercorn School', type: 'private_schools', coordinates: { lat: 51.5335, lng: -0.1715 }, walkTime: 11 },
  { id: 'private-2', name: 'ACS Hillingdon International School', type: 'private_schools', coordinates: { lat: 51.5495, lng: -0.4565 }, walkTime: 38 },
  { id: 'private-3', name: 'Acton Burnell School', type: 'private_schools', coordinates: { lat: 51.5235, lng: -0.2715 }, walkTime: 17 },
  { id: 'private-4', name: 'Albemarle Independent College', type: 'private_schools', coordinates: { lat: 51.5215, lng: -0.1585 }, walkTime: 10 },
  { id: 'private-5', name: 'Alleyn\'s School', type: 'private_schools', coordinates: { lat: 51.4415, lng: -0.0795 }, walkTime: 12 },
  { id: 'private-6', name: 'Alpha Preparatory School', type: 'private_schools', coordinates: { lat: 51.5285, lng: -0.1695 }, walkTime: 11 },
  { id: 'private-7', name: 'Arnold House School', type: 'private_schools', coordinates: { lat: 51.5445, lng: -0.1675 }, walkTime: 13 },
  { id: 'private-8', name: 'Ashbourne College', type: 'private_schools', coordinates: { lat: 51.4985, lng: -0.1825 }, walkTime: 11 },
  { id: 'private-9', name: 'Ashton House School', type: 'private_schools', coordinates: { lat: 51.5545, lng: -0.1805 }, walkTime: 14 },
  { id: 'private-10', name: 'Babington House School', type: 'private_schools', coordinates: { lat: 51.4665, lng: -0.1245 }, walkTime: 12 },
  { id: 'private-11', name: 'Bancroft\'s School', type: 'private_schools', coordinates: { lat: 51.5925, lng: 0.0285 }, walkTime: 23 },
  { id: 'private-12', name: 'Barnet Hill Academy', type: 'private_schools', coordinates: { lat: 51.6445, lng: -0.1915 }, walkTime: 26 },
  { id: 'private-13', name: 'Bassett House School', type: 'private_schools', coordinates: { lat: 51.4985, lng: -0.1905 }, walkTime: 11 },
  { id: 'private-14', name: 'Beechwood Park School', type: 'private_schools', coordinates: { lat: 51.7635, lng: -0.3585 }, walkTime: 45 },
  { id: 'private-15', name: 'Belmont School', type: 'private_schools', coordinates: { lat: 51.6195, lng: -0.2165 }, walkTime: 22 },
  { id: 'private-16', name: 'Bendixen\'s', type: 'private_schools', coordinates: { lat: 51.4985, lng: -0.1945 }, walkTime: 11 },
  { id: 'private-17', name: 'Blackheath High School', type: 'private_schools', coordinates: { lat: 51.4645, lng: -0.0045 }, walkTime: 18 },
  { id: 'private-18', name: 'Brampton College', type: 'private_schools', coordinates: { lat: 51.5515, lng: -0.1755 }, walkTime: 14 },
  { id: 'private-19', name: 'Broomfield House School', type: 'private_schools', coordinates: { lat: 51.4985, lng: -0.1985 }, walkTime: 11 },
  { id: 'private-20', name: 'Broomwood Hall School', type: 'private_schools', coordinates: { lat: 51.4615, lng: -0.1685 }, walkTime: 15 },
  { id: 'private-21', name: 'Buckingham Preparatory School', type: 'private_schools', coordinates: { lat: 51.4995, lng: -0.1715 }, walkTime: 10 },
  { id: 'private-22', name: 'Cameron House School', type: 'private_schools', coordinates: { lat: 51.4885, lng: -0.1745 }, walkTime: 10 },
  { id: 'private-23', name: 'Carden School', type: 'private_schools', coordinates: { lat: 51.5085, lng: -0.2135 }, walkTime: 13 },
  { id: 'private-24', name: 'Channing School', type: 'private_schools', coordinates: { lat: 51.5735, lng: -0.1495 }, walkTime: 15 },
  { id: 'private-25', name: 'Charterhouse Square School', type: 'private_schools', coordinates: { lat: 51.5215, lng: -0.0985 }, walkTime: 8 },
  { id: 'private-26', name: 'Chelsea Independent College', type: 'private_schools', coordinates: { lat: 51.4935, lng: -0.1685 }, walkTime: 10 },
  { id: 'private-27', name: 'City of London School', type: 'private_schools', coordinates: { lat: 51.5125, lng: -0.0954 }, walkTime: 8 },
  { id: 'private-28', name: 'City of London School for Girls', type: 'private_schools', coordinates: { lat: 51.5195, lng: -0.0935 }, walkTime: 8 },
  { id: 'private-29', name: 'Claremont Fan Court School', type: 'private_schools', coordinates: { lat: 51.3685, lng: -0.3915 }, walkTime: 35 },
  { id: 'private-30', name: 'Colfe\'s School', type: 'private_schools', coordinates: { lat: 51.4525, lng: 0.0155 }, walkTime: 19 },
  { id: 'private-31', name: 'Connaught House School', type: 'private_schools', coordinates: { lat: 51.5115, lng: -0.2085 }, walkTime: 13 },
  { id: 'private-32', name: 'Cranbrook School', type: 'private_schools', coordinates: { lat: 51.5945, lng: 0.0525 }, walkTime: 24 },
  { id: 'private-33', name: 'Croydon High School', type: 'private_schools', coordinates: { lat: 51.3715, lng: -0.0985 }, walkTime: 31 },
  { id: 'private-34', name: 'Dallington School', type: 'private_schools', coordinates: { lat: 51.5285, lng: -0.1125 }, walkTime: 9 },
  { id: 'private-35', name: 'David Game College', type: 'private_schools', coordinates: { lat: 51.5195, lng: -0.1215 }, walkTime: 9 },
  { id: 'private-36', name: 'Devonshire House Preparatory School', type: 'private_schools', coordinates: { lat: 51.5515, lng: -0.1765 }, walkTime: 14 },
  { id: 'private-37', name: 'DLD College London', type: 'private_schools', coordinates: { lat: 51.5015, lng: -0.1195 }, walkTime: 7 },
  { id: 'private-38', name: 'Dolphin School', type: 'private_schools', coordinates: { lat: 51.4745, lng: -0.1615 }, walkTime: 13 },
  { id: 'private-39', name: 'Downsend School', type: 'private_schools', coordinates: { lat: 51.3375, lng: -0.3885 }, walkTime: 36 },
  { id: 'private-40', name: 'Dulwich College', type: 'private_schools', coordinates: { lat: 51.4445, lng: -0.0840 }, walkTime: 12 },
  { id: 'private-41', name: 'Dulwich Preparatory School', type: 'private_schools', coordinates: { lat: 51.4435, lng: -0.0865 }, walkTime: 12 },
  { id: 'private-42', name: 'Eaton House The Manor', type: 'private_schools', coordinates: { lat: 51.4885, lng: -0.1695 }, walkTime: 10 },
  { id: 'private-43', name: 'Eaton Square School', type: 'private_schools', coordinates: { lat: 51.4955, lng: -0.1515 }, walkTime: 9 },
  { id: 'private-44', name: 'Ecole Jeannine Manuel', type: 'private_schools', coordinates: { lat: 51.4895, lng: -0.1715 }, walkTime: 10 },
  { id: 'private-45', name: 'Edge Grove School', type: 'private_schools', coordinates: { lat: 51.7315, lng: -0.3815 }, walkTime: 44 },
  { id: 'private-46', name: 'Eltham College', type: 'private_schools', coordinates: { lat: 51.4495, lng: 0.0485 }, walkTime: 20 },
  { id: 'private-47', name: 'Emanuel School', type: 'private_schools', coordinates: { lat: 51.4615, lng: -0.1685 }, walkTime: 15 },
  { id: 'private-48', name: 'Epsom College', type: 'private_schools', coordinates: { lat: 51.3265, lng: -0.2635 }, walkTime: 40 },
  { id: 'private-49', name: 'Fairfield Preparatory School', type: 'private_schools', coordinates: { lat: 51.5685, lng: -0.2215 }, walkTime: 16 },
  { id: 'private-50', name: 'Falkner House', type: 'private_schools', coordinates: { lat: 51.4915, lng: -0.1685 }, walkTime: 10 },
  { id: 'private-51', name: 'Farringtons School', type: 'private_schools', coordinates: { lat: 51.3545, lng: 0.1165 }, walkTime: 38 },
  { id: 'private-52', name: 'Finton House School', type: 'private_schools', coordinates: { lat: 51.4625, lng: -0.1705 }, walkTime: 15 },
  { id: 'private-53', name: 'Forest School', type: 'private_schools', coordinates: { lat: 51.5895, lng: 0.0125 }, walkTime: 22 },
  { id: 'private-54', name: 'Francis Holland School, Regent\'s Park', type: 'private_schools', coordinates: { lat: 51.5235, lng: -0.1565 }, walkTime: 10 },
  { id: 'private-55', name: 'Francis Holland School, Sloane Square', type: 'private_schools', coordinates: { lat: 51.4935, lng: -0.1565 }, walkTime: 10 },
  { id: 'private-56', name: 'Fulham Prep School', type: 'private_schools', coordinates: { lat: 51.4815, lng: -0.2015 }, walkTime: 12 },
  { id: 'private-57', name: 'Garden House School', type: 'private_schools', coordinates: { lat: 51.4885, lng: -0.1705 }, walkTime: 10 },
  { id: 'private-58', name: 'Gatehouse School', type: 'private_schools', coordinates: { lat: 51.5515, lng: -0.1785 }, walkTime: 14 },
  { id: 'private-59', name: 'Godolphin and Latymer School', type: 'private_schools', coordinates: { lat: 51.4915, lng: -0.2215 }, walkTime: 12 },
  { id: 'private-60', name: 'Grange Park Preparatory School', type: 'private_schools', coordinates: { lat: 51.5125, lng: -0.2085 }, walkTime: 13 },
  { id: 'private-61', name: 'Grimsdell, Mill Hill Pre-Preparatory School', type: 'private_schools', coordinates: { lat: 51.6145, lng: -0.2295 }, walkTime: 22 },
  { id: 'private-62', name: 'Guildhouse School', type: 'private_schools', coordinates: { lat: 51.4985, lng: -0.1895 }, walkTime: 11 },
  { id: 'private-63', name: 'Haberdashers\' Aske\'s Boys\' School', type: 'private_schools', coordinates: { lat: 51.6515, lng: -0.2165 }, walkTime: 27 },
  { id: 'private-64', name: 'Haberdashers\' Aske\'s School for Girls', type: 'private_schools', coordinates: { lat: 51.6475, lng: -0.2115 }, walkTime: 27 },
  { id: 'private-65', name: 'Hall School Wimbledon', type: 'private_schools', coordinates: { lat: 51.4225, lng: -0.2095 }, walkTime: 18 },
  { id: 'private-66', name: 'The Hall School', type: 'private_schools', coordinates: { lat: 51.5565, lng: -0.1745 }, walkTime: 14 },
  { id: 'private-67', name: 'Hampton Court House', type: 'private_schools', coordinates: { lat: 51.4055, lng: -0.3435 }, walkTime: 28 },
  { id: 'private-68', name: 'Hampton School', type: 'private_schools', coordinates: { lat: 51.4185, lng: -0.3645 }, walkTime: 25 },
  { id: 'private-69', name: 'The Harrodian School', type: 'private_schools', coordinates: { lat: 51.4755, lng: -0.2515 }, walkTime: 16 },
  { id: 'private-70', name: 'Harrow School', type: 'private_schools', coordinates: { lat: 51.5755, lng: -0.3395 }, walkTime: 28 },
  { id: 'private-71', name: 'Heathfield School, Pinner', type: 'private_schools', coordinates: { lat: 51.5945, lng: -0.3885 }, walkTime: 32 },
  { id: 'private-72', name: 'Hendon Preparatory School', type: 'private_schools', coordinates: { lat: 51.5885, lng: -0.2185 }, walkTime: 20 },
  { id: 'private-73', name: 'Highgate School', type: 'private_schools', coordinates: { lat: 51.5715, lng: -0.1525 }, walkTime: 16 },
  { id: 'private-74', name: 'Hill House International Junior School', type: 'private_schools', coordinates: { lat: 51.4985, lng: -0.1625 }, walkTime: 9 },
  { id: 'private-75', name: 'Holland Park Pre-Prep School & Day Nursery', type: 'private_schools', coordinates: { lat: 51.5015, lng: -0.2085 }, walkTime: 12 },
  { id: 'private-76', name: 'Holy Cross Preparatory School', type: 'private_schools', coordinates: { lat: 51.4085, lng: -0.3015 }, walkTime: 25 },
  { id: 'private-77', name: 'Hornsby House School', type: 'private_schools', coordinates: { lat: 51.4655, lng: -0.1685 }, walkTime: 15 },
  { id: 'private-78', name: 'Hurlingham School', type: 'private_schools', coordinates: { lat: 51.4765, lng: -0.1865 }, walkTime: 11 },
  { id: 'private-79', name: 'Ibstock Place School', type: 'private_schools', coordinates: { lat: 51.4375, lng: -0.2235 }, walkTime: 17 },
  { id: 'private-80', name: 'Immanuel College', type: 'private_schools', coordinates: { lat: 51.4735, lng: -0.0015 }, walkTime: 18 },
  { id: 'private-81', name: 'International School of London', type: 'private_schools', coordinates: { lat: 51.5385, lng: -0.1585 }, walkTime: 12 },
  { id: 'private-82', name: 'James Allen\'s Girls\' School', type: 'private_schools', coordinates: { lat: 51.4465, lng: -0.0785 }, walkTime: 11 },
  { id: 'private-83', name: 'The John Lyon School', type: 'private_schools', coordinates: { lat: 51.5735, lng: -0.3415 }, walkTime: 28 },
  { id: 'private-84', name: 'Kensington Park School', type: 'private_schools', coordinates: { lat: 51.5015, lng: -0.2095 }, walkTime: 13 },
  { id: 'private-85', name: 'Kensington Preparatory School', type: 'private_schools', coordinates: { lat: 51.5015, lng: -0.1925 }, walkTime: 11 },
  { id: 'private-86', name: 'Kent College', type: 'private_schools', coordinates: { lat: 51.2795, lng: 1.0785 }, walkTime: 60 },
  { id: 'private-87', name: 'Kew Green Preparatory School', type: 'private_schools', coordinates: { lat: 51.4835, lng: -0.2885 }, walkTime: 19 },
  { id: 'private-88', name: 'King\'s College School, Wimbledon', type: 'private_schools', coordinates: { lat: 51.4170, lng: -0.2075 }, walkTime: 18 },
  { id: 'private-89', name: 'King\'s House School', type: 'private_schools', coordinates: { lat: 51.4085, lng: -0.3015 }, walkTime: 25 },
  { id: 'private-90', name: 'Kingston Grammar School', type: 'private_schools', coordinates: { lat: 51.4115, lng: -0.3065 }, walkTime: 25 },
  { id: 'private-91', name: 'Knightsbridge School', type: 'private_schools', coordinates: { lat: 51.4965, lng: -0.1615 }, walkTime: 9 },
  { id: 'private-92', name: 'Lady Eleanor Holles School', type: 'private_schools', coordinates: { lat: 51.4135, lng: -0.3795 }, walkTime: 25 },
  { id: 'private-93', name: 'La Retraite RC Girls School', type: 'private_schools', coordinates: { lat: 51.4625, lng: -0.1395 }, walkTime: 14 },
  { id: 'private-94', name: 'Latymer Upper School', type: 'private_schools', coordinates: { lat: 51.4935, lng: -0.2345 }, walkTime: 13 },
  { id: 'private-95', name: 'Laurel Lane Primary School', type: 'private_schools', coordinates: { lat: 51.3925, lng: -0.2935 }, walkTime: 28 },
  { id: 'private-96', name: 'The Laurels School', type: 'private_schools', coordinates: { lat: 51.5015, lng: -0.2115 }, walkTime: 13 },
  { id: 'private-97', name: 'L\'Ecole de Battersea', type: 'private_schools', coordinates: { lat: 51.4725, lng: -0.1665 }, walkTime: 13 },
  { id: 'private-98', name: 'L\'Ecole des Petits', type: 'private_schools', coordinates: { lat: 51.4775, lng: -0.1945 }, walkTime: 11 },
  { id: 'private-99', name: 'Lionheart School', type: 'private_schools', coordinates: { lat: 51.5285, lng: -0.1685 }, walkTime: 11 },
  { id: 'private-100', name: 'Lochinver House School', type: 'private_schools', coordinates: { lat: 51.5945, lng: -0.2325 }, walkTime: 21 },
  { id: 'private-101', name: 'London Christian School', type: 'private_schools', coordinates: { lat: 51.5685, lng: -0.1285 }, walkTime: 15 },
  { id: 'private-102', name: 'London Grammar School', type: 'private_schools', coordinates: { lat: 51.5285, lng: -0.1425 }, walkTime: 10 },
  { id: 'private-103', name: 'Lucton School', type: 'private_schools', coordinates: { lat: 52.2485, lng: -2.8115 }, walkTime: 90 },
  { id: 'private-104', name: 'Lyceum Kennedy International School', type: 'private_schools', coordinates: { lat: 51.5015, lng: -0.1585 }, walkTime: 9 },
  { id: 'private-105', name: 'Maida Vale School', type: 'private_schools', coordinates: { lat: 51.5285, lng: -0.1885 }, walkTime: 12 },
  { id: 'private-106', name: 'Maltman\'s Green School', type: 'private_schools', coordinates: { lat: 51.5885, lng: -0.6415 }, walkTime: 48 },
  { id: 'private-107', name: 'Manor Lodge School', type: 'private_schools', coordinates: { lat: 51.5015, lng: -0.2125 }, walkTime: 13 },
  { id: 'private-108', name: 'Marymount International School', type: 'private_schools', coordinates: { lat: 51.3615, lng: -0.3015 }, walkTime: 32 },
  { id: 'private-109', name: 'Merchant Taylors\' School', type: 'private_schools', coordinates: { lat: 51.6115, lng: -0.4315 }, walkTime: 35 },
  { id: 'private-110', name: 'Merton Court School', type: 'private_schools', coordinates: { lat: 51.4515, lng: -0.2515 }, walkTime: 17 },
  { id: 'private-111', name: 'Mill Hill School', type: 'private_schools', coordinates: { lat: 51.6135, lng: -0.2275 }, walkTime: 21 },
  { id: 'private-112', name: 'More House School, Knightsbridge', type: 'private_schools', coordinates: { lat: 51.4985, lng: -0.1615 }, walkTime: 9 },
  { id: 'private-113', name: 'The Mount, Mill Hill International', type: 'private_schools', coordinates: { lat: 51.6155, lng: -0.2285 }, walkTime: 22 },
  { id: 'private-114', name: 'Newton Preparatory School', type: 'private_schools', coordinates: { lat: 51.4755, lng: -0.1585 }, walkTime: 13 },
  { id: 'private-115', name: 'North Bridge House School', type: 'private_schools', coordinates: { lat: 51.5385, lng: -0.1585 }, walkTime: 12 },
  { id: 'private-116', name: 'North London Collegiate School', type: 'private_schools', coordinates: { lat: 51.6135, lng: -0.2895 }, walkTime: 23 },
  { id: 'private-117', name: 'Northcote Lodge', type: 'private_schools', coordinates: { lat: 51.4615, lng: -0.1695 }, walkTime: 15 },
  { id: 'private-118', name: 'Northwood College for Girls', type: 'private_schools', coordinates: { lat: 51.6085, lng: -0.4215 }, walkTime: 34 },
  { id: 'private-119', name: 'Notting Hill and Ealing High School', type: 'private_schools', coordinates: { lat: 51.5115, lng: -0.3065 }, walkTime: 19 },
  { id: 'private-120', name: 'Notting Hill Preparatory School', type: 'private_schools', coordinates: { lat: 51.5115, lng: -0.2085 }, walkTime: 13 },
  { id: 'private-121', name: 'Oakfield Preparatory School', type: 'private_schools', coordinates: { lat: 51.5085, lng: -0.2135 }, walkTime: 13 },
  { id: 'private-122', name: 'Old Palace of John Whitgift School', type: 'private_schools', coordinates: { lat: 51.3715, lng: -0.0965 }, walkTime: 31 },
  { id: 'private-123', name: 'Orchard House School', type: 'private_schools', coordinates: { lat: 51.5115, lng: -0.2095 }, walkTime: 13 },
  { id: 'private-124', name: 'Orley Farm School', type: 'private_schools', coordinates: { lat: 51.5835, lng: -0.3215 }, walkTime: 26 },
  { id: 'private-125', name: 'Palmers Green High School', type: 'private_schools', coordinates: { lat: 51.6185, lng: -0.1095 }, walkTime: 24 },
  { id: 'private-126', name: 'Parsons Green Prep School', type: 'private_schools', coordinates: { lat: 51.4755, lng: -0.2015 }, walkTime: 12 },
  { id: 'private-127', name: 'Pembridge Hall School', type: 'private_schools', coordinates: { lat: 51.5125, lng: -0.2035 }, walkTime: 12 },
  { id: 'private-128', name: 'Perseid School', type: 'private_schools', coordinates: { lat: 51.5015, lng: -0.2145 }, walkTime: 13 },
  { id: 'private-129', name: 'The Pointer School', type: 'private_schools', coordinates: { lat: 51.4915, lng: -0.1695 }, walkTime: 10 },
  { id: 'private-130', name: 'Portland Place School', type: 'private_schools', coordinates: { lat: 51.5215, lng: -0.1425 }, walkTime: 9 },
  { id: 'private-131', name: 'Prospect House School', type: 'private_schools', coordinates: { lat: 51.4735, lng: -0.2215 }, walkTime: 14 },
  { id: 'private-132', name: 'Putney High School', type: 'private_schools', coordinates: { lat: 51.4635, lng: -0.2185 }, walkTime: 16 },
  { id: 'private-133', name: 'Putney Vale Preparatory School', type: 'private_schools', coordinates: { lat: 51.4355, lng: -0.2285 }, walkTime: 19 },
  { id: 'private-134', name: 'Queen Ethelburga\'s Collegiate', type: 'private_schools', coordinates: { lat: 53.9565, lng: -1.1285 }, walkTime: 120 },
  { id: 'private-135', name: 'Queen\'s College, London', type: 'private_schools', coordinates: { lat: 51.5195, lng: -0.1585 }, walkTime: 10 },
  { id: 'private-136', name: 'Queen\'s Gate School', type: 'private_schools', coordinates: { lat: 51.4965, lng: -0.1825 }, walkTime: 11 },
  { id: 'private-137', name: 'Queen\'s House School', type: 'private_schools', coordinates: { lat: 51.4965, lng: -0.1845 }, walkTime: 11 },
  { id: 'private-138', name: 'Radnor House', type: 'private_schools', coordinates: { lat: 51.4135, lng: -0.3125 }, walkTime: 26 },
  { id: 'private-139', name: 'Ravenscourt Park Preparatory School', type: 'private_schools', coordinates: { lat: 51.4935, lng: -0.2285 }, walkTime: 13 },
  { id: 'private-140', name: 'Redcliffe School', type: 'private_schools', coordinates: { lat: 51.4865, lng: -0.1715 }, walkTime: 10 },
  { id: 'private-141', name: 'Reed\'s School', type: 'private_schools', coordinates: { lat: 51.2935, lng: -0.5685 }, walkTime: 48 },
  { id: 'private-142', name: 'Regent\'s Park Christian School', type: 'private_schools', coordinates: { lat: 51.5335, lng: -0.1585 }, walkTime: 11 },
  { id: 'private-143', name: 'Richings Park Preparatory School', type: 'private_schools', coordinates: { lat: 51.5285, lng: -0.5085 }, walkTime: 42 },
  { id: 'private-144', name: 'Riverston School', type: 'private_schools', coordinates: { lat: 51.4595, lng: -0.1875 }, walkTime: 13 },
  { id: 'private-145', name: 'Rokeby School', type: 'private_schools', coordinates: { lat: 51.4215, lng: -0.2825 }, walkTime: 22 },
  { id: 'private-146', name: 'Rosemead Preparatory School', type: 'private_schools', coordinates: { lat: 51.4655, lng: -0.1715 }, walkTime: 15 },
  { id: 'private-147', name: 'Royal Masonic School for Girls', type: 'private_schools', coordinates: { lat: 51.4885, lng: -0.6915 }, walkTime: 52 },
  { id: 'private-148', name: 'Royal Russell School', type: 'private_schools', coordinates: { lat: 51.3615, lng: -0.0815 }, walkTime: 32 },
  { id: 'private-149', name: 'Sacred Heart High School', type: 'private_schools', coordinates: { lat: 51.5235, lng: -0.2085 }, walkTime: 13 },
  { id: 'private-150', name: 'St Alban\'s High School for Girls', type: 'private_schools', coordinates: { lat: 51.7515, lng: -0.3415 }, walkTime: 42 },
  { id: 'private-151', name: 'St Anthony\'s School for Boys', type: 'private_schools', coordinates: { lat: 51.5545, lng: -0.1795 }, walkTime: 14 },
  { id: 'private-152', name: 'St Augustine\'s Priory', type: 'private_schools', coordinates: { lat: 51.5165, lng: -0.3215 }, walkTime: 21 },
  { id: 'private-153', name: 'St Benedict\'s School', type: 'private_schools', coordinates: { lat: 51.5135, lng: -0.3085 }, walkTime: 19 },
  { id: 'private-154', name: 'St Catherine\'s School, Twickenham', type: 'private_schools', coordinates: { lat: 51.4415, lng: -0.3315 }, walkTime: 26 },
  { id: 'private-155', name: 'St Christopher\'s School, Hampstead', type: 'private_schools', coordinates: { lat: 51.5515, lng: -0.1755 }, walkTime: 14 },
  { id: 'private-156', name: 'St Clare\'s, Oxford', type: 'private_schools', coordinates: { lat: 51.7585, lng: -1.2615 }, walkTime: 90 },
  { id: 'private-157', name: 'St Columba\'s College', type: 'private_schools', coordinates: { lat: 51.7515, lng: -0.3385 }, walkTime: 42 },
  { id: 'private-158', name: 'St Dunstan\'s College', type: 'private_schools', coordinates: { lat: 51.4315, lng: -0.0435 }, walkTime: 17 },
  { id: 'private-159', name: 'St George\'s School, Windsor Castle', type: 'private_schools', coordinates: { lat: 51.4835, lng: -0.6085 }, walkTime: 48 },
  { id: 'private-160', name: 'St Helen\'s School', type: 'private_schools', coordinates: { lat: 51.5985, lng: -0.4215 }, walkTime: 34 },
  { id: 'private-161', name: 'St Hilda\'s Preparatory School for Girls', type: 'private_schools', coordinates: { lat: 51.5085, lng: -0.2135 }, walkTime: 13 },
  { id: 'private-162', name: 'St James Preparatory School', type: 'private_schools', coordinates: { lat: 51.4985, lng: -0.1925 }, walkTime: 11 },
  { id: 'private-163', name: 'St James Senior Boys\' School', type: 'private_schools', coordinates: { lat: 51.4985, lng: -0.1945 }, walkTime: 11 },
  { id: 'private-164', name: 'St James Senior Girls\' School', type: 'private_schools', coordinates: { lat: 51.4985, lng: -0.1965 }, walkTime: 11 },
  { id: 'private-165', name: 'St John\'s Preparatory and Senior School', type: 'private_schools', coordinates: { lat: 51.5515, lng: -0.1775 }, walkTime: 14 },
  { id: 'private-166', name: 'St John\'s Wood Pre-Preparatory School', type: 'private_schools', coordinates: { lat: 51.5335, lng: -0.1685 }, walkTime: 11 },
  { id: 'private-167', name: 'St Margaret\'s School, Hampstead', type: 'private_schools', coordinates: { lat: 51.5515, lng: -0.1785 }, walkTime: 14 },
  { id: 'private-168', name: 'St Martin\'s School, Northwood', type: 'private_schools', coordinates: { lat: 51.6085, lng: -0.4235 }, walkTime: 34 },
  { id: 'private-169', name: 'St Mary\'s School, Hampstead', type: 'private_schools', coordinates: { lat: 51.5545, lng: -0.1785 }, walkTime: 14 },
  { id: 'private-170', name: 'St Paul\'s Cathedral School', type: 'private_schools', coordinates: { lat: 51.5135, lng: -0.0985 }, walkTime: 8 },
  { id: 'private-171', name: 'St Paul\'s Girls\' School', type: 'private_schools', coordinates: { lat: 51.4895, lng: -0.2235 }, walkTime: 14 },
  { id: 'private-172', name: 'St Paul\'s School', type: 'private_schools', coordinates: { lat: 51.4715, lng: -0.2415 }, walkTime: 15 },
  { id: 'private-173', name: 'St Swithun\'s School', type: 'private_schools', coordinates: { lat: 51.0585, lng: -1.3185 }, walkTime: 85 },
  { id: 'private-174', name: 'Sancton Wood School', type: 'private_schools', coordinates: { lat: 52.1985, lng: 0.1285 }, walkTime: 75 },
  { id: 'private-175', name: 'Sevenoaks School', type: 'private_schools', coordinates: { lat: 51.2715, lng: 0.1885 }, walkTime: 55 },
  { id: 'private-176', name: 'Sherrardswood School', type: 'private_schools', coordinates: { lat: 51.7215, lng: -0.2815 }, walkTime: 40 },
  { id: 'private-177', name: 'Shrewsbury House School', type: 'private_schools', coordinates: { lat: 51.3915, lng: -0.3115 }, walkTime: 28 },
  { id: 'private-178', name: 'South Hampstead High School', type: 'private_schools', coordinates: { lat: 51.5475, lng: -0.1785 }, walkTime: 13 },
  { id: 'private-179', name: 'Streatham & Clapham High School', type: 'private_schools', coordinates: { lat: 51.4385, lng: -0.1285 }, walkTime: 15 },
  { id: 'private-180', name: 'Surbiton High School', type: 'private_schools', coordinates: { lat: 51.3935, lng: -0.3085 }, walkTime: 28 },
  { id: 'private-181', name: 'Sutton High School', type: 'private_schools', coordinates: { lat: 51.3615, lng: -0.1915 }, walkTime: 33 },
  { id: 'private-182', name: 'Sydenham High School', type: 'private_schools', coordinates: { lat: 51.4285, lng: -0.0585 }, walkTime: 16 },
  { id: 'private-183', name: 'TASIS The American School in England', type: 'private_schools', coordinates: { lat: 51.2515, lng: -0.5785 }, walkTime: 50 },
  { id: 'private-184', name: 'Thomas\'s Battersea', type: 'private_schools', coordinates: { lat: 51.4745, lng: -0.1595 }, walkTime: 13 },
  { id: 'private-185', name: 'Thomas\'s Clapham', type: 'private_schools', coordinates: { lat: 51.4625, lng: -0.1395 }, walkTime: 14 },
  { id: 'private-186', name: 'Thomas\'s Fulham', type: 'private_schools', coordinates: { lat: 51.4785, lng: -0.1985 }, walkTime: 12 },
  { id: 'private-187', name: 'Thomas\'s Kensington', type: 'private_schools', coordinates: { lat: 51.4995, lng: -0.1895 }, walkTime: 11 },
  { id: 'private-188', name: 'Thorpe Hall School', type: 'private_schools', coordinates: { lat: 51.7115, lng: 0.5285 }, walkTime: 65 },
  { id: 'private-189', name: 'Tonbridge School', type: 'private_schools', coordinates: { lat: 51.1985, lng: 0.2785 }, walkTime: 60 },
  { id: 'private-190', name: 'Tower House School', type: 'private_schools', coordinates: { lat: 51.4815, lng: -0.2485 }, walkTime: 16 },
  { id: 'private-191', name: 'Trinity School', type: 'private_schools', coordinates: { lat: 51.3615, lng: -0.0515 }, walkTime: 32 },
  { id: 'private-192', name: 'University College School', type: 'private_schools', coordinates: { lat: 51.5505, lng: -0.1775 }, walkTime: 11 },
  { id: 'private-193', name: 'Ursuline High School', type: 'private_schools', coordinates: { lat: 51.4335, lng: -0.2215 }, walkTime: 18 },
  { id: 'private-194', name: 'Walthamstow Hall', type: 'private_schools', coordinates: { lat: 51.3515, lng: 0.2585 }, walkTime: 57 },
  { id: 'private-195', name: 'Westminster Abbey Choir School', type: 'private_schools', coordinates: { lat: 51.4995, lng: -0.1295 }, walkTime: 7 },
  { id: 'private-196', name: 'Westminster School', type: 'private_schools', coordinates: { lat: 51.4995, lng: -0.1315 }, walkTime: 10 },
  { id: 'private-197', name: 'Westminster Under School', type: 'private_schools', coordinates: { lat: 51.4985, lng: -0.1325 }, walkTime: 10 },
  { id: 'private-198', name: 'Wetherby School', type: 'private_schools', coordinates: { lat: 51.5145, lng: -0.2055 }, walkTime: 12 },
  { id: 'private-199', name: 'Whitgift School', type: 'private_schools', coordinates: { lat: 51.3715, lng: -0.0865 }, walkTime: 30 },
  { id: 'private-200', name: 'Wimbledon High School', type: 'private_schools', coordinates: { lat: 51.4245, lng: -0.2065 }, walkTime: 14 },

  // Prep Schools (Comprehensive London List - A-Z)
  { id: 'prep-1', name: 'Alpha Preparatory School', type: 'prep_schools', coordinates: { lat: 51.5835, lng: -0.3385 }, walkTime: 27 },
  { id: 'prep-2', name: 'Annemount School', type: 'prep_schools', coordinates: { lat: 51.5545, lng: -0.1775 }, walkTime: 14 },
  { id: 'prep-3', name: 'Arnold House School', type: 'prep_schools', coordinates: { lat: 51.5445, lng: -0.1675 }, walkTime: 13 },
  { id: 'prep-4', name: 'Ashton House School', type: 'prep_schools', coordinates: { lat: 51.4815, lng: -0.3315 }, walkTime: 23 },
  { id: 'prep-5', name: 'Bancroft\'s Preparatory School', type: 'prep_schools', coordinates: { lat: 51.5915, lng: 0.0295 }, walkTime: 23 },
  { id: 'prep-6', name: 'Barnardiston Hall Preparatory School', type: 'prep_schools', coordinates: { lat: 52.1485, lng: 0.7285 }, walkTime: 85 },
  { id: 'prep-7', name: 'Belmont, Mill Hill Preparatory School', type: 'prep_schools', coordinates: { lat: 51.6155, lng: -0.2295 }, walkTime: 22 },
  { id: 'prep-8', name: 'Broomfield House School', type: 'prep_schools', coordinates: { lat: 51.4835, lng: -0.2855 }, walkTime: 19 },
  { id: 'prep-9', name: 'Broomwood Prep', type: 'prep_schools', coordinates: { lat: 51.4615, lng: -0.1685 }, walkTime: 15 },
  { id: 'prep-10', name: 'Bute House Preparatory School', type: 'prep_schools', coordinates: { lat: 51.4935, lng: -0.2235 }, walkTime: 13 },
  { id: 'prep-11', name: 'Channing Junior School', type: 'prep_schools', coordinates: { lat: 51.5725, lng: -0.1505 }, walkTime: 15 },
  { id: 'prep-12', name: 'Chepstow House School', type: 'prep_schools', coordinates: { lat: 51.5135, lng: -0.2045 }, walkTime: 12 },
  { id: 'prep-13', name: 'City of London School for Girls Preparatory Department', type: 'prep_schools', coordinates: { lat: 51.5185, lng: -0.0945 }, walkTime: 8 },
  { id: 'prep-14', name: 'Colfe\'s Junior School', type: 'prep_schools', coordinates: { lat: 51.4515, lng: 0.0165 }, walkTime: 19 },
  { id: 'prep-15', name: 'Dallington School', type: 'prep_schools', coordinates: { lat: 51.5285, lng: -0.1105 }, walkTime: 9 },
  { id: 'prep-16', name: 'Dulwich Prep London', type: 'prep_schools', coordinates: { lat: 51.4435, lng: -0.0865 }, walkTime: 12 },
  { id: 'prep-17', name: 'Durston House', type: 'prep_schools', coordinates: { lat: 51.5135, lng: -0.3115 }, walkTime: 20 },
  { id: 'prep-18', name: 'Eaton Square Belgravia', type: 'prep_schools', coordinates: { lat: 51.4955, lng: -0.1515 }, walkTime: 9 },
  { id: 'prep-19', name: 'Eltham College Junior School', type: 'prep_schools', coordinates: { lat: 51.4485, lng: 0.0495 }, walkTime: 20 },
  { id: 'prep-20', name: 'The Falcons School for Boys', type: 'prep_schools', coordinates: { lat: 51.4885, lng: -0.2385 }, walkTime: 14 },
  { id: 'prep-21', name: 'Falkner House', type: 'prep_schools', coordinates: { lat: 51.4915, lng: -0.1685 }, walkTime: 10 },
  { id: 'prep-22', name: 'Finton House School', type: 'prep_schools', coordinates: { lat: 51.4625, lng: -0.1705 }, walkTime: 15 },
  { id: 'prep-23', name: 'Forest School, Junior School & Pre-Preparatory School', type: 'prep_schools', coordinates: { lat: 51.5885, lng: 0.0135 }, walkTime: 22 },
  { id: 'prep-24', name: 'Garden House School', type: 'prep_schools', coordinates: { lat: 51.4885, lng: -0.1705 }, walkTime: 10 },
  { id: 'prep-25', name: 'Gatehouse School', type: 'prep_schools', coordinates: { lat: 51.5385, lng: -0.0385 }, walkTime: 14 },
  { id: 'prep-26', name: 'Glendower Preparatory School', type: 'prep_schools', coordinates: { lat: 51.4995, lng: -0.1785 }, walkTime: 11 },
  { id: 'prep-27', name: 'Grange Park Preparatory School', type: 'prep_schools', coordinates: { lat: 51.6185, lng: -0.1185 }, walkTime: 24 },
  { id: 'prep-28', name: 'Grimsdell, Mill Hill Pre-Preparatory School', type: 'prep_schools', coordinates: { lat: 51.6145, lng: -0.2305 }, walkTime: 22 },
  { id: 'prep-29', name: 'The Hall School, Hampstead', type: 'prep_schools', coordinates: { lat: 51.5565, lng: -0.1745 }, walkTime: 14 },
  { id: 'prep-30', name: 'Hall School Wimbledon Junior School', type: 'prep_schools', coordinates: { lat: 51.4215, lng: -0.2105 }, walkTime: 18 },
  { id: 'prep-31', name: 'Hampton Pre-Prep & Prep School', type: 'prep_schools', coordinates: { lat: 51.4195, lng: -0.3655 }, walkTime: 25 },
  { id: 'prep-32', name: 'The Harrodian School (8-13 years)', type: 'prep_schools', coordinates: { lat: 51.4755, lng: -0.2525 }, walkTime: 16 },
  { id: 'prep-33', name: 'Heathfield House School', type: 'prep_schools', coordinates: { lat: 51.4885, lng: -0.2435 }, walkTime: 15 },
  { id: 'prep-34', name: 'Hendon Preparatory School', type: 'prep_schools', coordinates: { lat: 51.5885, lng: -0.2195 }, walkTime: 20 },
  { id: 'prep-35', name: 'Hereward House School', type: 'prep_schools', coordinates: { lat: 51.5535, lng: -0.1765 }, walkTime: 14 },
  { id: 'prep-36', name: 'Highgate Junior School', type: 'prep_schools', coordinates: { lat: 51.5705, lng: -0.1535 }, walkTime: 16 },
  { id: 'prep-37', name: 'Holland House School', type: 'prep_schools', coordinates: { lat: 51.6135, lng: -0.2785 }, walkTime: 24 },
  { id: 'prep-37', name: 'Holy Cross Preparatory School', type: 'prep_schools', coordinates: { lat: 51.4085, lng: -0.3025 }, walkTime: 25 },
  { id: 'prep-38', name: 'James Allen\'s Girls\' School - Junior School', type: 'prep_schools', coordinates: { lat: 51.4455, lng: -0.0795 }, walkTime: 11 },
  { id: 'prep-39', name: 'John Lyon Middle School', type: 'prep_schools', coordinates: { lat: 51.5745, lng: -0.3425 }, walkTime: 28 },
  { id: 'prep-40', name: 'Kew College', type: 'prep_schools', coordinates: { lat: 51.4825, lng: -0.2895 }, walkTime: 19 },
  { id: 'prep-41', name: 'Kew Green Preparatory School', type: 'prep_schools', coordinates: { lat: 51.4835, lng: -0.2885 }, walkTime: 19 },
  { id: 'prep-42', name: 'King\'s College Junior School', type: 'prep_schools', coordinates: { lat: 51.4180, lng: -0.2085 }, walkTime: 18 },
  { id: 'prep-43', name: 'Knightsbridge School', type: 'prep_schools', coordinates: { lat: 51.4965, lng: -0.1615 }, walkTime: 9 },
  { id: 'prep-44', name: 'Lady Eleanor Holles Junior School', type: 'prep_schools', coordinates: { lat: 51.4125, lng: -0.3805 }, walkTime: 25 },
  { id: 'prep-45', name: 'Latymer Prep School', type: 'prep_schools', coordinates: { lat: 51.4925, lng: -0.2265 }, walkTime: 13 },
  { id: 'prep-46', name: 'L\'Ecole de Battersea', type: 'prep_schools', coordinates: { lat: 51.4725, lng: -0.1675 }, walkTime: 13 },
  { id: 'prep-47', name: 'Lionheart School', type: 'prep_schools', coordinates: { lat: 51.4515, lng: -0.1815 }, walkTime: 14 },
  { id: 'prep-48', name: 'Lochinver House School', type: 'prep_schools', coordinates: { lat: 51.6915, lng: -0.1785 }, walkTime: 31 },
  { id: 'prep-49', name: 'Lyndhurst House Preparatory School', type: 'prep_schools', coordinates: { lat: 51.5535, lng: -0.1755 }, walkTime: 14 },
  { id: 'prep-50', name: 'Maltman\'s Green School', type: 'prep_schools', coordinates: { lat: 51.5885, lng: -0.6425 }, walkTime: 48 },
  { id: 'prep-51', name: 'Manor Lodge School', type: 'prep_schools', coordinates: { lat: 51.6785, lng: -0.2385 }, walkTime: 30 },
  { id: 'prep-52', name: 'Merchant Taylors\' Prep School', type: 'prep_schools', coordinates: { lat: 51.6415, lng: -0.4785 }, walkTime: 38 },
  { id: 'prep-53', name: 'Merton Court Preparatory School', type: 'prep_schools', coordinates: { lat: 51.4315, lng: 0.1185 }, walkTime: 35 },
  { id: 'prep-54', name: 'Newton Preparatory School', type: 'prep_schools', coordinates: { lat: 51.4755, lng: -0.1585 }, walkTime: 13 },
  { id: 'prep-55', name: 'Norland Place School', type: 'prep_schools', coordinates: { lat: 51.5115, lng: -0.2025 }, walkTime: 12 },
  { id: 'prep-56', name: 'Norfolk House School', type: 'prep_schools', coordinates: { lat: 51.5885, lng: -0.1485 }, walkTime: 19 },
  { id: 'prep-57', name: 'North Bridge House Prep School', type: 'prep_schools', coordinates: { lat: 51.5385, lng: -0.1595 }, walkTime: 12 },
  { id: 'prep-58', name: 'Northcote Lodge', type: 'prep_schools', coordinates: { lat: 51.4615, lng: -0.1695 }, walkTime: 15 },
  { id: 'prep-59', name: 'Northwood College for Girls - Junior School', type: 'prep_schools', coordinates: { lat: 51.6075, lng: -0.4225 }, walkTime: 34 },
  { id: 'prep-60', name: 'Notting Hill & Ealing High School Junior School', type: 'prep_schools', coordinates: { lat: 51.5105, lng: -0.3075 }, walkTime: 19 },
  { id: 'prep-61', name: 'Oakfield Preparatory School', type: 'prep_schools', coordinates: { lat: 51.4435, lng: -0.0885 }, walkTime: 12 },
  { id: 'prep-62', name: 'Old Palace of John Whitgift School - Preparatory Wing', type: 'prep_schools', coordinates: { lat: 51.3705, lng: -0.0975 }, walkTime: 31 },
  { id: 'prep-63', name: 'Orley Farm School', type: 'prep_schools', coordinates: { lat: 51.5835, lng: -0.3225 }, walkTime: 26 },
  { id: 'prep-64', name: 'Palmers Green High School - Junior School', type: 'prep_schools', coordinates: { lat: 51.6175, lng: -0.1105 }, walkTime: 24 },
  { id: 'prep-65', name: 'Pembridge Hall School', type: 'prep_schools', coordinates: { lat: 51.5125, lng: -0.2035 }, walkTime: 12 },
  { id: 'prep-66', name: 'The Pointer School', type: 'prep_schools', coordinates: { lat: 51.4645, lng: -0.0085 }, walkTime: 18 },
  { id: 'prep-67', name: 'Portland Place School', type: 'prep_schools', coordinates: { lat: 51.5215, lng: -0.1435 }, walkTime: 9 },
  { id: 'prep-68', name: 'Queen\'s College Preparatory School', type: 'prep_schools', coordinates: { lat: 51.5185, lng: -0.1595 }, walkTime: 10 },
  { id: 'prep-69', name: 'Queen\'s Gate Junior School', type: 'prep_schools', coordinates: { lat: 51.4955, lng: -0.1835 }, walkTime: 11 },
  { id: 'prep-70', name: 'Radnor House, Twickenham - Prep School', type: 'prep_schools', coordinates: { lat: 51.4415, lng: -0.3325 }, walkTime: 26 },
  { id: 'prep-71', name: 'St. Anthony\'s School for Girls', type: 'prep_schools', coordinates: { lat: 51.5785, lng: -0.1985 }, walkTime: 17 },
  { id: 'prep-72', name: 'St. Augustine\'s Priory - Junior School', type: 'prep_schools', coordinates: { lat: 51.5155, lng: -0.3225 }, walkTime: 21 },
  { id: 'prep-73', name: 'St. Benedict\'s Junior School', type: 'prep_schools', coordinates: { lat: 51.5125, lng: -0.3095 }, walkTime: 19 },
  { id: 'prep-74', name: 'St. Christopher\'s School', type: 'prep_schools', coordinates: { lat: 51.5505, lng: -0.1765 }, walkTime: 14 },
  { id: 'prep-75', name: 'St. Dunstan\'s College Junior School', type: 'prep_schools', coordinates: { lat: 51.4305, lng: -0.0445 }, walkTime: 17 },
  { id: 'prep-76', name: 'St. Helen\'s College', type: 'prep_schools', coordinates: { lat: 51.4935, lng: -0.4485 }, walkTime: 37 },
  { id: 'prep-77', name: 'St. John\'s Beaumont School', type: 'prep_schools', coordinates: { lat: 51.4635, lng: -0.5985 }, walkTime: 47 },
  { id: 'prep-78', name: 'St. Margaret\'s School, Hampstead - Junior School', type: 'prep_schools', coordinates: { lat: 51.5505, lng: -0.1795 }, walkTime: 14 },
  { id: 'prep-79', name: 'St. Martin\'s School', type: 'prep_schools', coordinates: { lat: 51.6075, lng: -0.4245 }, walkTime: 34 },
  { id: 'prep-80', name: 'St. Paul\'s Cathedral School', type: 'prep_schools', coordinates: { lat: 51.5135, lng: -0.0995 }, walkTime: 8 },
  { id: 'prep-81', name: 'The Study Prep', type: 'prep_schools', coordinates: { lat: 51.4245, lng: -0.2075 }, walkTime: 14 },
  { id: 'prep-82', name: 'Surbiton High Boys\' Preparatory School', type: 'prep_schools', coordinates: { lat: 51.3925, lng: -0.3095 }, walkTime: 28 },
  { id: 'prep-83', name: 'Surbiton High Girls\' Preparatory School', type: 'prep_schools', coordinates: { lat: 51.3935, lng: -0.3085 }, walkTime: 28 },
  { id: 'prep-84', name: 'Sussex House School', type: 'prep_schools', coordinates: { lat: 51.4945, lng: -0.1685 }, walkTime: 10 },
  { id: 'prep-85', name: 'Sydenham High School - Junior School', type: 'prep_schools', coordinates: { lat: 51.4275, lng: -0.0595 }, walkTime: 16 },
  { id: 'prep-86', name: 'Thomas\'s Battersea', type: 'prep_schools', coordinates: { lat: 51.4745, lng: -0.1595 }, walkTime: 13 },
  { id: 'prep-87', name: 'Thomas\'s Clapham', type: 'prep_schools', coordinates: { lat: 51.4625, lng: -0.1395 }, walkTime: 14 },
  { id: 'prep-88', name: 'Twyford School', type: 'prep_schools', coordinates: { lat: 51.5115, lng: -0.3125 }, walkTime: 20 },
  { id: 'prep-89', name: 'Westminster Cathedral Choir School', type: 'prep_schools', coordinates: { lat: 51.4955, lng: -0.1395 }, walkTime: 8 },
  { id: 'prep-90', name: 'Wetherby Prep', type: 'prep_schools', coordinates: { lat: 51.5135, lng: -0.1755 }, walkTime: 11 },
  { id: 'prep-91', name: 'Wetherby School', type: 'prep_schools', coordinates: { lat: 51.5145, lng: -0.2055 }, walkTime: 12 },
  { id: 'prep-92', name: 'Willington School', type: 'prep_schools', coordinates: { lat: 51.4235, lng: -0.2105 }, walkTime: 18 },

  // Outstanding State Primary Schools (By Borough)
  // Barking and Dagenham
  { id: 'state-prim-1', name: 'Gascoigne Primary School', type: 'state_schools', coordinates: { lat: 51.5385, lng: 0.1085 }, walkTime: 28 },
  { id: 'state-prim-2', name: 'George Carey C of E Primary School', type: 'state_schools', coordinates: { lat: 51.5485, lng: 0.1185 }, walkTime: 29 },
  // Barnet
  { id: 'state-prim-3', name: 'Akiva School', type: 'state_schools', coordinates: { lat: 51.6085, lng: -0.2185 }, walkTime: 21 },
  { id: 'state-prim-4', name: 'Garden Suburb Infant School', type: 'state_schools', coordinates: { lat: 51.6015, lng: -0.1885 }, walkTime: 20 },
  { id: 'state-prim-5', name: 'Holly Park School', type: 'state_schools', coordinates: { lat: 51.5985, lng: -0.2285 }, walkTime: 21 },
  // Bexley
  { id: 'state-prim-6', name: 'Birkbeck Primary School', type: 'state_schools', coordinates: { lat: 51.4515, lng: 0.1485 }, walkTime: 37 },
  { id: 'state-prim-7', name: 'Danson Primary School', type: 'state_schools', coordinates: { lat: 51.4615, lng: 0.1385 }, walkTime: 36 },
  // Brent
  { id: 'state-prim-8', name: 'Ark Franklin Primary Academy', type: 'state_schools', coordinates: { lat: 51.5385, lng: -0.2685 }, walkTime: 17 },
  { id: 'state-prim-9', name: 'Gladstone Park Primary School', type: 'state_schools', coordinates: { lat: 51.5585, lng: -0.2285 }, walkTime: 16 },
  { id: 'state-prim-10', name: 'Sudbury Primary School', type: 'state_schools', coordinates: { lat: 51.5485, lng: -0.3185 }, walkTime: 21 },
  // Bromley
  { id: 'state-prim-11', name: 'Oak Lodge Primary School', type: 'state_schools', coordinates: { lat: 51.4015, lng: 0.0185 }, walkTime: 25 },
  { id: 'state-prim-12', name: 'Parish C of E Primary School', type: 'state_schools', coordinates: { lat: 51.3815, lng: 0.0385 }, walkTime: 27 },
  // Camden
  { id: 'state-prim-13', name: 'Christopher Hatton Primary School', type: 'state_schools', coordinates: { lat: 51.5285, lng: -0.1085 }, walkTime: 9 },
  { id: 'state-prim-14', name: 'Eleanor Palmer Primary School', type: 'state_schools', coordinates: { lat: 51.5485, lng: -0.1385 }, walkTime: 12 },
  { id: 'state-prim-15', name: 'Primrose Hill School', type: 'state_schools', coordinates: { lat: 51.5385, lng: -0.1585 }, walkTime: 12 },
  { id: 'state-prim-16', name: 'Torriano Primary School', type: 'state_schools', coordinates: { lat: 51.5485, lng: -0.1485 }, walkTime: 12 },
  // Croydon
  { id: 'state-prim-17', name: 'Heavers Farm Primary School', type: 'state_schools', coordinates: { lat: 51.3815, lng: -0.0985 }, walkTime: 31 },
  { id: 'state-prim-18', name: 'Harris Primary Academy Benson', type: 'state_schools', coordinates: { lat: 51.3915, lng: -0.0885 }, walkTime: 30 },
  // Ealing
  { id: 'state-prim-19', name: 'Ark Priory Primary Academy', type: 'state_schools', coordinates: { lat: 51.5115, lng: -0.3185 }, walkTime: 20 },
  { id: 'state-prim-20', name: 'Fielding Primary School', type: 'state_schools', coordinates: { lat: 51.5015, lng: -0.3085 }, walkTime: 19 },
  { id: 'state-prim-21', name: 'Little Ealing Primary School', type: 'state_schools', coordinates: { lat: 51.5115, lng: -0.3385 }, walkTime: 22 },
  { id: 'state-prim-22', name: 'North Ealing Primary School', type: 'state_schools', coordinates: { lat: 51.5215, lng: -0.2985 }, walkTime: 18 },
  // Greenwich
  { id: 'state-prim-23', name: 'Christ Church C of E Primary School', type: 'state_schools', coordinates: { lat: 51.4715, lng: 0.0085 }, walkTime: 18 },
  { id: 'state-prim-24', name: 'Eltham C of E Primary School', type: 'state_schools', coordinates: { lat: 51.4485, lng: 0.0585 }, walkTime: 21 },
  // Hackney
  { id: 'state-prim-25', name: 'Grazebrook Primary School', type: 'state_schools', coordinates: { lat: 51.5685, lng: -0.0785 }, walkTime: 14 },
  { id: 'state-prim-26', name: 'Jubilee Primary School', type: 'state_schools', coordinates: { lat: 51.5485, lng: -0.0685 }, walkTime: 13 },
  { id: 'state-prim-27', name: 'William Patten Primary School', type: 'state_schools', coordinates: { lat: 51.5585, lng: -0.0585 }, walkTime: 14 },
  // Hammersmith and Fulham
  { id: 'state-prim-28', name: 'All Saints C of E Primary School', type: 'state_schools', coordinates: { lat: 51.4915, lng: -0.2085 }, walkTime: 12 },
  { id: 'state-prim-29', name: 'Good Shepherd RC Primary School', type: 'state_schools', coordinates: { lat: 51.4815, lng: -0.2185 }, walkTime: 13 },
  // Haringey
  { id: 'state-prim-30', name: 'Campsbourne School', type: 'state_schools', coordinates: { lat: 51.5785, lng: -0.1085 }, walkTime: 16 },
  { id: 'state-prim-31', name: 'Coldfall Primary School', type: 'state_schools', coordinates: { lat: 51.5985, lng: -0.1385 }, walkTime: 19 },
  { id: 'state-prim-32', name: 'Highgate Primary School', type: 'state_schools', coordinates: { lat: 51.5685, lng: -0.1485 }, walkTime: 15 },
  { id: 'state-prim-33', name: 'Tetherdown Primary School', type: 'state_schools', coordinates: { lat: 51.5885, lng: -0.1285 }, walkTime: 17 },
  // Harrow
  { id: 'state-prim-34', name: 'Belmont School', type: 'state_schools', coordinates: { lat: 51.5985, lng: -0.3285 }, walkTime: 25 },
  { id: 'state-prim-35', name: 'Byron Court Primary School', type: 'state_schools', coordinates: { lat: 51.5685, lng: -0.3685 }, walkTime: 28 },
  { id: 'state-prim-36', name: 'Grimsdyke School', type: 'state_schools', coordinates: { lat: 51.6085, lng: -0.4085 }, walkTime: 33 },
  // Havering
  { id: 'state-prim-37', name: 'Gidea Park Primary School', type: 'state_schools', coordinates: { lat: 51.5885, lng: 0.2085 }, walkTime: 32 },
  { id: 'state-prim-38', name: 'Hacton Primary School', type: 'state_schools', coordinates: { lat: 51.5585, lng: 0.2185 }, walkTime: 33 },
  // Islington
  { id: 'state-prim-39', name: 'Ambler Primary School', type: 'state_schools', coordinates: { lat: 51.5585, lng: -0.0985 }, walkTime: 13 },
  { id: 'state-prim-40', name: 'William Tyndale Primary School', type: 'state_schools', coordinates: { lat: 51.5685, lng: -0.1185 }, walkTime: 14 },
  // Kensington and Chelsea
  { id: 'state-prim-41', name: 'Bousfield Primary School', type: 'state_schools', coordinates: { lat: 51.4985, lng: -0.1885 }, walkTime: 11 },
  { id: 'state-prim-42', name: 'Fox Primary School', type: 'state_schools', coordinates: { lat: 51.5115, lng: -0.1985 }, walkTime: 12 },
  { id: 'state-prim-43', name: 'Thomas Jones Primary School', type: 'state_schools', coordinates: { lat: 51.5085, lng: -0.2085 }, walkTime: 13 },
  // Kingston
  { id: 'state-prim-44', name: 'Coombe Hill Junior School', type: 'state_schools', coordinates: { lat: 51.4185, lng: -0.2885 }, walkTime: 22 },
  // Lambeth
  { id: 'state-prim-45', name: 'Bonneville Primary School', type: 'state_schools', coordinates: { lat: 51.4615, lng: -0.1185 }, walkTime: 11 },
  { id: 'state-prim-46', name: 'Clapham Manor Primary School', type: 'state_schools', coordinates: { lat: 51.4615, lng: -0.1385 }, walkTime: 13 },
  { id: 'state-prim-47', name: 'Henry Fawcett Primary School', type: 'state_schools', coordinates: { lat: 51.4815, lng: -0.1285 }, walkTime: 10 },
  { id: 'state-prim-48', name: 'Rosendale Primary School', type: 'state_schools', coordinates: { lat: 51.4515, lng: -0.0985 }, walkTime: 13 },
  { id: 'state-prim-49', name: 'Sudbourne Primary School', type: 'state_schools', coordinates: { lat: 51.4615, lng: -0.1085 }, walkTime: 12 },
  // Lewisham
  { id: 'state-prim-50', name: 'Fairlawn Primary School', type: 'state_schools', coordinates: { lat: 51.4415, lng: -0.0285 }, walkTime: 16 },
  { id: 'state-prim-51', name: 'Gordonbrock School', type: 'state_schools', coordinates: { lat: 51.4515, lng: -0.0185 }, walkTime: 17 },
  // Merton
  { id: 'state-prim-52', name: 'Dundonald Primary School', type: 'state_schools', coordinates: { lat: 51.4315, lng: -0.1985 }, walkTime: 16 },
  { id: 'state-prim-53', name: 'Wimbledon Chase Primary School', type: 'state_schools', coordinates: { lat: 51.4215, lng: -0.1985 }, walkTime: 17 },
  // Newham
  { id: 'state-prim-54', name: 'Curwen Primary School', type: 'state_schools', coordinates: { lat: 51.5385, lng: 0.0185 }, walkTime: 16 },
  { id: 'state-prim-55', name: 'Keir Hardie Primary School', type: 'state_schools', coordinates: { lat: 51.5285, lng: 0.0285 }, walkTime: 17 },
  { id: 'state-prim-56', name: 'Nelson Primary School', type: 'state_schools', coordinates: { lat: 51.5485, lng: 0.0385 }, walkTime: 18 },
  // Redbridge
  { id: 'state-prim-57', name: 'Avanti Court Primary School', type: 'state_schools', coordinates: { lat: 51.5685, lng: 0.0585 }, walkTime: 20 },
  { id: 'state-prim-58', name: 'Gordon Primary School', type: 'state_schools', coordinates: { lat: 51.5585, lng: 0.0485 }, walkTime: 19 },
  // Richmond
  { id: 'state-prim-59', name: 'The Russell Primary School', type: 'state_schools', coordinates: { lat: 51.4685, lng: -0.3085 }, walkTime: 20 },
  // Southwark
  { id: 'state-prim-60', name: 'Charles Dickens Primary School', type: 'state_schools', coordinates: { lat: 51.4915, lng: -0.0885 }, walkTime: 10 },
  { id: 'state-prim-61', name: 'Dog Kennel Hill School', type: 'state_schools', coordinates: { lat: 51.4615, lng: -0.0885 }, walkTime: 12 },
  { id: 'state-prim-62', name: 'Dulwich Hamlet Junior School', type: 'state_schools', coordinates: { lat: 51.4515, lng: -0.0785 }, walkTime: 12 },
  { id: 'state-prim-63', name: 'Goose Green Primary School', type: 'state_schools', coordinates: { lat: 51.4615, lng: -0.0985 }, walkTime: 12 },
  { id: 'state-prim-64', name: 'Heber Primary School', type: 'state_schools', coordinates: { lat: 51.4515, lng: -0.0885 }, walkTime: 12 },
  // Sutton
  { id: 'state-prim-65', name: 'Cheam Fields Primary Academy', type: 'state_schools', coordinates: { lat: 51.3615, lng: -0.2085 }, walkTime: 34 },
  { id: 'state-prim-66', name: 'Dorchester Primary School', type: 'state_schools', coordinates: { lat: 51.3715, lng: -0.1885 }, walkTime: 33 },
  // Tower Hamlets
  { id: 'state-prim-67', name: 'Bigland Green Primary School', type: 'state_schools', coordinates: { lat: 51.5185, lng: -0.0585 }, walkTime: 10 },
  { id: 'state-prim-68', name: 'Columbia Primary School', type: 'state_schools', coordinates: { lat: 51.5085, lng: -0.0385 }, walkTime: 11 },
  { id: 'state-prim-69', name: 'Globe Primary School', type: 'state_schools', coordinates: { lat: 51.5185, lng: -0.0485 }, walkTime: 10 },
  { id: 'state-prim-70', name: 'Virginia Primary School', type: 'state_schools', coordinates: { lat: 51.5085, lng: -0.0285 }, walkTime: 12 },
  // Waltham Forest
  { id: 'state-prim-71', name: 'Chingford C of E Primary School', type: 'state_schools', coordinates: { lat: 51.6185, lng: 0.0085 }, walkTime: 24 },
  { id: 'state-prim-72', name: 'Oakhill Primary School', type: 'state_schools', coordinates: { lat: 51.5885, lng: -0.0185 }, walkTime: 20 },
  // Wandsworth
  { id: 'state-prim-73', name: 'Belleville Primary School', type: 'state_schools', coordinates: { lat: 51.4615, lng: -0.1485 }, walkTime: 14 },
  { id: 'state-prim-74', name: 'Chesterton Primary School', type: 'state_schools', coordinates: { lat: 51.4715, lng: -0.1685 }, walkTime: 13 },
  { id: 'state-prim-75', name: 'Earlsfield Primary School', type: 'state_schools', coordinates: { lat: 51.4415, lng: -0.1885 }, walkTime: 15 },
  { id: 'state-prim-76', name: 'Furzedown Primary School', type: 'state_schools', coordinates: { lat: 51.4315, lng: -0.1785 }, walkTime: 16 },
  { id: 'state-prim-77', name: 'Honeywell Infant and Junior Schools', type: 'state_schools', coordinates: { lat: 51.4515, lng: -0.1685 }, walkTime: 14 },
  // Westminster
  { id: 'state-prim-78', name: 'Ark Atwood Primary Academy', type: 'state_schools', coordinates: { lat: 51.5215, lng: -0.1685 }, walkTime: 11 },
  { id: 'state-prim-79', name: 'Hallfield Primary School', type: 'state_schools', coordinates: { lat: 51.5185, lng: -0.1885 }, walkTime: 12 },
  { id: 'state-prim-80', name: 'Millbank Academy', type: 'state_schools', coordinates: { lat: 51.4915, lng: -0.1285 }, walkTime: 8 },

  // Outstanding State Secondary Schools (By Borough)
  // Barking and Dagenham
  { id: 'state-sec-1', name: 'Barking Abbey School', type: 'state_schools', coordinates: { lat: 51.5385, lng: 0.0985 }, walkTime: 27 },
  // Barnet
  { id: 'state-sec-2', name: 'Ashmole Academy', type: 'state_schools', coordinates: { lat: 51.6285, lng: -0.1885 }, walkTime: 24 },
  { id: 'state-sec-3', name: 'The Compton School', type: 'state_schools', coordinates: { lat: 51.6185, lng: -0.2185 }, walkTime: 22 },
  { id: 'state-sec-4', name: 'St James\' Catholic High School', type: 'state_schools', coordinates: { lat: 51.6385, lng: -0.2085 }, walkTime: 25 },
  // Brent
  { id: 'state-sec-5', name: 'Ark Academy', type: 'state_schools', coordinates: { lat: 51.5385, lng: -0.2385 }, walkTime: 15 },
  { id: 'state-sec-6', name: 'JFS', type: 'state_schools', coordinates: { lat: 51.6085, lng: -0.2685 }, walkTime: 24 },
  { id: 'state-sec-7', name: 'Michaela Community School', type: 'state_schools', coordinates: { lat: 51.5485, lng: -0.2585 }, walkTime: 16 },
  { id: 'state-sec-8', name: 'Preston Manor School', type: 'state_schools', coordinates: { lat: 51.5685, lng: -0.2985 }, walkTime: 18 },
  // Bromley
  { id: 'state-sec-9', name: 'Bullers Wood School for Girls', type: 'state_schools', coordinates: { lat: 51.3915, lng: 0.0085 }, walkTime: 26 },
  { id: 'state-sec-10', name: 'Harris Academy Beckenham', type: 'state_schools', coordinates: { lat: 51.4015, lng: -0.0285 }, walkTime: 25 },
  // Camden
  { id: 'state-sec-11', name: 'Camden School for Girls', type: 'state_schools', coordinates: { lat: 51.5485, lng: -0.1385 }, walkTime: 12 },
  { id: 'state-sec-12', name: 'UCL Academy', type: 'state_schools', coordinates: { lat: 51.5485, lng: -0.1285 }, walkTime: 12 },
  // Croydon
  { id: 'state-sec-13', name: 'Harris City Academy Crystal Palace', type: 'state_schools', coordinates: { lat: 51.4115, lng: -0.0785 }, walkTime: 22 },
  // Ealing
  { id: 'state-sec-14', name: 'Ada Lovelace C of E High School', type: 'state_schools', coordinates: { lat: 51.5185, lng: -0.3485 }, walkTime: 23 },
  { id: 'state-sec-15', name: 'The Cardinal Wiseman Catholic School', type: 'state_schools', coordinates: { lat: 51.5315, lng: -0.4085 }, walkTime: 27 },
  { id: 'state-sec-16', name: 'Twyford Church of England High School', type: 'state_schools', coordinates: { lat: 51.5115, lng: -0.3285 }, walkTime: 21 },
  // Enfield
  { id: 'state-sec-17', name: 'St Anne\'s Catholic High School for Girls', type: 'state_schools', coordinates: { lat: 51.6485, lng: -0.0585 }, walkTime: 26 },
  // Greenwich
  { id: 'state-sec-18', name: 'Thomas Tallis School', type: 'state_schools', coordinates: { lat: 51.4715, lng: 0.0185 }, walkTime: 19 },
  // Hackney
  { id: 'state-sec-19', name: 'Clapton Girls\' Academy', type: 'state_schools', coordinates: { lat: 51.5685, lng: -0.0585 }, walkTime: 14 },
  { id: 'state-sec-20', name: 'Mossbourne Community Academy', type: 'state_schools', coordinates: { lat: 51.5485, lng: -0.0485 }, walkTime: 13 },
  { id: 'state-sec-21', name: 'Stoke Newington School', type: 'state_schools', coordinates: { lat: 51.5685, lng: -0.0785 }, walkTime: 14 },
  // Hammersmith and Fulham
  { id: 'state-sec-22', name: 'Cardinal Vaughan Memorial RC School', type: 'state_schools', coordinates: { lat: 51.4985, lng: -0.1985 }, walkTime: 12 },
  { id: 'state-sec-23', name: 'Lady Margaret School', type: 'state_schools', coordinates: { lat: 51.4785, lng: -0.2085 }, walkTime: 13 },
  { id: 'state-sec-24', name: 'London Oratory School', type: 'state_schools', coordinates: { lat: 51.4815, lng: -0.2285 }, walkTime: 14 },
  { id: 'state-sec-25', name: 'Sacred Heart High School', type: 'state_schools', coordinates: { lat: 51.4915, lng: -0.2185 }, walkTime: 13 },
  // Haringey
  { id: 'state-sec-26', name: 'Alexandra Park School', type: 'state_schools', coordinates: { lat: 51.5885, lng: -0.1185 }, walkTime: 17 },
  { id: 'state-sec-27', name: 'Fortismere School', type: 'state_schools', coordinates: { lat: 51.5985, lng: -0.1385 }, walkTime: 19 },
  { id: 'state-sec-28', name: 'Hornsey School for Girls', type: 'state_schools', coordinates: { lat: 51.5885, lng: -0.1085 }, walkTime: 17 },
  // Harrow
  { id: 'state-sec-29', name: 'Bentley Wood High School', type: 'state_schools', coordinates: { lat: 51.6085, lng: -0.3585 }, walkTime: 27 },
  // Hillingdon
  { id: 'state-sec-30', name: 'Bishopshalt School', type: 'state_schools', coordinates: { lat: 51.5285, lng: -0.4685 }, walkTime: 38 },
  // Hounslow
  { id: 'state-sec-31', name: 'The Green School for Girls', type: 'state_schools', coordinates: { lat: 51.4685, lng: -0.3585 }, walkTime: 25 },
  { id: 'state-sec-32', name: 'Lampton School', type: 'state_schools', coordinates: { lat: 51.4785, lng: -0.3785 }, walkTime: 26 },
  // Islington
  { id: 'state-sec-33', name: 'Central Foundation Boys\' School', type: 'state_schools', coordinates: { lat: 51.5385, lng: -0.0885 }, walkTime: 11 },
  { id: 'state-sec-34', name: 'Elizabeth Garrett Anderson School', type: 'state_schools', coordinates: { lat: 51.5485, lng: -0.1185 }, walkTime: 12 },
  { id: 'state-sec-35', name: 'Highbury Fields School', type: 'state_schools', coordinates: { lat: 51.5485, lng: -0.0985 }, walkTime: 12 },
  // Kensington and Chelsea
  { id: 'state-sec-36', name: 'All Saints Catholic College', type: 'state_schools', coordinates: { lat: 51.5085, lng: -0.2285 }, walkTime: 14 },
  { id: 'state-sec-37', name: 'Chelsea Academy', type: 'state_schools', coordinates: { lat: 51.4815, lng: -0.1885 }, walkTime: 11 },
  { id: 'state-sec-38', name: 'Holland Park School', type: 'state_schools', coordinates: { lat: 51.5015, lng: -0.2085 }, walkTime: 13 },
  // Kingston
  { id: 'state-sec-39', name: 'Coombe Girls\' School', type: 'state_schools', coordinates: { lat: 51.4085, lng: -0.2685 }, walkTime: 21 },
  { id: 'state-sec-40', name: 'Richard Challoner School', type: 'state_schools', coordinates: { lat: 51.4085, lng: -0.2985 }, walkTime: 24 },
  // Lambeth
  { id: 'state-sec-41', name: 'Bishop Thomas Grant School', type: 'state_schools', coordinates: { lat: 51.4315, lng: -0.1185 }, walkTime: 13 },
  { id: 'state-sec-42', name: 'Dunraven School', type: 'state_schools', coordinates: { lat: 51.4315, lng: -0.1085 }, walkTime: 13 },
  { id: 'state-sec-43', name: 'Harris Academy Clapham', type: 'state_schools', coordinates: { lat: 51.4515, lng: -0.1285 }, walkTime: 12 },
  { id: 'state-sec-44', name: 'La Retraite RC Girls\' School', type: 'state_schools', coordinates: { lat: 51.4615, lng: -0.1385 }, walkTime: 14 },
  // Lewisham
  { id: 'state-sec-45', name: 'Haberdashers\' Aske\'s Hatcham College', type: 'state_schools', coordinates: { lat: 51.4715, lng: -0.0385 }, walkTime: 17 },
  { id: 'state-sec-46', name: 'Prendergast School', type: 'state_schools', coordinates: { lat: 51.4615, lng: -0.0185 }, walkTime: 17 },
  // Merton
  { id: 'state-sec-47', name: 'Ricards Lodge High School', type: 'state_schools', coordinates: { lat: 51.4115, lng: -0.1985 }, walkTime: 17 },
  { id: 'state-sec-48', name: 'Ursuline High School', type: 'state_schools', coordinates: { lat: 51.4215, lng: -0.2085 }, walkTime: 18 },
  { id: 'state-sec-49', name: 'Wimbledon College', type: 'state_schools', coordinates: { lat: 51.4285, lng: -0.2185 }, walkTime: 19 },
  // Newham
  { id: 'state-sec-50', name: 'Brampton Manor Academy', type: 'state_schools', coordinates: { lat: 51.5385, lng: 0.0085 }, walkTime: 16 },
  { id: 'state-sec-51', name: 'Forest Gate Community School', type: 'state_schools', coordinates: { lat: 51.5485, lng: 0.0185 }, walkTime: 17 },
  { id: 'state-sec-52', name: 'London Academy of Excellence', type: 'state_schools', coordinates: { lat: 51.5285, lng: 0.0385 }, walkTime: 18 },
  // Redbridge
  { id: 'state-sec-53', name: 'Chadwell Heath Academy', type: 'state_schools', coordinates: { lat: 51.5785, lng: 0.1285 }, walkTime: 26 },
  { id: 'state-sec-54', name: 'Valentines High School', type: 'state_schools', coordinates: { lat: 51.5685, lng: 0.0785 }, walkTime: 22 },
  // Richmond
  { id: 'state-sec-55', name: 'Orleans Park School', type: 'state_schools', coordinates: { lat: 51.4585, lng: -0.3285 }, walkTime: 23 },
  { id: 'state-sec-56', name: 'Waldegrave School', type: 'state_schools', coordinates: { lat: 51.4385, lng: -0.3385 }, walkTime: 26 },
  // Southwark
  { id: 'state-sec-57', name: 'Charter School North Dulwich', type: 'state_schools', coordinates: { lat: 51.4515, lng: -0.0885 }, walkTime: 12 },
  { id: 'state-sec-58', name: 'Harris Academy Bermondsey', type: 'state_schools', coordinates: { lat: 51.4915, lng: -0.0685 }, walkTime: 10 },
  { id: 'state-sec-59', name: 'Kingsdale Foundation School', type: 'state_schools', coordinates: { lat: 51.4415, lng: -0.0985 }, walkTime: 13 },
  { id: 'state-sec-60', name: 'Sacred Heart Catholic School', type: 'state_schools', coordinates: { lat: 51.4715, lng: -0.0885 }, walkTime: 11 },
  // Sutton
  { id: 'state-sec-61', name: 'Carshalton High School for Girls', type: 'state_schools', coordinates: { lat: 51.3615, lng: -0.1685 }, walkTime: 33 },
  { id: 'state-sec-62', name: 'Glenthorne High School', type: 'state_schools', coordinates: { lat: 51.3715, lng: -0.1585 }, walkTime: 33 },
  // Tower Hamlets
  { id: 'state-sec-63', name: 'Bishop Challoner Catholic Federation', type: 'state_schools', coordinates: { lat: 51.5285, lng: -0.0385 }, walkTime: 12 },
  { id: 'state-sec-64', name: 'Morpeth School', type: 'state_schools', coordinates: { lat: 51.5185, lng: -0.0285 }, walkTime: 12 },
  { id: 'state-sec-65', name: 'Mulberry School for Girls', type: 'state_schools', coordinates: { lat: 51.5185, lng: -0.0585 }, walkTime: 10 },
  // Waltham Forest
  { id: 'state-sec-66', name: 'Chingford Foundation School', type: 'state_schools', coordinates: { lat: 51.6185, lng: -0.0085 }, walkTime: 23 },
  { id: 'state-sec-67', name: 'Highams Park School', type: 'state_schools', coordinates: { lat: 51.6085, lng: -0.0185 }, walkTime: 22 },
  // Wandsworth
  { id: 'state-sec-68', name: 'Ashcroft Technology Academy', type: 'state_schools', coordinates: { lat: 51.4715, lng: -0.1785 }, walkTime: 13 },
  { id: 'state-sec-69', name: 'Graveney School', type: 'state_schools', coordinates: { lat: 51.4515, lng: -0.1685 }, walkTime: 14 },
  { id: 'state-sec-70', name: 'Harris Academy Battersea', type: 'state_schools', coordinates: { lat: 51.4715, lng: -0.1585 }, walkTime: 13 },
  { id: 'state-sec-71', name: 'Saint Cecilia\'s C of E School', type: 'state_schools', coordinates: { lat: 51.4615, lng: -0.1785 }, walkTime: 14 },
  // Westminster
  { id: 'state-sec-72', name: 'The Grey Coat Hospital', type: 'state_schools', coordinates: { lat: 51.4965, lng: -0.1325 }, walkTime: 9 },
  { id: 'state-sec-73', name: 'King Solomon Academy', type: 'state_schools', coordinates: { lat: 51.5285, lng: -0.1885 }, walkTime: 12 },
  { id: 'state-sec-74', name: 'St Marylebone CE School', type: 'state_schools', coordinates: { lat: 51.5235, lng: -0.1565 }, walkTime: 10 },
  { id: 'state-sec-75', name: 'Westminster City School', type: 'state_schools', coordinates: { lat: 51.4915, lng: -0.1385 }, walkTime: 9 },

  // Grammar Schools (London Boroughs - Co-educational, Boys, Girls)
  // Barnet
  { id: 'grammar-1', name: 'Queen Elizabeth\'s School', type: 'grammar_schools', coordinates: { lat: 51.5785, lng: -0.3365 }, walkTime: 28 },
  { id: 'grammar-2', name: 'St. Michael\'s Catholic Grammar School', type: 'grammar_schools', coordinates: { lat: 51.6285, lng: -0.2115 }, walkTime: 25 },
  { id: 'grammar-3', name: 'The Henrietta Barnett School', type: 'grammar_schools', coordinates: { lat: 51.6145, lng: -0.2025 }, walkTime: 22 },
  
  // Bexley
  { id: 'grammar-4', name: 'Beths Grammar School', type: 'grammar_schools', coordinates: { lat: 51.4415, lng: 0.1185 }, walkTime: 35 },
  { id: 'grammar-5', name: 'Bexley Grammar School', type: 'grammar_schools', coordinates: { lat: 51.4515, lng: 0.1385 }, walkTime: 37 },
  { id: 'grammar-6', name: 'Chislehurst and Sidcup Grammar School', type: 'grammar_schools', coordinates: { lat: 51.4245, lng: 0.1085 }, walkTime: 34 },
  { id: 'grammar-7', name: 'Townley Grammar School', type: 'grammar_schools', coordinates: { lat: 51.4415, lng: 0.1285 }, walkTime: 36 },
  
  // Bromley
  { id: 'grammar-8', name: 'Newstead Wood School', type: 'grammar_schools', coordinates: { lat: 51.4115, lng: 0.0985 }, walkTime: 33 },
  { id: 'grammar-9', name: 'St Olave\'s and St Saviour\'s Grammar School', type: 'grammar_schools', coordinates: { lat: 51.4245, lng: 0.1095 }, walkTime: 35 },
  
  // Enfield
  { id: 'grammar-10', name: 'The Latymer School', type: 'grammar_schools', coordinates: { lat: 51.6535, lng: -0.0685 }, walkTime: 27 },
  
  // Kingston upon Thames
  { id: 'grammar-11', name: 'Tiffin School', type: 'grammar_schools', coordinates: { lat: 51.4105, lng: -0.3035 }, walkTime: 25 },
  { id: 'grammar-12', name: 'The Tiffin Girls\' School', type: 'grammar_schools', coordinates: { lat: 51.4095, lng: -0.3025 }, walkTime: 25 },
  
  // Redbridge
  { id: 'grammar-13', name: 'Ilford County High School', type: 'grammar_schools', coordinates: { lat: 51.5615, lng: 0.0685 }, walkTime: 22 },
  { id: 'grammar-14', name: 'Woodford County High School', type: 'grammar_schools', coordinates: { lat: 51.6015, lng: 0.0285 }, walkTime: 24 },
  
  // Sutton
  { id: 'grammar-15', name: 'Greenshaw High School', type: 'grammar_schools', coordinates: { lat: 51.3515, lng: -0.1685 }, walkTime: 34 },
  { id: 'grammar-16', name: 'Nonsuch High School for Girls', type: 'grammar_schools', coordinates: { lat: 51.3575, lng: -0.2305 }, walkTime: 35 },
  { id: 'grammar-17', name: 'Sutton Grammar School', type: 'grammar_schools', coordinates: { lat: 51.3615, lng: -0.1925 }, walkTime: 33 },
  { id: 'grammar-18', name: 'Wallington County Grammar School', type: 'grammar_schools', coordinates: { lat: 51.3615, lng: -0.1485 }, walkTime: 32 },
  { id: 'grammar-19', name: 'Wallington High School for Girls', type: 'grammar_schools', coordinates: { lat: 51.3645, lng: -0.1425 }, walkTime: 32 },
  { id: 'grammar-20', name: 'Wilson\'s School', type: 'grammar_schools', coordinates: { lat: 51.3925, lng: -0.2885 }, walkTime: 28 },

  // Universities
  // World-Leading, Research-Intensive Universities (Russell Group)
  { id: 'uni-1', name: 'Imperial College London', type: 'universities', coordinates: { lat: 51.4988, lng: -0.1749 }, walkTime: 11, description: 'A world top-ten university specialising in science, engineering, medicine, and business' },
  { id: 'uni-2', name: 'University College London (UCL)', type: 'universities', coordinates: { lat: 51.5246, lng: -0.1340 }, walkTime: 8, description: 'Consistently ranked among the world\'s best, a huge, multi-disciplinary university known for excellence across a vast range of subjects' },
  { id: 'uni-3', name: 'London School of Economics and Political Science (LSE)', type: 'universities', coordinates: { lat: 51.5145, lng: -0.1167 }, walkTime: 7, description: 'A world-leading specialist university focused on social sciences, economics, politics, law, and international relations' },
  { id: 'uni-4', name: 'King\'s College London (KCL)', type: 'universities', coordinates: { lat: 51.5115, lng: -0.1160 }, walkTime: 6, description: 'A large, highly-regarded university with a strong reputation in the humanities, law, sciences, and particularly health sciences' },
  { id: 'uni-5', name: 'Queen Mary University of London (QMUL)', type: 'universities', coordinates: { lat: 51.5242, lng: -0.0402 }, walkTime: 16, description: 'A leading research university based in East London, with notable strengths in medicine, dentistry, law, and engineering' },
  
  // The University of London Federation
  { id: 'uni-6', name: 'SOAS University of London', type: 'universities', coordinates: { lat: 51.5226, lng: -0.1297 }, walkTime: 7, description: 'The world\'s leading institution for the study of Asia, Africa, and the Middle East' },
  { id: 'uni-7', name: 'Birkbeck, University of London', type: 'universities', coordinates: { lat: 51.5218, lng: -0.1308 }, walkTime: 7, description: 'A specialist provider of evening higher education, allowing students to study while working' },
  { id: 'uni-8', name: 'City, University of London', type: 'universities', coordinates: { lat: 51.5277, lng: -0.1026 }, walkTime: 8, description: 'Known for its strong links to business and the professions, particularly through its Bayes Business School and City Law School' },
  { id: 'uni-9', name: 'Goldsmiths, University of London', type: 'universities', coordinates: { lat: 51.4743, lng: -0.0351 }, walkTime: 20, description: 'Famous for its creative and innovative approach to the arts, humanities, and social sciences' },
  { id: 'uni-10', name: 'Royal Holloway, University of London', type: 'universities', coordinates: { lat: 51.4256, lng: -0.5641 }, walkTime: 45, description: 'Located just outside central London in Egham, known for its beautiful campus and strong arts and sciences departments' },
  
  // Other Major London Universities
  { id: 'uni-11', name: 'Brunel University London', type: 'universities', coordinates: { lat: 51.5328, lng: -0.4735 }, walkTime: 40, description: 'A campus-based university in West London with a strong reputation for engineering, technology, and health sciences' },
  { id: 'uni-12', name: 'University of the Arts London (UAL)', type: 'universities', coordinates: { lat: 51.5167, lng: -0.1167 }, walkTime: 7, description: 'A world-leading university for art, design, fashion, and communication, composed of six renowned colleges' },
  { id: 'uni-13', name: 'University of Westminster', type: 'universities', coordinates: { lat: 51.5185, lng: -0.1400 }, walkTime: 8, description: 'Known for its strong vocational focus, particularly in media, art and design, and business, with several campuses across central London' },
  { id: 'uni-14', name: 'University of Greenwich', type: 'universities', coordinates: { lat: 51.4826, lng: 0.0077 }, walkTime: 22, description: 'A large university with historic campuses in Greenwich and Avery Hill, offering a wide range of subjects' },
  { id: 'uni-15', name: 'Kingston University', type: 'universities', coordinates: { lat: 51.4105, lng: -0.3004 }, walkTime: 25, description: 'A popular university in South West London, particularly well-regarded for art, design, and fashion' },
  { id: 'uni-16', name: 'Middlesex University', type: 'universities', coordinates: { lat: 51.5891, lng: -0.2283 }, walkTime: 22, description: 'A large, modern university in North London with a diverse student body and a focus on professional skills' },
  { id: 'uni-17', name: 'London South Bank University (LSBU)', type: 'universities', coordinates: { lat: 51.4991, lng: -0.1031 }, walkTime: 7, description: 'A modern university with a strong focus on vocational skills and employability' },
  { id: 'uni-18', name: 'University of East London (UEL)', type: 'universities', coordinates: { lat: 51.5078, lng: 0.0606 }, walkTime: 18, description: 'Known for its focus on social mobility and a diverse range of courses' },
  { id: 'uni-19', name: 'University of Roehampton', type: 'universities', coordinates: { lat: 51.4563, lng: -0.2483 }, walkTime: 18, description: 'A campus-based university in South West London with strengths in education, humanities, and social sciences' },
  
  // Specialist Institutions
  { id: 'uni-20', name: 'London Business School', type: 'universities', coordinates: { lat: 51.5229, lng: -0.1581 }, walkTime: 10, description: 'A world-leading graduate business school' },
  { id: 'uni-21', name: 'Royal College of Music (RCM)', type: 'universities', coordinates: { lat: 51.4993, lng: -0.1774 }, walkTime: 11, description: 'A world-class conservatoire for music' },
  { id: 'uni-22', name: 'Royal Academy of Music (RAM)', type: 'universities', coordinates: { lat: 51.5238, lng: -0.1570 }, walkTime: 10, description: 'Another world-leading music conservatoire' },
  { id: 'uni-23', name: 'Royal Academy of Dramatic Art (RADA)', type: 'universities', coordinates: { lat: 51.5247, lng: -0.1301 }, walkTime: 7, description: 'One of the most famous and prestigious drama schools in the world' },
  { id: 'uni-24', name: 'London Academy of Music and Dramatic Art (LAMDA)', type: 'universities', coordinates: { lat: 51.5195, lng: -0.1895 }, walkTime: 11, description: 'A leading drama and performing arts school' },
  { id: 'uni-25', name: 'The Courtauld Institute of Art', type: 'universities', coordinates: { lat: 51.5115, lng: -0.1167 }, walkTime: 7, description: 'One of the world\'s foremost institutions for studying art history' },
  { id: 'uni-26', name: 'St George\'s, University of London', type: 'universities', coordinates: { lat: 51.4272, lng: -0.1741 }, walkTime: 18, description: 'A specialist medical and health sciences university' },

  // Michelin Star Restaurants (Three Stars)
  { id: 'michelin-1', name: 'Alain Ducasse at The Dorchester', type: 'michelin_restaurants', coordinates: { lat: 51.5075, lng: -0.1515 }, walkTime: 9 },
  { id: 'michelin-2', name: 'CORE by Clare Smyth', type: 'michelin_restaurants', coordinates: { lat: 51.5095, lng: -0.2045 }, walkTime: 12 },
  { id: 'michelin-3', name: 'Hélène Darroze at The Connaught', type: 'michelin_restaurants', coordinates: { lat: 51.5115, lng: -0.1485 }, walkTime: 9 },
  { id: 'michelin-4', name: 'The Ledbury', type: 'michelin_restaurants', coordinates: { lat: 51.5095, lng: -0.2055 }, walkTime: 12 },
  { id: 'michelin-5', name: 'Restaurant Gordon Ramsay', type: 'michelin_restaurants', coordinates: { lat: 51.4875, lng: -0.1695 }, walkTime: 10 },
  { id: 'michelin-6', name: 'Sketch (The Lecture Room & Library)', type: 'michelin_restaurants', coordinates: { lat: 51.5145, lng: -0.1415 }, walkTime: 8 },
  { id: 'michelin-7', name: 'Ikoyi', type: 'michelin_restaurants', coordinates: { lat: 51.5115, lng: -0.1275 }, walkTime: 7 },
  { id: 'michelin-8', name: 'Restaurant Story', type: 'michelin_restaurants', coordinates: { lat: 51.5035, lng: -0.0785 }, walkTime: 10 },
  
  // Michelin Star Restaurants (Two Stars)
  { id: 'michelin-9', name: 'A. Wong', type: 'michelin_restaurants', coordinates: { lat: 51.4945, lng: -0.1305 }, walkTime: 7 },
  { id: 'michelin-10', name: 'Alex Dilling at Hotel Café Royal', type: 'michelin_restaurants', coordinates: { lat: 51.5095, lng: -0.1385 }, walkTime: 8 },
  { id: 'michelin-11', name: 'Brooklands by Claude Bosi', type: 'michelin_restaurants', coordinates: { lat: 51.5165, lng: -0.1785 }, walkTime: 11 },
  { id: 'michelin-12', name: 'The Clove Club', type: 'michelin_restaurants', coordinates: { lat: 51.5245, lng: -0.0775 }, walkTime: 10 },
  { id: 'michelin-13', name: 'Da Terra', type: 'michelin_restaurants', coordinates: { lat: 51.4655, lng: -0.1305 }, walkTime: 14 },
  { id: 'michelin-14', name: 'Dinner by Heston Blumenthal', type: 'michelin_restaurants', coordinates: { lat: 51.5005, lng: -0.1585 }, walkTime: 9 },
  { id: 'michelin-15', name: 'Gymkhana', type: 'michelin_restaurants', coordinates: { lat: 51.5105, lng: -0.1435 }, walkTime: 8 },
  { id: 'michelin-16', name: 'Kitchen Table', type: 'michelin_restaurants', coordinates: { lat: 51.5215, lng: -0.1305 }, walkTime: 8 },
  { id: 'michelin-17', name: 'La Dame de Pic London', type: 'michelin_restaurants', coordinates: { lat: 51.5085, lng: -0.1355 }, walkTime: 8 },
  { id: 'michelin-18', name: 'The Ritz Restaurant', type: 'michelin_restaurants', coordinates: { lat: 51.5075, lng: -0.1425 }, walkTime: 8 },
  { id: 'michelin-19', name: 'Trivet', type: 'michelin_restaurants', coordinates: { lat: 51.5025, lng: -0.0895 }, walkTime: 8 },
  { id: 'michelin-20', name: 'Claude Bosi at Bibendum', type: 'michelin_restaurants', coordinates: { lat: 51.4935, lng: -0.1735 }, walkTime: 10 },
  { id: 'michelin-21', name: 'Humble Chicken', type: 'michelin_restaurants', coordinates: { lat: 51.5125, lng: -0.1365 }, walkTime: 8 },
  
  // Michelin Star Restaurants (One Star - New 2025)
  { id: 'michelin-22', name: '1890 by Gordon Ramsay', type: 'michelin_restaurants', coordinates: { lat: 51.5105, lng: -0.1205 }, walkTime: 7 },
  { id: 'michelin-23', name: 'Dorian', type: 'michelin_restaurants', coordinates: { lat: 51.5185, lng: -0.1445 }, walkTime: 9 },
  { id: 'michelin-24', name: 'Humo', type: 'michelin_restaurants', coordinates: { lat: 51.5135, lng: -0.1395 }, walkTime: 8 },
  { id: 'michelin-25', name: 'Mountain', type: 'michelin_restaurants', coordinates: { lat: 51.5245, lng: -0.0825 }, walkTime: 10 },
  { id: 'michelin-26', name: 'Pavyllon London', type: 'michelin_restaurants', coordinates: { lat: 51.5095, lng: -0.1445 }, walkTime: 8 },
  { id: 'michelin-27', name: 'Sushi Kanesaka', type: 'michelin_restaurants', coordinates: { lat: 51.5115, lng: -0.1465 }, walkTime: 9 },
  { id: 'michelin-28', name: 'The Pem', type: 'michelin_restaurants', coordinates: { lat: 51.5015, lng: -0.1335 }, walkTime: 8 },
  { id: 'michelin-29', name: 'Akoko', type: 'michelin_restaurants', coordinates: { lat: 51.5185, lng: -0.1525 }, walkTime: 10 },
  { id: 'michelin-30', name: 'Chishuru', type: 'michelin_restaurants', coordinates: { lat: 51.5155, lng: -0.1575 }, walkTime: 10 },
  
  // Michelin Star Restaurants (One Star - Retained)
  { id: 'michelin-31', name: 'Amaya', type: 'michelin_restaurants', coordinates: { lat: 51.4985, lng: -0.1605 }, walkTime: 9 },
  { id: 'michelin-32', name: 'Angler', type: 'michelin_restaurants', coordinates: { lat: 51.5235, lng: -0.0965 }, walkTime: 8 },
  { id: 'michelin-33', name: 'Behind', type: 'michelin_restaurants', coordinates: { lat: 51.5265, lng: -0.0855 }, walkTime: 9 },
  { id: 'michelin-34', name: 'Benares', type: 'michelin_restaurants', coordinates: { lat: 51.5105, lng: -0.1445 }, walkTime: 8 },
  { id: 'michelin-35', name: 'Brat', type: 'michelin_restaurants', coordinates: { lat: 51.5245, lng: -0.0795 }, walkTime: 10 },
  { id: 'michelin-36', name: 'Caractère', type: 'michelin_restaurants', coordinates: { lat: 51.5165, lng: -0.2045 }, walkTime: 12 },
  { id: 'michelin-37', name: 'Casa Fofō', type: 'michelin_restaurants', coordinates: { lat: 51.5275, lng: -0.0875 }, walkTime: 9 },
  { id: 'michelin-38', name: 'Chez Bruce', type: 'michelin_restaurants', coordinates: { lat: 51.4645, lng: -0.1685 }, walkTime: 15 },
  { id: 'michelin-39', name: 'City Social', type: 'michelin_restaurants', coordinates: { lat: 51.5185, lng: -0.0815 }, walkTime: 8 },
  { id: 'michelin-40', name: 'Club Gascon', type: 'michelin_restaurants', coordinates: { lat: 51.5185, lng: -0.0995 }, walkTime: 7 },
  { id: 'michelin-41', name: 'Cycene', type: 'michelin_restaurants', coordinates: { lat: 51.5245, lng: -0.0805 }, walkTime: 10 },
  { id: 'michelin-42', name: 'The Dining Room at The Goring', type: 'michelin_restaurants', coordinates: { lat: 51.4985, lng: -0.1445 }, walkTime: 8 },
  { id: 'michelin-43', name: 'Dysart Petersham', type: 'michelin_restaurants', coordinates: { lat: 51.4515, lng: -0.3015 }, walkTime: 25 },
  { id: 'michelin-44', name: 'Elystan Street', type: 'michelin_restaurants', coordinates: { lat: 51.4895, lng: -0.1705 }, walkTime: 10 },
  { id: 'michelin-45', name: 'Endo at the Rotunda', type: 'michelin_restaurants', coordinates: { lat: 51.4985, lng: -0.2325 }, walkTime: 14 },
  { id: 'michelin-46', name: "Evelyn's Table", type: 'michelin_restaurants', coordinates: { lat: 51.5115, lng: -0.1385 }, walkTime: 8 },
  { id: 'michelin-47', name: 'The Five Fields', type: 'michelin_restaurants', coordinates: { lat: 51.4895, lng: -0.1585 }, walkTime: 9 },
  { id: 'michelin-48', name: 'Frog by Adam Handling', type: 'michelin_restaurants', coordinates: { lat: 51.5155, lng: -0.1285 }, walkTime: 8 },
  { id: 'michelin-49', name: 'Galvin La Chapelle', type: 'michelin_restaurants', coordinates: { lat: 51.5165, lng: -0.0725 }, walkTime: 10 },
  { id: 'michelin-50', name: 'The Harwood Arms', type: 'michelin_restaurants', coordinates: { lat: 51.4855, lng: -0.2095 }, walkTime: 13 },
  { id: 'michelin-51', name: 'HIDE', type: 'michelin_restaurants', coordinates: { lat: 51.5095, lng: -0.1485 }, walkTime: 9 },
  { id: 'michelin-52', name: 'Jamavar', type: 'michelin_restaurants', coordinates: { lat: 51.5115, lng: -0.1495 }, walkTime: 9 },
  { id: 'michelin-53', name: 'Kai', type: 'michelin_restaurants', coordinates: { lat: 51.5085, lng: -0.1505 }, walkTime: 9 },
  { id: 'michelin-54', name: 'Kitchen W8', type: 'michelin_restaurants', coordinates: { lat: 51.4995, lng: -0.1965 }, walkTime: 12 },
  { id: 'michelin-55', name: 'KOL', type: 'michelin_restaurants', coordinates: { lat: 51.5185, lng: -0.1525 }, walkTime: 10 },
  { id: 'michelin-56', name: 'La Trompette', type: 'michelin_restaurants', coordinates: { lat: 51.4915, lng: -0.2545 }, walkTime: 16 },
  { id: 'michelin-57', name: "Lyle's", type: 'michelin_restaurants', coordinates: { lat: 51.5235, lng: -0.0755 }, walkTime: 10 },
  { id: 'michelin-58', name: 'Luca', type: 'michelin_restaurants', coordinates: { lat: 51.5245, lng: -0.0885 }, walkTime: 9 },
  { id: 'michelin-59', name: 'Murano', type: 'michelin_restaurants', coordinates: { lat: 51.5095, lng: -0.1455 }, walkTime: 8 },
  { id: 'michelin-60', name: 'Muse by Tom Aikens', type: 'michelin_restaurants', coordinates: { lat: 51.4935, lng: -0.1615 }, walkTime: 9 },
  { id: 'michelin-61', name: 'The Ninth', type: 'michelin_restaurants', coordinates: { lat: 51.5235, lng: -0.1365 }, walkTime: 8 },
  { id: 'michelin-62', name: 'Ormer Mayfair', type: 'michelin_restaurants', coordinates: { lat: 51.5085, lng: -0.1435 }, walkTime: 8 },
  { id: 'michelin-63', name: 'Pétrus by Gordon Ramsay', type: 'michelin_restaurants', coordinates: { lat: 51.4985, lng: -0.1515 }, walkTime: 9 },
  { id: 'michelin-64', name: 'Pied à Terre', type: 'michelin_restaurants', coordinates: { lat: 51.5225, lng: -0.1365 }, walkTime: 8 },
  { id: 'michelin-65', name: 'Pollen Street Social', type: 'michelin_restaurants', coordinates: { lat: 51.5115, lng: -0.1425 }, walkTime: 8 },
  { id: 'michelin-66', name: 'Portland', type: 'michelin_restaurants', coordinates: { lat: 51.5185, lng: -0.1445 }, walkTime: 9 },
  { id: 'michelin-67', name: 'Quilon', type: 'michelin_restaurants', coordinates: { lat: 51.4965, lng: -0.1385 }, walkTime: 8 },
  { id: 'michelin-68', name: 'The River Café', type: 'michelin_restaurants', coordinates: { lat: 51.4875, lng: -0.2255 }, walkTime: 14 },
  { id: 'michelin-69', name: 'Sabor', type: 'michelin_restaurants', coordinates: { lat: 51.5105, lng: -0.1415 }, walkTime: 8 },
  { id: 'michelin-70', name: 'Seven Park Place', type: 'michelin_restaurants', coordinates: { lat: 51.5055, lng: -0.1385 }, walkTime: 8 },
  { id: 'michelin-71', name: 'SO|LA', type: 'michelin_restaurants', coordinates: { lat: 51.5115, lng: -0.1455 }, walkTime: 8 },
  { id: 'michelin-72', name: 'Sollip', type: 'michelin_restaurants', coordinates: { lat: 51.4865, lng: -0.1645 }, walkTime: 10 },
  { id: 'michelin-73', name: 'St. JOHN', type: 'michelin_restaurants', coordinates: { lat: 51.5245, lng: -0.1015 }, walkTime: 8 },
  { id: 'michelin-74', name: 'Taku', type: 'michelin_restaurants', coordinates: { lat: 51.5095, lng: -0.1475 }, walkTime: 9 },
  { id: 'michelin-75', name: 'Trinity', type: 'michelin_restaurants', coordinates: { lat: 51.4645, lng: -0.1655 }, walkTime: 15 },
  { id: 'michelin-76', name: 'Trishna', type: 'michelin_restaurants', coordinates: { lat: 51.5185, lng: -0.1535 }, walkTime: 10 },
  { id: 'michelin-77', name: 'Umu', type: 'michelin_restaurants', coordinates: { lat: 51.5095, lng: -0.1435 }, walkTime: 8 },
  { id: 'michelin-78', name: 'Veeraswamy', type: 'michelin_restaurants', coordinates: { lat: 51.5095, lng: -0.1325 }, walkTime: 7 },
  { id: 'michelin-79', name: 'Wild Honey St James', type: 'michelin_restaurants', coordinates: { lat: 51.5075, lng: -0.1365 }, walkTime: 8 },

  // Culture & Landmarks (Comprehensive London Attractions)
  
  // Royal Palaces & Historic Royal Sites
  { id: 'culture-1', name: 'Buckingham Palace', type: 'culture_landmarks', coordinates: { lat: 51.5014, lng: -0.1419 }, walkTime: 8, description: "The Queen's official London residence" },
  { id: 'culture-2', name: 'Tower of London', type: 'culture_landmarks', coordinates: { lat: 51.5081, lng: -0.0759 }, walkTime: 9, description: 'Historic castle and home to the Crown Jewels' },
  { id: 'culture-3', name: 'Kensington Palace', type: 'culture_landmarks', coordinates: { lat: 51.5055, lng: -0.1877 }, walkTime: 12, description: 'Royal residence and birthplace of Queen Victoria' },
  { id: 'culture-4', name: 'Hampton Court Palace', type: 'culture_landmarks', coordinates: { lat: 51.4034, lng: -0.3379 }, walkTime: 26, description: "King Henry VIII's grand Tudor palace" },
  { id: 'culture-5', name: 'Banqueting House', type: 'culture_landmarks', coordinates: { lat: 51.5041, lng: -0.1261 }, walkTime: 7, description: 'Survivor of the Palace of Whitehall fire, with a Rubens ceiling' },
  { id: 'culture-6', name: 'St. James\'s Palace', type: 'culture_landmarks', coordinates: { lat: 51.5045, lng: -0.1387 }, walkTime: 8, description: 'The most senior royal palace in the UK' },
  
  // Government & Law
  { id: 'culture-7', name: 'Houses of Parliament', type: 'culture_landmarks', coordinates: { lat: 51.4995, lng: -0.1248 }, walkTime: 7, description: 'The seat of the UK Parliament' },
  { id: 'culture-8', name: 'Elizabeth Tower (Big Ben)', type: 'culture_landmarks', coordinates: { lat: 51.5007, lng: -0.1246 }, walkTime: 7, description: 'The iconic clock tower' },
  { id: 'culture-9', name: '10 Downing Street', type: 'culture_landmarks', coordinates: { lat: 51.5034, lng: -0.1276 }, walkTime: 7, description: "The Prime Minister's residence" },
  { id: 'culture-10', name: 'Royal Courts of Justice', type: 'culture_landmarks', coordinates: { lat: 51.5133, lng: -0.1131 }, walkTime: 6, description: 'The High Court and Court of Appeal of England and Wales' },
  { id: 'culture-11', name: 'The Old Bailey', type: 'culture_landmarks', coordinates: { lat: 51.5153, lng: -0.1024 }, walkTime: 7, description: "England's principal criminal court" },
  { id: 'culture-12', name: 'City Hall', type: 'culture_landmarks', coordinates: { lat: 51.5053, lng: -0.0787 }, walkTime: 9, description: 'The home of the Greater London Authority' },
  { id: 'culture-13', name: 'The Supreme Court', type: 'culture_landmarks', coordinates: { lat: 51.5064, lng: -0.1278 }, walkTime: 7, description: 'The final court of appeal in the UK' },
  
  // Churches, Cathedrals & Abbeys
  { id: 'culture-14', name: 'Westminster Abbey', type: 'culture_landmarks', coordinates: { lat: 51.4993, lng: -0.1273 }, walkTime: 7, description: 'Royal church, coronation site, and burial place of monarchs' },
  { id: 'culture-15', name: 'St. Paul\'s Cathedral', type: 'culture_landmarks', coordinates: { lat: 51.5138, lng: -0.0984 }, walkTime: 7, description: "Sir Christopher Wren's masterpiece with its iconic dome" },
  { id: 'culture-16', name: 'Southwark Cathedral', type: 'culture_landmarks', coordinates: { lat: 51.5062, lng: -0.0905 }, walkTime: 8, description: "London's oldest Gothic church" },
  { id: 'culture-17', name: 'St Martin-in-the-Fields', type: 'culture_landmarks', coordinates: { lat: 51.5089, lng: -0.1263 }, walkTime: 6, description: 'Famous church and classical music venue on Trafalgar Square' },
  { id: 'culture-18', name: 'Temple Church', type: 'culture_landmarks', coordinates: { lat: 51.5125, lng: -0.1101 }, walkTime: 6, description: 'Historic round church of the Knights Templar' },
  { id: 'culture-19', name: 'Westminster Cathedral', type: 'culture_landmarks', coordinates: { lat: 51.4956, lng: -0.1395 }, walkTime: 8, description: 'The mother church of the Catholic Church in England and Wales' },
  { id: 'culture-20', name: 'Brompton Oratory', type: 'culture_landmarks', coordinates: { lat: 51.4947, lng: -0.1669 }, walkTime: 10, description: 'Large Neo-classical Roman Catholic church' },
  { id: 'culture-21', name: 'Neasden Temple', type: 'culture_landmarks', coordinates: { lat: 51.5611, lng: -0.2595 }, walkTime: 17, description: 'Intricately carved Hindu temple' },
  
  // Museums
  { id: 'culture-22', name: 'British Museum', type: 'culture_landmarks', coordinates: { lat: 51.5194, lng: -0.1270 }, walkTime: 7, description: 'World-famous museum of human history and culture' },
  { id: 'culture-23', name: 'Natural History Museum', type: 'culture_landmarks', coordinates: { lat: 51.4967, lng: -0.1764 }, walkTime: 11, description: 'Home to life and earth science specimens' },
  { id: 'culture-24', name: 'Victoria and Albert Museum', type: 'culture_landmarks', coordinates: { lat: 51.4966, lng: -0.1722 }, walkTime: 10, description: "The world's leading museum of art, design, and performance" },
  { id: 'culture-25', name: 'Science Museum', type: 'culture_landmarks', coordinates: { lat: 51.4978, lng: -0.1746 }, walkTime: 11, description: 'Museum dedicated to science and technology' },
  { id: 'culture-26', name: 'Tate Modern', type: 'culture_landmarks', coordinates: { lat: 51.5076, lng: -0.0994 }, walkTime: 7, description: "Britain's national gallery of international modern art" },
  { id: 'culture-27', name: 'Tate Britain', type: 'culture_landmarks', coordinates: { lat: 51.4910, lng: -0.1278 }, walkTime: 8, description: 'Home of British art from 1500 to the present day' },
  { id: 'culture-28', name: 'National Gallery', type: 'culture_landmarks', coordinates: { lat: 51.5089, lng: -0.1283 }, walkTime: 6, description: 'Houses a collection of over 2,300 paintings from the mid-13th century' },
  { id: 'culture-29', name: 'Imperial War Museum', type: 'culture_landmarks', coordinates: { lat: 51.4960, lng: -0.1087 }, walkTime: 9, description: 'Museum of modern warfare and conflict' },
  { id: 'culture-30', name: 'National Maritime Museum', type: 'culture_landmarks', coordinates: { lat: 51.4808, lng: -0.0057 }, walkTime: 18, description: 'The leading maritime museum of the UK' },
  { id: 'culture-31', name: 'Churchill War Rooms', type: 'culture_landmarks', coordinates: { lat: 51.5022, lng: -0.1293 }, walkTime: 7, description: 'Historic underground complex that housed a British government command centre during WWII' },
  { id: 'culture-32', name: 'Museum of London', type: 'culture_landmarks', coordinates: { lat: 51.5177, lng: -0.0968 }, walkTime: 8, description: 'Documents the history of London from prehistoric to modern times' },
  { id: 'culture-33', name: 'Sir John Soane\'s Museum', type: 'culture_landmarks', coordinates: { lat: 51.5172, lng: -0.1174 }, walkTime: 6, description: 'Historic house, museum, and library of neo-classical architect Sir John Soane' },
  { id: 'culture-34', name: 'Wallace Collection', type: 'culture_landmarks', coordinates: { lat: 51.5176, lng: -0.1535 }, walkTime: 10, description: 'National museum in a historic townhouse with a world-class art collection' },
  { id: 'culture-35', name: 'Design Museum', type: 'culture_landmarks', coordinates: { lat: 51.4995, lng: -0.2029 }, walkTime: 12, description: 'Museum devoted to contemporary design' },
  { id: 'culture-36', name: 'London Transport Museum', type: 'culture_landmarks', coordinates: { lat: 51.5120, lng: -0.1212 }, walkTime: 6, description: 'Explores the story of London and its transport system' },
  { id: 'culture-37', name: 'National Portrait Gallery', type: 'culture_landmarks', coordinates: { lat: 51.5095, lng: -0.1284 }, walkTime: 6, description: 'Houses portraits of historically important and famous British people' },
  { id: 'culture-38', name: 'British Library', type: 'culture_landmarks', coordinates: { lat: 51.5298, lng: -0.1270 }, walkTime: 9, description: 'The national library of the United Kingdom' },
  { id: 'culture-39', name: 'Wellcome Collection', type: 'culture_landmarks', coordinates: { lat: 51.5259, lng: -0.1338 }, walkTime: 9, description: 'A museum exploring health and the human experience' },
  { id: 'culture-40', name: 'Sherlock Holmes Museum', type: 'culture_landmarks', coordinates: { lat: 51.5238, lng: -0.1586 }, walkTime: 10, description: 'Museum dedicated to the famous fictional detective at 221B Baker Street' },
  { id: 'culture-41', name: 'Charles Dickens Museum', type: 'culture_landmarks', coordinates: { lat: 51.5249, lng: -0.1178 }, walkTime: 8, description: "Author's former London home" },
  
  // Iconic Buildings & Structures
  { id: 'culture-42', name: 'The Shard', type: 'culture_landmarks', coordinates: { lat: 51.5045, lng: -0.0865 }, walkTime: 8, description: "London's tallest building with viewing platforms" },
  { id: 'culture-43', name: 'The Gherkin', type: 'culture_landmarks', coordinates: { lat: 51.5144, lng: -0.0803 }, walkTime: 9, description: 'Distinctive contemporary skyscraper' },
  { id: 'culture-44', name: 'The Walkie-Talkie', type: 'culture_landmarks', coordinates: { lat: 51.5112, lng: -0.0833 }, walkTime: 9, description: 'Skyscraper with the Sky Garden at its top' },
  { id: 'culture-45', name: 'Leadenhall Market', type: 'culture_landmarks', coordinates: { lat: 51.5129, lng: -0.0828 }, walkTime: 9, description: 'Ornate Victorian covered market' },
  { id: 'culture-46', name: 'Lloyd\'s Building', type: 'culture_landmarks', coordinates: { lat: 51.5132, lng: -0.0813 }, walkTime: 9, description: 'Innovative "inside-out" architectural design' },
  { id: 'culture-47', name: 'St Pancras Station', type: 'culture_landmarks', coordinates: { lat: 51.5308, lng: -0.1263 }, walkTime: 9, description: 'Victorian Gothic railway station and hotel' },
  { id: 'culture-48', name: 'King\'s Cross Station', type: 'culture_landmarks', coordinates: { lat: 51.5309, lng: -0.1238 }, walkTime: 9, description: 'Famous for its modern concourse and Platform 9¾' },
  { id: 'culture-49', name: 'Battersea Power Station', type: 'culture_landmarks', coordinates: { lat: 51.4817, lng: -0.1447 }, walkTime: 12, description: 'Iconic Art Deco former power station, now a retail and leisure complex' },
  { id: 'culture-50', name: 'Barbican Centre', type: 'culture_landmarks', coordinates: { lat: 51.5200, lng: -0.0936 }, walkTime: 8, description: 'Brutalist performing arts centre and estate' },
  { id: 'culture-51', name: 'Tower Bridge', type: 'culture_landmarks', coordinates: { lat: 51.5055, lng: -0.0754 }, walkTime: 9, description: 'Famous Victorian bascule and suspension bridge' },
  { id: 'culture-52', name: 'Millennium Bridge', type: 'culture_landmarks', coordinates: { lat: 51.5096, lng: -0.0987 }, walkTime: 7, description: 'Steel suspension bridge for pedestrians' },
  { id: 'culture-53', name: 'Westminster Bridge', type: 'culture_landmarks', coordinates: { lat: 51.5007, lng: -0.1219 }, walkTime: 7, description: 'Provides classic views of the Houses of Parliament' },
  { id: 'culture-54', name: 'London Eye', type: 'culture_landmarks', coordinates: { lat: 51.5033, lng: -0.1195 }, walkTime: 7, description: 'Cantilevered observation wheel on the South Bank' },
  { id: 'culture-55', name: 'Somerset House', type: 'culture_landmarks', coordinates: { lat: 51.5111, lng: -0.1172 }, walkTime: 6, description: 'Large Neoclassical building with a central courtyard hosting events' },
  
  // Parks, Gardens & Open Spaces
  { id: 'culture-56', name: 'Hyde Park', type: 'culture_landmarks', coordinates: { lat: 51.5074, lng: -0.1657 }, walkTime: 10, description: "One of London's largest Royal Parks" },
  { id: 'culture-57', name: 'Regent\'s Park', type: 'culture_landmarks', coordinates: { lat: 51.5311, lng: -0.1571 }, walkTime: 11, description: 'Royal Park with gardens and London Zoo' },
  { id: 'culture-58', name: 'St. James\'s Park', type: 'culture_landmarks', coordinates: { lat: 51.5033, lng: -0.1347 }, walkTime: 8, description: 'Park with a lake and views of Buckingham Palace' },
  { id: 'culture-59', name: 'Kew Gardens', type: 'culture_landmarks', coordinates: { lat: 51.4777, lng: -0.2929 }, walkTime: 19, description: 'World-famous botanical gardens' },
  { id: 'culture-60', name: 'Richmond Park', type: 'culture_landmarks', coordinates: { lat: 51.4509, lng: -0.2856 }, walkTime: 22, description: 'The largest Royal Park, known for its deer' },
  { id: 'culture-61', name: 'Greenwich Park', type: 'culture_landmarks', coordinates: { lat: 51.4769, lng: 0.0005 }, walkTime: 18, description: 'Royal Park with incredible views over London' },
  { id: 'culture-62', name: 'Hampstead Heath', type: 'culture_landmarks', coordinates: { lat: 51.5570, lng: -0.1582 }, walkTime: 14, description: 'Large, ancient heath with swimming ponds' },
  { id: 'culture-63', name: 'Holland Park', type: 'culture_landmarks', coordinates: { lat: 51.5026, lng: -0.2030 }, walkTime: 12, description: 'Park with the Kyoto Garden' },
  
  // Squares & Famous Streets
  { id: 'culture-64', name: 'Trafalgar Square', type: 'culture_landmarks', coordinates: { lat: 51.5080, lng: -0.1280 }, walkTime: 6, description: "Public square with Nelson's Column and fountains" },
  { id: 'culture-65', name: 'Piccadilly Circus', type: 'culture_landmarks', coordinates: { lat: 51.5101, lng: -0.1340 }, walkTime: 7, description: 'Famous for its video display and neon signs' },
  { id: 'culture-66', name: 'Leicester Square', type: 'culture_landmarks', coordinates: { lat: 51.5103, lng: -0.1301 }, walkTime: 7, description: "The heart of London's cinema land" },
  { id: 'culture-67', name: 'Covent Garden Piazza', type: 'culture_landmarks', coordinates: { lat: 51.5120, lng: -0.1225 }, walkTime: 6, description: 'Shopping and entertainment hub' },
  { id: 'culture-68', name: 'Abbey Road', type: 'culture_landmarks', coordinates: { lat: 51.5319, lng: -0.1776 }, walkTime: 12, description: "Famous for the Beatles' album cover and zebra crossing" },
  { id: 'culture-69', name: 'Carnaby Street', type: 'culture_landmarks', coordinates: { lat: 51.5135, lng: -0.1398 }, walkTime: 8, description: 'Iconic shopping street of 1960s "Swinging London"' },
  { id: 'culture-70', name: 'The Mall', type: 'culture_landmarks', coordinates: { lat: 51.5045, lng: -0.1363 }, walkTime: 8, description: 'Ceremonial route leading to Buckingham Palace' },
  { id: 'culture-71', name: 'Brick Lane', type: 'culture_landmarks', coordinates: { lat: 51.5219, lng: -0.0714 }, walkTime: 10, description: 'Known for its curry houses, street art, and markets' },
  { id: 'culture-72', name: 'Portobello Road', type: 'culture_landmarks', coordinates: { lat: 51.5171, lng: -0.2058 }, walkTime: 13, description: 'Famous for its antiques market' },
  
  // Monuments & Statues
  { id: 'culture-73', name: 'Nelson\'s Column', type: 'culture_landmarks', coordinates: { lat: 51.5080, lng: -0.1280 }, walkTime: 6, description: 'Monument in Trafalgar Square' },
  { id: 'culture-74', name: 'Wellington Arch', type: 'culture_landmarks', coordinates: { lat: 51.5025, lng: -0.1515 }, walkTime: 9, description: 'Triumphal arch at Hyde Park Corner' },
  { id: 'culture-75', name: 'Marble Arch', type: 'culture_landmarks', coordinates: { lat: 51.5131, lng: -0.1589 }, walkTime: 10, description: '19th-century white marble triumphal arch' },
  { id: 'culture-76', name: 'The Cenotaph', type: 'culture_landmarks', coordinates: { lat: 51.5033, lng: -0.1268 }, walkTime: 7, description: "The UK's primary national war memorial" },
  { id: 'culture-77', name: 'Victoria Memorial', type: 'culture_landmarks', coordinates: { lat: 51.5015, lng: -0.1408 }, walkTime: 8, description: 'Large monument to Queen Victoria outside Buckingham Palace' },
  { id: 'culture-78', name: 'Albert Memorial', type: 'culture_landmarks', coordinates: { lat: 51.5028, lng: -0.1774 }, walkTime: 11, description: 'Ornate monument to Prince Albert in Kensington Gardens' },
  { id: 'culture-79', name: 'The Monument', type: 'culture_landmarks', coordinates: { lat: 51.5102, lng: -0.0859 }, walkTime: 9, description: 'Doric column commemorating the Great Fire of London' },
  { id: 'culture-80', name: 'Cleopatra\'s Needle', type: 'culture_landmarks', coordinates: { lat: 51.5087, lng: -0.1203 }, walkTime: 6, description: 'Ancient Egyptian obelisk on the Victoria Embankment' },
  
  // Theatres & Performance Venues
  { id: 'culture-81', name: 'Shakespeare\'s Globe', type: 'culture_landmarks', coordinates: { lat: 51.5081, lng: -0.0972 }, walkTime: 7, description: 'Reconstruction of the original Globe Theatre' },
  { id: 'culture-82', name: 'Royal Opera House', type: 'culture_landmarks', coordinates: { lat: 51.5129, lng: -0.1220 }, walkTime: 6, description: 'Major performing arts venue in Covent Garden' },
  { id: 'culture-83', name: 'Royal Albert Hall', type: 'culture_landmarks', coordinates: { lat: 51.5009, lng: -0.1773 }, walkTime: 11, description: 'Iconic concert hall in South Kensington' },
  { id: 'culture-84', name: 'The Old Vic', type: 'culture_landmarks', coordinates: { lat: 51.5013, lng: -0.1087 }, walkTime: 8, description: 'Historic theatre near Waterloo Station' },
  { id: 'culture-85', name: 'Sadler\'s Wells', type: 'culture_landmarks', coordinates: { lat: 51.5292, lng: -0.1063 }, walkTime: 10, description: 'World-leading dance venue' },
  { id: 'culture-86', name: 'National Theatre', type: 'culture_landmarks', coordinates: { lat: 51.5068, lng: -0.1136 }, walkTime: 7, description: 'Major publicly funded performing arts venue on the South Bank' },
  { id: 'culture-87', name: 'London Palladium', type: 'culture_landmarks', coordinates: { lat: 51.5148, lng: -0.1405 }, walkTime: 8, description: 'World-famous variety theatre' },
  { id: 'culture-88', name: 'Theatre Royal, Drury Lane', type: 'culture_landmarks', coordinates: { lat: 51.5132, lng: -0.1208 }, walkTime: 6, description: 'The oldest theatre site in London in continuous use' },
  { id: 'culture-89', name: 'Ronnie Scott\'s Jazz Club', type: 'culture_landmarks', coordinates: { lat: 51.5132, lng: -0.1319 }, walkTime: 7, description: 'Famous jazz club in Soho' },
  { id: 'culture-90', name: 'Wigmore Hall', type: 'culture_landmarks', coordinates: { lat: 51.5178, lng: -0.1493 }, walkTime: 9, description: 'Leading international recital venue' },
  
  // Markets
  { id: 'culture-91', name: 'Borough Market', type: 'culture_landmarks', coordinates: { lat: 51.5055, lng: -0.0910 }, walkTime: 8, description: "London's most renowned food market" },
  { id: 'culture-92', name: 'Camden Market', type: 'culture_landmarks', coordinates: { lat: 51.5415, lng: -0.1467 }, walkTime: 12, description: 'Famous for its alternative fashion and diverse stalls' },
  { id: 'culture-93', name: 'Portobello Market', type: 'culture_landmarks', coordinates: { lat: 51.5171, lng: -0.2058 }, walkTime: 13, description: "World's largest antiques market" },
  { id: 'culture-94', name: 'Covent Garden Market', type: 'culture_landmarks', coordinates: { lat: 51.5120, lng: -0.1225 }, walkTime: 6, description: 'Historic market building with shops and stalls' },
  { id: 'culture-95', name: 'Greenwich Market', type: 'culture_landmarks', coordinates: { lat: 51.4816, lng: -0.0098 }, walkTime: 18, description: 'Covered market with arts, crafts, and food' },
  { id: 'culture-96', name: 'Old Spitalfields Market', type: 'culture_landmarks', coordinates: { lat: 51.5197, lng: -0.0747 }, walkTime: 10, description: 'Covered market with fashion, food, and art' },
  { id: 'culture-97', name: 'Columbia Road Flower Market', type: 'culture_landmarks', coordinates: { lat: 51.5305, lng: -0.0688 }, walkTime: 11, description: 'Vibrant street market open on Sundays' },
  
  // Maritime, Science & Education
  { id: 'culture-98', name: 'Cutty Sark', type: 'culture_landmarks', coordinates: { lat: 51.4826, lng: -0.0096 }, walkTime: 18, description: 'Historic sailing ship in Greenwich' },
  { id: 'culture-99', name: 'HMS Belfast', type: 'culture_landmarks', coordinates: { lat: 51.5065, lng: -0.0814 }, walkTime: 9, description: 'Museum ship, formerly a Royal Navy light cruiser' },
  { id: 'culture-100', name: 'Royal Observatory Greenwich', type: 'culture_landmarks', coordinates: { lat: 51.4769, lng: -0.0005 }, walkTime: 18, description: 'Location of the Prime Meridian Line' },
  { id: 'culture-101', name: 'London Zoo', type: 'culture_landmarks', coordinates: { lat: 51.5353, lng: -0.1536 }, walkTime: 12, description: "The world's oldest scientific zoo" },
  { id: 'culture-102', name: 'Sea Life London Aquarium', type: 'culture_landmarks', coordinates: { lat: 51.5014, lng: -0.1195 }, walkTime: 7, description: 'On the South Bank' },
  { id: 'culture-103', name: 'Royal Academy of Arts', type: 'culture_landmarks', coordinates: { lat: 51.5095, lng: -0.1394 }, walkTime: 8, description: 'Art institution based in Burlington House' },
  
  // Other Notable Landmarks
  { id: 'culture-104', name: 'Chinatown', type: 'culture_landmarks', coordinates: { lat: 51.5113, lng: -0.1309 }, walkTime: 7, description: 'Area with Chinese restaurants, shops, and gates' },
  { id: 'culture-105', name: 'Little Venice', type: 'culture_landmarks', coordinates: { lat: 51.5230, lng: -0.1835 }, walkTime: 12, description: 'Picturesque canal area in Maida Vale' },
  { id: 'culture-106', name: 'Highgate Cemetery', type: 'culture_landmarks', coordinates: { lat: 51.5671, lng: -0.1461 }, walkTime: 15, description: 'Historic cemetery and nature reserve, burial place of Karl Marx' },
  { id: 'culture-107', name: 'Harrods', type: 'culture_landmarks', coordinates: { lat: 51.4994, lng: -0.1632 }, walkTime: 10, description: 'World-famous luxury department store' },
  { id: 'culture-108', name: 'Fortnum & Mason', type: 'culture_landmarks', coordinates: { lat: 51.5076, lng: -0.1377 }, walkTime: 8, description: 'Upscale department store in Piccadilly' },
  { id: 'culture-109', name: 'Wimbledon', type: 'culture_landmarks', coordinates: { lat: 51.4342, lng: -0.2141 }, walkTime: 18, description: 'Home of the Wimbledon Championships' },
  { id: 'culture-110', name: 'Lord\'s Cricket Ground', type: 'culture_landmarks', coordinates: { lat: 51.5295, lng: -0.1728 }, walkTime: 12, description: 'The "Home of Cricket"' },
  { id: 'culture-111', name: 'Wembley Stadium', type: 'culture_landmarks', coordinates: { lat: 51.5560, lng: -0.2795 }, walkTime: 18, description: 'National football stadium' },
  { id: 'culture-112', name: 'Canary Wharf', type: 'culture_landmarks', coordinates: { lat: 51.5051, lng: -0.0193 }, walkTime: 13, description: 'Major business district with modern skyscrapers' },
  { id: 'culture-113', name: 'Wilton\'s Music Hall', type: 'culture_landmarks', coordinates: { lat: 51.5131, lng: -0.0616 }, walkTime: 10, description: "The world's oldest surviving grand music hall" },

  // Shopping & Lifestyle
  // Iconic Department Stores
  { id: 'shopping-1', name: 'Harrods', type: 'shopping_lifestyle', coordinates: { lat: 51.4994, lng: -0.1632 }, walkTime: 10, description: 'World-famous for its luxury brands, magnificent food halls, and opulent decor in Knightsbridge' },
  { id: 'shopping-2', name: 'Selfridges & Co.', type: 'shopping_lifestyle', coordinates: { lat: 51.5145, lng: -0.1527 }, walkTime: 10, description: "A huge, trend-setting store on Oxford Street, known for its creative window displays and vast beauty hall" },
  { id: 'shopping-3', name: 'Liberty London', type: 'shopping_lifestyle', coordinates: { lat: 51.5141, lng: -0.1399 }, walkTime: 8, description: "Instantly recognizable for its Tudor-revival building, famous for its own fabric prints, designer goods, and unique gifts" },
  { id: 'shopping-4', name: 'Fortnum & Mason', type: 'shopping_lifestyle', coordinates: { lat: 51.5076, lng: -0.1373 }, walkTime: 8, description: 'An upscale department store in Piccadilly since 1707, renowned for its luxury food hampers, teas, and preserves' },
  { id: 'shopping-5', name: 'John Lewis & Partners', type: 'shopping_lifestyle', coordinates: { lat: 51.5154, lng: -0.1419 }, walkTime: 9, description: 'A hugely popular, employee-owned store on Oxford Street, known for its wide range of quality home goods, fashion, and electronics' },
  { id: 'shopping-6', name: 'Harvey Nichols', type: 'shopping_lifestyle', coordinates: { lat: 51.4992, lng: -0.1608 }, walkTime: 10, description: 'A chic and high-fashion department store in Knightsbridge, offering a curated selection of designer brands' },
  
  // Major Shopping Centres
  { id: 'shopping-7', name: 'Westfield London (Shepherd\'s Bush)', type: 'shopping_lifestyle', coordinates: { lat: 51.5074, lng: -0.2211 }, walkTime: 14, description: 'A massive shopping centre with a dedicated luxury wing ("The Village"), a huge range of high-street stores, a cinema, and numerous restaurants' },
  { id: 'shopping-8', name: 'Westfield Stratford City', type: 'shopping_lifestyle', coordinates: { lat: 51.5431, lng: -0.0063 }, walkTime: 18, description: "Located next to the Olympic Park, this is one of Europe's largest urban shopping centres, with hundreds of shops and leisure facilities" },
  { id: 'shopping-9', name: 'Brent Cross', type: 'shopping_lifestyle', coordinates: { lat: 51.5765, lng: -0.2232 }, walkTime: 20, description: "The UK's first standalone shopping mall, located in North London, with a wide range of popular high-street brands" },
  { id: 'shopping-10', name: 'Battersea Power Station', type: 'shopping_lifestyle', coordinates: { lat: 51.4818, lng: -0.1453 }, walkTime: 12, description: 'A recently redeveloped iconic landmark now home to a wide array of shops, restaurants, and entertainment venues within its historic turbine halls' },
  { id: 'shopping-11', name: 'Canary Wharf Shopping Centre', type: 'shopping_lifestyle', coordinates: { lat: 51.5051, lng: -0.0193 }, walkTime: 13, description: 'A modern, largely underground shopping mall with a mix of high-end and high-street stores, popular with city workers' },
  { id: 'shopping-12', name: 'ICON Outlet at The O2', type: 'shopping_lifestyle', coordinates: { lat: 51.5030, lng: 0.0030 }, walkTime: 16, description: 'An outlet shopping centre in Greenwich, offering discounts on well-known brands' },
  
  // Famous Shopping Streets & Areas
  { id: 'shopping-13', name: 'Oxford Street', type: 'shopping_lifestyle', coordinates: { lat: 51.5154, lng: -0.1419 }, walkTime: 9, description: "Europe's busiest shopping street, famous for its flagship high-street brands like Zara, H&M, and Primark, as well as major department stores" },
  { id: 'shopping-14', name: 'Regent Street', type: 'shopping_lifestyle', coordinates: { lat: 51.5117, lng: -0.1373 }, walkTime: 8, description: 'An elegant, curved street connecting Oxford Circus to Piccadilly Circus, home to flagship stores like Apple and Hamleys' },
  { id: 'shopping-15', name: 'Bond Street (New & Old)', type: 'shopping_lifestyle', coordinates: { lat: 51.5134, lng: -0.1448 }, walkTime: 9, description: "The go-to destination for pure luxury, with flagship stores of the world's most prestigious designers, such as Chanel, Dior, and Tiffany & Co." },
  { id: 'shopping-16', name: 'Carnaby Street', type: 'shopping_lifestyle', coordinates: { lat: 51.5133, lng: -0.1389 }, walkTime: 8, description: 'The birthplace of "Swinging London" in the 1960s, now known for its independent boutiques, quirky brands, and vibrant atmosphere' },
  { id: 'shopping-17', name: 'Covent Garden', type: 'shopping_lifestyle', coordinates: { lat: 51.5118, lng: -0.1226 }, walkTime: 6, description: 'A lively area with a beautiful central market, numerous boutiques, craft stalls, street performers, and restaurants' },
  { id: 'shopping-18', name: 'King\'s Road', type: 'shopping_lifestyle', coordinates: { lat: 51.4877, lng: -0.1688 }, walkTime: 10, description: 'A famous street in Chelsea known for its chic boutiques, interior design shops, and fashionable vibe' },
  { id: 'shopping-19', name: 'Savile Row', type: 'shopping_lifestyle', coordinates: { lat: 51.5106, lng: -0.1413 }, walkTime: 8, description: "The world's most famous destination for men's bespoke tailoring" },
  
  // Specialist Markets
  { id: 'shopping-20', name: 'Portobello Road Market', type: 'shopping_lifestyle', coordinates: { lat: 51.5163, lng: -0.2060 }, walkTime: 13, description: 'Famous for its antiques on Saturdays, but also offers fashion, food, and bric-a-brac throughout the week in Notting Hill' },
  { id: 'shopping-21', name: 'Camden Market', type: 'shopping_lifestyle', coordinates: { lat: 51.5415, lng: -0.1460 }, walkTime: 12, description: 'A collection of markets known for alternative fashion, unique crafts, street food, and a rebellious, creative energy' },
  { id: 'shopping-22', name: 'Borough Market', type: 'shopping_lifestyle', coordinates: { lat: 51.5055, lng: -0.0910 }, walkTime: 7, description: "A food lover's paradise near London Bridge, offering exceptional British and international produce, artisanal foods, and delicious street food" },
  { id: 'shopping-23', name: 'Old Spitalfields Market', type: 'shopping_lifestyle', coordinates: { lat: 51.5199, lng: -0.0761 }, walkTime: 8, description: 'A covered market in East London that blends high-end brands with independent stalls, art, and food trucks' },
  { id: 'shopping-24', name: 'Columbia Road Flower Market', type: 'shopping_lifestyle', coordinates: { lat: 51.5311, lng: -0.0683 }, walkTime: 10, description: 'A vibrant and fragrant market in East London, packed with plants and flowers every Sunday' },

  // Hospitals & Clinics
  { id: 'hospital-1', name: 'Barnet Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.6515, lng: -0.2015 }, walkTime: 26 },
  { id: 'hospital-2', name: 'Blackheath Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.4665, lng: 0.0015 }, walkTime: 18 },
  { id: 'hospital-3', name: 'Bupa Cromwell Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.4965, lng: -0.1925 }, walkTime: 11 },
  { id: 'hospital-4', name: 'Central Middlesex Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5385, lng: -0.2585 }, walkTime: 17 },
  { id: 'hospital-5', name: 'Charing Cross Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.4875, lng: -0.2195 }, walkTime: 13 },
  { id: 'hospital-6', name: 'Chase Farm Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.6545, lng: -0.1135 }, walkTime: 28 },
  { id: 'hospital-7', name: 'Cleveland Clinic London', type: 'hospitals_clinics', coordinates: { lat: 51.5045, lng: -0.1455 }, walkTime: 9 },
  { id: 'hospital-8', name: 'Croydon University Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.3755, lng: -0.0985 }, walkTime: 31 },
  { id: 'hospital-9', name: 'Ealing Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5245, lng: -0.3385 }, walkTime: 21 },
  { id: 'hospital-10', name: 'Eastman Dental Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5235, lng: -0.1275 }, walkTime: 8 },
  { id: 'hospital-11', name: 'Evelina London Children\'s Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5015, lng: -0.1185 }, walkTime: 7 },
  { id: 'hospital-12', name: 'Finchley Memorial Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5935, lng: -0.1825 }, walkTime: 20 },
  { id: 'hospital-13', name: 'Great Ormond Street Hospital (GOSH)', type: 'hospitals_clinics', coordinates: { lat: 51.5215, lng: -0.1205 }, walkTime: 7 },
  { id: 'hospital-14', name: 'Guy\'s Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5035, lng: -0.0875 }, walkTime: 8 },
  { id: 'hospital-15', name: 'Hammersmith Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5185, lng: -0.2265 }, walkTime: 14 },
  { id: 'hospital-16', name: 'Harley Street Clinic', type: 'hospitals_clinics', coordinates: { lat: 51.5211, lng: -0.1489 }, walkTime: 10 },
  { id: 'hospital-17', name: 'HCA Healthcare UK', type: 'hospitals_clinics', coordinates: { lat: 51.5195, lng: -0.1475 }, walkTime: 10 },
  { id: 'hospital-18', name: 'Hillingdon Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5325, lng: -0.4635 }, walkTime: 38 },
  { id: 'hospital-19', name: 'Homerton University Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5525, lng: -0.0425 }, walkTime: 16 },
  { id: 'hospital-20', name: 'Hospital of St John & St Elizabeth', type: 'hospitals_clinics', coordinates: { lat: 51.5345, lng: -0.1705 }, walkTime: 13 },
  { id: 'hospital-21', name: 'Imperial College Healthcare NHS Trust', type: 'hospitals_clinics', coordinates: { lat: 51.5175, lng: -0.1725 }, walkTime: 12 },
  { id: 'hospital-22', name: 'King Edward VII\'s Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5157, lng: -0.1483 }, walkTime: 10 },
  { id: 'hospital-23', name: 'King George Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5745, lng: 0.0995 }, walkTime: 26 },
  { id: 'hospital-24', name: 'King\'s College Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.4685, lng: -0.0935 }, walkTime: 13 },
  { id: 'hospital-25', name: 'King\'s College Hospital NHS Foundation Trust', type: 'hospitals_clinics', coordinates: { lat: 51.4685, lng: -0.0935 }, walkTime: 13 },
  { id: 'hospital-26', name: 'Lister Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.4885, lng: -0.1675 }, walkTime: 10 },
  { id: 'hospital-27', name: 'London Bridge Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5045, lng: -0.0865 }, walkTime: 8 },
  { id: 'hospital-28', name: 'London Clinic', type: 'hospitals_clinics', coordinates: { lat: 51.5219, lng: -0.1466 }, walkTime: 10 },
  { id: 'hospital-29', name: 'London Digestive Centre', type: 'hospitals_clinics', coordinates: { lat: 51.5195, lng: -0.1485 }, walkTime: 10 },
  { id: 'hospital-30', name: 'Moorfields Eye Hospital NHS Foundation Trust', type: 'hospitals_clinics', coordinates: { lat: 51.5215, lng: -0.0875 }, walkTime: 8 },
  { id: 'hospital-31', name: 'National Hospital for Neurology and Neurosurgery', type: 'hospitals_clinics', coordinates: { lat: 51.5245, lng: -0.1215 }, walkTime: 8 },
  { id: 'hospital-32', name: 'New Victoria Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.4315, lng: -0.1765 }, walkTime: 19 },
  { id: 'hospital-33', name: 'Newham University Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5245, lng: 0.0345 }, walkTime: 16 },
  { id: 'hospital-34', name: 'North Middlesex University Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.6085, lng: -0.0705 }, walkTime: 23 },
  { id: 'hospital-35', name: 'Northwick Park Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5745, lng: -0.3085 }, walkTime: 23 },
  { id: 'hospital-36', name: 'OneWelbeck', type: 'hospitals_clinics', coordinates: { lat: 51.5185, lng: -0.1485 }, walkTime: 10 },
  { id: 'hospital-37', name: 'Orpington Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.3775, lng: 0.0915 }, walkTime: 36 },
  { id: 'hospital-38', name: 'Portland Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5185, lng: -0.1455 }, walkTime: 10 },
  { id: 'hospital-39', name: 'Princess Grace Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5215, lng: -0.1545 }, walkTime: 11 },
  { id: 'hospital-40', name: 'Princess Royal University Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.3585, lng: 0.0185 }, walkTime: 35 },
  { id: 'hospital-41', name: 'Priory, The', type: 'hospitals_clinics', coordinates: { lat: 51.5345, lng: -0.1705 }, walkTime: 13 },
  { id: 'hospital-42', name: 'Queen Charlotte\'s and Chelsea Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5135, lng: -0.2265 }, walkTime: 14 },
  { id: 'hospital-43', name: 'Queen Elizabeth Hospital, Woolwich', type: 'hospitals_clinics', coordinates: { lat: 51.4895, lng: 0.0635 }, walkTime: 19 },
  { id: 'hospital-44', name: 'Queen\'s Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5745, lng: 0.1845 }, walkTime: 30 },
  { id: 'hospital-45', name: 'Royal Brompton and Harefield Hospitals', type: 'hospitals_clinics', coordinates: { lat: 51.4885, lng: -0.1705 }, walkTime: 10 },
  { id: 'hospital-46', name: 'Royal Free Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5515, lng: -0.1645 }, walkTime: 14 },
  { id: 'hospital-47', name: 'Royal Free London NHS Foundation Trust', type: 'hospitals_clinics', coordinates: { lat: 51.5515, lng: -0.1645 }, walkTime: 14 },
  { id: 'hospital-48', name: 'Royal London Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5175, lng: -0.0605 }, walkTime: 10 },
  { id: 'hospital-49', name: 'Royal Marsden NHS Foundation Trust', type: 'hospitals_clinics', coordinates: { lat: 51.4885, lng: -0.1725 }, walkTime: 10 },
  { id: 'hospital-50', name: 'Schoen Clinic London', type: 'hospitals_clinics', coordinates: { lat: 51.5185, lng: -0.1475 }, walkTime: 10 },
  { id: 'hospital-51', name: 'Shirley Oaks Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.3645, lng: -0.0685 }, walkTime: 33 },
  { id: 'hospital-52', name: 'St Bartholomew\'s Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5185, lng: -0.0995 }, walkTime: 8 },
  { id: 'hospital-53', name: 'St George\'s Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.4275, lng: -0.1745 }, walkTime: 18 },
  { id: 'hospital-54', name: 'St Helier Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.3775, lng: -0.2015 }, walkTime: 30 },
  { id: 'hospital-55', name: 'St Mary\'s Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5175, lng: -0.1725 }, walkTime: 12 },
  { id: 'hospital-56', name: 'St Thomas\' Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.4985, lng: -0.1175 }, walkTime: 9 },
  { id: 'hospital-57', name: 'University College Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5245, lng: -0.1355 }, walkTime: 9 },
  { id: 'hospital-58', name: 'University College London Hospitals (UCLH) NHS Foundation Trust', type: 'hospitals_clinics', coordinates: { lat: 51.5245, lng: -0.1355 }, walkTime: 9 },
  { id: 'hospital-59', name: 'University Hospital Lewisham', type: 'hospitals_clinics', coordinates: { lat: 51.4565, lng: -0.0135 }, walkTime: 19 },
  { id: 'hospital-60', name: 'Wellington Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5345, lng: -0.1695 }, walkTime: 13 },
  { id: 'hospital-61', name: 'West Middlesex University Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.4815, lng: -0.3415 }, walkTime: 22 },
  { id: 'hospital-62', name: 'Western Eye Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5155, lng: -0.1735 }, walkTime: 12 },
  { id: 'hospital-63', name: 'Whipps Cross University Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5885, lng: -0.0125 }, walkTime: 21 },
  { id: 'hospital-64', name: 'Whittington Hospital', type: 'hospitals_clinics', coordinates: { lat: 51.5645, lng: -0.1385 }, walkTime: 14 },

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
