export interface Development {
  id: string;
  name: string;
  developer: string;
  zone: number;
  location: string;
  postcode: string;
  nearestTube: {
    station: string;
    line: string;
    walkTime: number;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  prices: {
    studio?: string;
    oneBed?: string;
    twoBed?: string;
    threeBed?: string;
    fourBed?: string;
    range?: string;
  };
  tenure: string;
  schools: string[];
  hospital: string;
  transportScore: string;
  greenSpaces: string;
  amenities: string[];
  areaOverview: string;
  images: string[];
}

// Helper function to parse postcodes to coordinates (approximate London coordinates)
const postcodeToCoords = (postcode: string): { lat: number; lng: number } => {
  // This is a simplified mapping - in production, use a proper geocoding service
  const postcodeMap: { [key: string]: { lat: number; lng: number } } = {
    'SE15': { lat: 51.4845, lng: -0.0521 },
    'SW17': { lat: 51.4305, lng: -0.1685 },
    'W3': { lat: 51.5177, lng: -0.2597 },
    'KT3': { lat: 51.3991, lng: -0.2568 },
    'HA9': { lat: 51.5635, lng: -0.2792 },
    'UB3': { lat: 51.5041, lng: -0.4219 },
    'NW9-H': { lat: 51.5889, lng: -0.2347 },
    'HA1': { lat: 51.5918, lng: -0.3346 },
    'E16': { lat: 51.5074, lng: 0.0278 },
    'SE26': { lat: 51.4261, lng: -0.0511 },
    'E14': { lat: 51.5004, lng: -0.0187 },
    'SE18': { lat: 51.4906, lng: 0.0669 },
    'UB1': { lat: 51.5074, lng: -0.3753 },
    'SE3': { lat: 51.4639, lng: 0.0269 },
    'W12': { lat: 51.5127, lng: -0.2244 },
    'E1W': { lat: 51.5044, lng: -0.0556 },
    'NW1': { lat: 51.5414, lng: -0.1426 },
    'SW6': { lat: 51.4763, lng: -0.1893 },
    'SE11': { lat: 51.4816, lng: -0.1134 },
    'SE1': { lat: 51.4926, lng: -0.0673 },
    'SW11': { lat: 51.4763, lng: -0.1622 },
    'W2': { lat: 51.5178, lng: -0.1626 },
    'E3': { lat: 51.5276, lng: -0.0157 },
    'SW18': { lat: 51.4576, lng: -0.1890 },
    'N4': { lat: 51.5635, lng: -0.1033 },
    'E15': { lat: 51.5398, lng: -0.0031 },
    'N8': { lat: 51.5904, lng: -0.1218 },
    'HA0': { lat: 51.5415, lng: -0.3040 },
    'NW9-S': { lat: 51.5889, lng: -0.2265 },
    'SE28': { lat: 51.4861, lng: 0.0906 },
    'EN4': { lat: 51.6489, lng: -0.1488 },
    'E14-LL': { lat: 51.5024, lng: -0.0214 },
    'E2': { lat: 51.5321, lng: -0.0558 },
    'W2-T': { lat: 51.5198, lng: -0.1631 },
    'EC1V': { lat: 51.5287, lng: -0.0915 },
    'SM1': { lat: 51.3633, lng: -0.1958 }
  };
  
  const area = postcode.split(' ')[0];
  return postcodeMap[area] || { lat: 51.5074, lng: -0.1278 };
};

export const developments: Development[] = [
  // Barratt London Developments
  {
    id: "bermondsey-heights-barratt",
    name: "Bermondsey Heights",
    developer: "Barratt London",
    zone: 2,
    location: "South Bermondsey",
    postcode: "SE15 1NS",
    nearestTube: {
      station: "South Bermondsey",
      line: "National Rail",
      walkTime: 5
    },
    coordinates: postcodeToCoords("SE15 1NS"),
    prices: {
      range: "£447k - £742k"
    },
    tenure: "Leasehold",
    schools: ["Ilderton Primary (Good)"],
    hospital: "Guy's Hospital",
    transportScore: "Very Good",
    greenSpaces: "Nearby Bridgehouse Meadows & Southwark Park",
    amenities: ["Concierge", "Roof terraces with city views", "Residents' lounge"],
    areaOverview: "An up-and-coming Zone 2 area benefiting from major regeneration, just one stop from London Bridge.",
    images: []
  },
  {
    id: "the-lanes-barratt",
    name: "The Lanes",
    developer: "Barratt London",
    zone: 3,
    location: "Tooting",
    postcode: "SW17 7FX",
    nearestTube: {
      station: "Tooting Bec / Earlsfield",
      line: "Northern / National Rail",
      walkTime: 17
    },
    coordinates: postcodeToCoords("SW17 7FX"),
    prices: {
      range: "£412k - £760k"
    },
    tenure: "Leasehold",
    schools: ["Burntwood School (Outstanding)"],
    hospital: "St George's Hospital",
    transportScore: "Good",
    greenSpaces: "Set within the 32-acre Springfield Park",
    amenities: ["Supermarket", "Gym", "Café on-site"],
    areaOverview: "A new 'village' community between buzzy Tooting and leafy Earlsfield, centred around a huge new park.",
    images: []
  },
  {
    id: "royal-gateway-barratt",
    name: "Royal Gateway",
    developer: "Barratt London",
    zone: 2,
    location: "Acton",
    postcode: "W3 0PU",
    nearestTube: {
      station: "North Acton / Acton Main Line",
      line: "Central, Elizabeth Line",
      walkTime: 6
    },
    coordinates: postcodeToCoords("W3 0PU"),
    prices: {
      range: "£475k - £1.5M"
    },
    tenure: "Leasehold",
    schools: ["Ark Acton Academy (Good)"],
    hospital: "Central Middlesex Hospital",
    transportScore: "Excellent",
    greenSpaces: "On-site podium gardens, near Acton Park",
    amenities: ["Gym", "Residents' lounge", "Concierge", "Rooftop gardens"],
    areaOverview: "A highly convenient location in a major West London regeneration zone with superb transport links.",
    images: []
  },
  {
    id: "sterling-place-barratt",
    name: "Sterling Place",
    developer: "Barratt London",
    zone: 4,
    location: "New Malden",
    postcode: "KT3 4NE",
    nearestTube: {
      station: "Motspur Park / New Malden",
      line: "National Rail",
      walkTime: 12
    },
    coordinates: postcodeToCoords("KT3 4NE"),
    prices: {
      range: "£375k - £550k"
    },
    tenure: "Leasehold",
    schools: ["Burlington Junior (Good)"],
    hospital: "Kingston Hospital",
    transportScore: "Good",
    greenSpaces: "On-site podium gardens, near Wimbledon Common",
    amenities: ["On-site gym", "Yoga studio", "Co-working space", "Concierge"],
    areaOverview: "South-West London living with quick access to Kingston and Wimbledon's green spaces and amenities.",
    images: []
  },
  {
    id: "wembley-park-gardens-barratt",
    name: "Wembley Park Gardens",
    developer: "Barratt London",
    zone: 4,
    location: "Wembley",
    postcode: "HA9 8PH",
    nearestTube: {
      station: "Wembley Park",
      line: "Jubilee, Metropolitan",
      walkTime: 2
    },
    coordinates: postcodeToCoords("HA9 8PH"),
    prices: {
      range: "£434k - £641k"
    },
    tenure: "Leasehold",
    schools: ["Ark Academy (Outstanding)"],
    hospital: "Northwick Park Hospital",
    transportScore: "Excellent",
    greenSpaces: "Landscaped podium gardens and roof terrace",
    amenities: ["Concierge", "Close to London Designer Outlet"],
    areaOverview: "A world-class destination with iconic venues, shopping, and fast links to Central London on its doorstep.",
    images: []
  },
  {
    id: "hayes-village-barratt",
    name: "Hayes Village",
    developer: "Barratt London",
    zone: 5,
    location: "Hayes",
    postcode: "UB3 4QP",
    nearestTube: {
      station: "Hayes & Harlington",
      line: "Elizabeth Line, National Rail",
      walkTime: 10
    },
    coordinates: postcodeToCoords("UB3 4QP"),
    prices: {
      range: "£325k - £625k"
    },
    tenure: "Leasehold",
    schools: ["Botwell House Catholic Primary (Good)"],
    hospital: "Hillingdon Hospital",
    transportScore: "Very Good",
    greenSpaces: "9 acres of green space, next to Grand Union Canal",
    amenities: ["Residents' gym", "Running track", "Playground", "Community centre"],
    areaOverview: "Waterside living on a historic site, transformed into a new community with excellent Elizabeth Line connections.",
    images: []
  },
  {
    id: "hendon-waterside-barratt",
    name: "Hendon Waterside",
    developer: "Barratt London",
    zone: 3,
    location: "Hendon",
    postcode: "NW9 7QA",
    nearestTube: {
      station: "Hendon",
      line: "Thameslink",
      walkTime: 5
    },
    coordinates: { lat: 51.5889, lng: -0.2347 },
    prices: {
      range: "£375k - £1.35M"
    },
    tenure: "Leasehold",
    schools: ["The Orion Primary (Outstanding)"],
    hospital: "Royal Free Hospital",
    transportScore: "Good",
    greenSpaces: "Beside the 110-acre Welsh Harp Reservoir",
    amenities: ["On-site Co-op", "Starbucks", "Community centre", "Nursery"],
    areaOverview: "A long-term regeneration project offering tranquil waterside living next to a huge nature reserve.",
    images: []
  },
  {
    id: "eastman-village-barratt",
    name: "Eastman Village",
    developer: "Barratt London",
    zone: 5,
    location: "Harrow",
    postcode: "HA1 4BF",
    nearestTube: {
      station: "Harrow & Wealdstone",
      line: "Bakerloo, Overground, National Rail",
      walkTime: 12
    },
    coordinates: postcodeToCoords("HA1 4BF"),
    prices: {
      range: "£350k - £675k"
    },
    tenure: "Leasehold",
    schools: ["Marlborough Primary (Outstanding)"],
    hospital: "Northwick Park Hospital",
    transportScore: "Good",
    greenSpaces: "8 acres of parkland, communal gardens",
    amenities: ["Residents' gym", "Co-working space", "On-site café"],
    areaOverview: "A new community on the site of the former Kodak factory, bringing new life and amenities to Harrow.",
    images: []
  },
  {
    id: "crown-wharf-barratt",
    name: "Crown Wharf",
    developer: "Barratt London",
    zone: 2,
    location: "Canning Town",
    postcode: "E16 4ST",
    nearestTube: {
      station: "Canning Town",
      line: "Jubilee, DLR",
      walkTime: 6
    },
    coordinates: postcodeToCoords("E16 4ST"),
    prices: {
      range: "Coming Soon"
    },
    tenure: "Leasehold",
    schools: ["Keir Hardie Primary (Good)"],
    hospital: "Newham University Hospital",
    transportScore: "Excellent",
    greenSpaces: "Landscaped gardens on the River Lea",
    amenities: ["Concierge", "On-site work, retail and café space"],
    areaOverview: "Waterside living in the heart of a major East London regeneration and transport hub.",
    images: []
  },
  {
    id: "lightmakers-barratt",
    name: "Lightmakers",
    developer: "Barratt London",
    zone: 4,
    location: "Sydenham",
    postcode: "SE26 4PU",
    nearestTube: {
      station: "Lower Sydenham / Sydenham",
      line: "National Rail",
      walkTime: 12
    },
    coordinates: postcodeToCoords("SE26 4PU"),
    prices: {
      range: "Coming Soon"
    },
    tenure: "Leasehold",
    schools: ["Adamsrill Primary (Good)"],
    hospital: "Lewisham Hospital",
    transportScore: "Good",
    greenSpaces: "Close to Cator Park and Beckenham Place Park",
    amenities: ["Amenities to be confirmed"],
    areaOverview: "A new community in a popular South-East London neighbourhood known for its independent shops and parks.",
    images: []
  },

  // Berkeley Homes Developments
  {
    id: "south-quay-plaza-berkeley",
    name: "South Quay Plaza",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Canary Wharf",
    postcode: "E14 9WS",
    nearestTube: {
      station: "South Quay / Canary Wharf",
      line: "DLR / Jubilee, Elizabeth",
      walkTime: 3
    },
    coordinates: postcodeToCoords("E14 9WS"),
    prices: {
      range: "£728k - £1.85M+"
    },
    tenure: "Leasehold",
    schools: ["Canary Wharf College (Outstanding)"],
    hospital: "The Royal London",
    transportScore: "Excellent",
    greenSpaces: "2.6 acres of gardens, near Jubilee Park",
    amenities: ["56th-floor bar & terrace", "Pool", "Spa", "Gym", "Cinema", "24hr concierge"],
    areaOverview: "The pinnacle of modern city living in London's financial capital, with unmatched amenities and connectivity.",
    images: []
  },
  {
    id: "royal-arsenal-riverside-berkeley",
    name: "Royal Arsenal Riverside",
    developer: "Berkeley Homes",
    zone: 4,
    location: "Woolwich",
    postcode: "SE18 6FR",
    nearestTube: {
      station: "Woolwich",
      line: "Elizabeth Line, DLR, National Rail",
      walkTime: 3
    },
    coordinates: postcodeToCoords("SE18 6FR"),
    prices: {
      range: "£600k - £915k"
    },
    tenure: "Leasehold",
    schools: ["St Peter's Catholic Primary (Good)"],
    hospital: "Queen Elizabeth Hospital",
    transportScore: "Excellent",
    greenSpaces: "Riverside path, Maribor & Wellington Parks",
    amenities: ["Pool", "Spa", "Gym", "Cinema", "On-site theatre & museum", "24hr concierge"],
    areaOverview: "Historic estate transformed into a major destination with its own on-site Crossrail station.",
    images: []
  },
  {
    id: "green-quarter-berkeley",
    name: "The Green Quarter",
    developer: "Berkeley Homes",
    zone: 4,
    location: "Southall",
    postcode: "UB1 1BL",
    nearestTube: {
      station: "Southall",
      line: "Elizabeth Line",
      walkTime: 9
    },
    coordinates: postcodeToCoords("UB1 1BL"),
    prices: {
      range: "£540k - £850k"
    },
    tenure: "Leasehold",
    schools: ["Villiers High (Outstanding)"],
    hospital: "Ealing Hospital",
    transportScore: "Very Good",
    greenSpaces: "13 acres of parkland & wetlands on-site",
    amenities: ["Gym", "Co-working space", "Concierge", "Future swimming pool"],
    areaOverview: "A pioneering project focused on creating one of the UK's most biodiverse developments.",
    images: []
  },
  {
    id: "kidbrooke-village-berkeley",
    name: "Kidbrooke Village",
    developer: "Berkeley Homes",
    zone: 3,
    location: "Greenwich",
    postcode: "SE3 9FW",
    nearestTube: {
      station: "Kidbrooke",
      line: "National Rail",
      walkTime: 3
    },
    coordinates: postcodeToCoords("SE3 9FW"),
    prices: {
      range: "£350k - £1.15M"
    },
    tenure: "Leasehold",
    schools: ["Wingfield Primary (Good)"],
    hospital: "Lewisham Hospital",
    transportScore: "Good",
    greenSpaces: "136 acres of parkland (Cator & Sutcliffe Parks)",
    amenities: ["Pool", "Gym", "Cinema", "24hr concierge", "On-site shops & school"],
    areaOverview: "An established, award-winning village with a strong community feel and abundant nature.",
    images: []
  },
  {
    id: "white-city-living-berkeley",
    name: "White City Living",
    developer: "Berkeley Homes",
    zone: 2,
    location: "White City",
    postcode: "W12 7RQ",
    nearestTube: {
      station: "White City / Wood Lane",
      line: "Central / Circle, H&C",
      walkTime: 2
    },
    coordinates: postcodeToCoords("W12 7RQ"),
    prices: {
      range: "£635k - £3.2M"
    },
    tenure: "Leasehold",
    schools: ["Ark Burlington Danes (Outstanding)"],
    hospital: "Hammersmith Hospital",
    transportScore: "Excellent",
    greenSpaces: "8 acres of gardens including a 5-acre park",
    amenities: ["Two cinemas", "Pool", "Hydro-pool", "Gym", "Business lounge", "24hr concierge"],
    areaOverview: "A vibrant new district in West London's creative hub, next to Westfield and Imperial College.",
    images: []
  },
  {
    id: "london-dock-berkeley",
    name: "London Dock",
    developer: "Berkeley Homes",
    zone: 1,
    location: "Wapping",
    postcode: "E1W 2AA",
    nearestTube: {
      station: "Tower Hill / Wapping",
      line: "Tube / Overground",
      walkTime: 12
    },
    coordinates: postcodeToCoords("E1W 2AA"),
    prices: {
      range: "£658k - £2.3M"
    },
    tenure: "Leasehold",
    schools: ["St Paul's Way Trust (Outstanding)"],
    hospital: "The Royal London",
    transportScore: "Excellent",
    greenSpaces: "7.5 acres of gardens & squares",
    amenities: ["Pool", "Spa", "Gym", "Virtual golf", "Squash court", "Cinema", "24hr concierge"],
    areaOverview: "Historic, cobbled-street area beside St Katharine Docks, offering luxury moments from the City.",
    images: []
  },
  {
    id: "camden-goods-yard-berkeley",
    name: "Camden Goods Yard",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Camden",
    postcode: "NW1 8EH",
    nearestTube: {
      station: "Chalk Farm / Camden Town",
      line: "Northern",
      walkTime: 6
    },
    coordinates: postcodeToCoords("NW1 8EH"),
    prices: {
      range: "£945k - £2.1M"
    },
    tenure: "Leasehold",
    schools: ["Primrose Hill School (Outstanding)"],
    hospital: "Royal Free Hospital",
    transportScore: "Excellent",
    greenSpaces: "New public park, near Regent's Park",
    amenities: ["Wellness suite with pool, steam & sauna", "Gym", "Cinema", "24hr concierge"],
    areaOverview: "A major new destination transforming a historic site in London's iconic cultural epicentre.",
    images: []
  },
  {
    id: "kings-road-park-berkeley",
    name: "King's Road Park",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Fulham",
    postcode: "SW6 2FR",
    nearestTube: {
      station: "Fulham Broadway",
      line: "District",
      walkTime: 5
    },
    coordinates: postcodeToCoords("SW6 2FR"),
    prices: {
      studio: "From £790,000",
      oneBed: "From £790,000",
      twoBed: "From £1,175,000",
      threeBed: "From £1,955,000",
      fourBed: "From £4,920,000",
      range: "£790k - £4.9M"
    },
    tenure: "999-year leasehold",
    schools: ["Lady Margaret School (Outstanding)", "The London Oratory School (Outstanding)", "Thomas's Fulham (Outstanding)"],
    hospital: "Chelsea and Westminster Hospital",
    transportScore: "Excellent - close to two stations on different lines (District, Overground), multiple bus routes, easy access to central London",
    greenSpaces: "6 acres of new public parkland and landscaped gardens within the development, including a formal lawn, courtyard gardens, and a new public square. Close to Eel Brook Common and Parsons Green.",
    amenities: ["24-hour concierge", "25m swimming pool with vitality pool", "Sauna & steam room", "Gym & two fitness studios", "Two cinema rooms", "Games room", "Golf simulator & virtual games room", "Residents' lounge with atrium", "Private dining room", "Meeting rooms"],
    areaOverview: "Perfectly positioned where Chelsea's iconic chic meets Fulham's village charm. Your new home is a launchpad for London living at its best. Spend weekend mornings browsing the designer boutiques on the King's Road, then grab lunch at an artisan café on Fulham Road. Enjoy a picnic or a game of tennis at nearby Eel Brook Common, or explore the independent delis and famous pubs of Parsons Green. For sports fans, Stamford Bridge is just a stone's throw away. It's a lifestyle of effortless style, convenience, and classic London character.",
    images: [
      "/kings-road-park-1.jpeg",
      "/kings-road-park-2.jpeg",
      "/kings-road-park-3.webp",
      "/kings-road-park-4.webp",
      "/kings-road-park-5.webp",
      "/kings-road-park-6.webp",
      "/kings-road-park-7.jpeg",
      "/kings-road-park-8.webp",
      "/kings-road-park-9.webp"
    ]
  },
  {
    id: "oval-village-berkeley",
    name: "Oval Village",
    developer: "Berkeley Homes",
    zone: 1,
    location: "Oval",
    postcode: "SE11 5QY",
    nearestTube: {
      station: "Oval / Vauxhall",
      line: "Northern / Victoria, National Rail",
      walkTime: 8
    },
    coordinates: postcodeToCoords("SE11 5QY"),
    prices: {
      range: "£595k - £2.3M"
    },
    tenure: "Leasehold",
    schools: ["Keyworth Primary (Good)"],
    hospital: "St Thomas' Hospital",
    transportScore: "Excellent",
    greenSpaces: "On-site gardens, near Kennington Park",
    amenities: ["Pool", "Spa", "Gym", "Cinema", "Residents' lounge", "24hr concierge"],
    areaOverview: "A new community at a classic London crossroads, famed for its cricket ground and connectivity.",
    images: [
      "/oval-village-1.png",
      "/oval-village-2.png",
      "/oval-village-3.png",
      "/oval-village-4.png",
      "/oval-village-5.png",
      "/oval-village-6.png",
      "/oval-village-7.png",
      "/oval-village-8.png"
    ]
  },
  {
    id: "bermondsey-place-berkeley",
    name: "Bermondsey Place",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Bermondsey",
    postcode: "SE1 5AY",
    nearestTube: {
      station: "South Bermondsey / Bermondsey",
      line: "National Rail / Jubilee",
      walkTime: 7
    },
    coordinates: postcodeToCoords("SE1 5AY"),
    prices: {
      range: "£500k - £835k"
    },
    tenure: "Leasehold",
    schools: ["Southwark Park Primary (Good)"],
    hospital: "Guy's Hospital",
    transportScore: "Very Good",
    greenSpaces: "Close to Southwark Park, Tanner Street Park",
    amenities: ["Concierge", "State-of-the-art gym", "Business lounge"],
    areaOverview: "A trendy, foodie hotspot known for Bermondsey Street, Maltby Street Market, and converted warehouses.",
    images: []
  },
  {
    id: "prince-of-wales-drive-berkeley",
    name: "Prince of Wales Drive",
    developer: "Berkeley Homes",
    zone: 1,
    location: "Battersea",
    postcode: "SW11 4FA",
    nearestTube: {
      station: "Battersea Park / Battersea Power Station",
      line: "National Rail / Northern",
      walkTime: 7
    },
    coordinates: postcodeToCoords("SW11 4FA"),
    prices: {
      range: "POA (Resale)"
    },
    tenure: "Leasehold",
    schools: ["Newton Prep (Outstanding)"],
    hospital: "Chelsea and Westminster",
    transportScore: "Very Good",
    greenSpaces: "Opposite Battersea Park, on-site gardens",
    amenities: ["17m pool", "Vitality pool", "Spa", "8th-floor roof terrace", "24hr concierge"],
    areaOverview: "Sophisticated development benefiting from the vast regeneration of Battersea Power Station.",
    images: []
  },
  {
    id: "west-end-gate-berkeley",
    name: "West End Gate",
    developer: "Berkeley Homes",
    zone: 1,
    location: "Marylebone",
    postcode: "W2 1BY",
    nearestTube: {
      station: "Edgware Road",
      line: "District, Circle, H&C",
      walkTime: 2
    },
    coordinates: postcodeToCoords("W2 1BY"),
    prices: {
      range: "POA (Resale)"
    },
    tenure: "Leasehold",
    schools: ["St Mary's Bryanston Sq (Outstanding)"],
    hospital: "St Mary's Hospital",
    transportScore: "Excellent",
    greenSpaces: "Landscaped gardens, near Hyde Park",
    amenities: ["Pool", "Spa", "Gym", "Private cinema", "Business lounge", "24hr concierge"],
    areaOverview: "Manhattan-style architecture providing a gateway to the West End and prime central London.",
    images: []
  },
  {
    id: "bow-green-berkeley",
    name: "Bow Green",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Bow",
    postcode: "E3 4BH",
    nearestTube: {
      station: "Mile End / Bow Road",
      line: "Central, District, H&C",
      walkTime: 12
    },
    coordinates: postcodeToCoords("E3 4BH"),
    prices: {
      range: "£460k - £725k"
    },
    tenure: "Leasehold",
    schools: ["Bonner Primary School (Good)"],
    hospital: "Mile End Hospital",
    transportScore: "Very Good",
    greenSpaces: "Opposite Tower Hamlets Cemetery Park",
    amenities: ["Serenity pool", "Gym", "Spa", "Residents' lounge", "On-site restaurant"],
    areaOverview: "A calm, green haven in the heart of the well-connected and rapidly evolving East End.",
    images: []
  },
  {
    id: "wandsworth-mills-berkeley",
    name: "Wandsworth Mills",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Wandsworth",
    postcode: "SW18 1TH",
    nearestTube: {
      station: "Wandsworth Town",
      line: "National Rail",
      walkTime: 7
    },
    coordinates: postcodeToCoords("SW18 1TH"),
    prices: {
      range: "£625k - £1.8M"
    },
    tenure: "Leasehold",
    schools: ["Brandlehow Primary (Outstanding)"],
    hospital: "St George's Hospital",
    transportScore: "Good",
    greenSpaces: "King George's Park, Wandsworth Common",
    amenities: ["Pool", "Gym", "Spa", "Residents' lounge", "Cinema", "Garden atrium"],
    areaOverview: "A new riverside quarter on the River Wandle, blending heritage with modern design.",
    images: []
  },
  {
    id: "woodberry-down-berkeley",
    name: "Woodberry Down",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Finsbury Park",
    postcode: "N4 2BA",
    nearestTube: {
      station: "Manor House",
      line: "Piccadilly",
      walkTime: 4
    },
    coordinates: postcodeToCoords("N4 2BA"),
    prices: {
      range: "£555k - £1.8M"
    },
    tenure: "Leasehold",
    schools: ["Parkwood Primary (Good)"],
    hospital: "Whittington Hospital",
    transportScore: "Very Good",
    greenSpaces: "Set beside 42 acres of open water",
    amenities: ["Pool", "Gym", "Screening room", "Residents' lounge", "24hr concierge"],
    areaOverview: "A unique urban village with a stunning natural waterside setting, offering a tranquil escape.",
    images: []
  },
  {
    id: "twelvetrees-park-berkeley",
    name: "TwelveTrees Park",
    developer: "Berkeley Homes",
    zone: 2,
    location: "West Ham",
    postcode: "E15 3FQ",
    nearestTube: {
      station: "West Ham",
      line: "Jubilee, District, H&C, DLR, c2c",
      walkTime: 1
    },
    coordinates: postcodeToCoords("E15 3FQ"),
    prices: {
      range: "£598k - £1M"
    },
    tenure: "Leasehold",
    schools: ["Colegrave Primary (Outstanding)"],
    hospital: "Newham University Hospital",
    transportScore: "Excellent",
    greenSpaces: "A 12-acre park is the heart of the development",
    amenities: ["Gym", "Business lounge", "Screening room", "24hr concierge"],
    areaOverview: "A major new community built around one of London's best-connected transport hubs.",
    images: []
  },
  {
    id: "alexandra-gate-berkeley",
    name: "Alexandra Gate",
    developer: "Berkeley Homes",
    zone: 3,
    location: "Haringey",
    postcode: "N8 0ES",
    nearestTube: {
      station: "Wood Green / Turnpike Lane",
      line: "Piccadilly",
      walkTime: 12
    },
    coordinates: postcodeToCoords("N8 0ES"),
    prices: {
      range: "£435k - £650k"
    },
    tenure: "Leasehold",
    schools: ["Alexandra Park School (Outstanding)"],
    hospital: "North Middlesex Hospital",
    transportScore: "Good",
    greenSpaces: "Adjacent to the 196-acre Alexandra Park",
    amenities: ["Landscaped gardens", "Children's play area"],
    areaOverview: "A new creative district offering panoramic city views and vast open green spaces.",
    images: []
  },
  {
    id: "grand-union-berkeley",
    name: "Grand Union",
    developer: "Berkeley Homes",
    zone: 3,
    location: "Wembley",
    postcode: "HA0 1NW",
    nearestTube: {
      station: "Stonebridge Park / Alperton",
      line: "Bakerloo / Piccadilly",
      walkTime: 10
    },
    coordinates: postcodeToCoords("HA0 1NW"),
    prices: {
      range: "£388k - £820k"
    },
    tenure: "Leasehold",
    schools: ["Ark Academy (Outstanding)"],
    hospital: "Central Middlesex Hospital",
    transportScore: "Good",
    greenSpaces: "Canalside piazza, meadows and gardens",
    amenities: ["Residents' lounge", "Bowling alley", "Co-working space"],
    areaOverview: "A new canalside neighbourhood creating a vibrant community in a major regeneration zone.",
    images: []
  },
  {
    id: "silkstream-berkeley",
    name: "Silkstream",
    developer: "Berkeley Homes",
    zone: 3,
    location: "Hendon",
    postcode: "NW9 7TH",
    nearestTube: {
      station: "Hendon / Hendon Central",
      line: "Thameslink / Northern",
      walkTime: 12
    },
    coordinates: { lat: 51.5889, lng: -0.2265 },
    prices: {
      range: "£433k - £705k"
    },
    tenure: "Leasehold",
    schools: ["St Joseph's Catholic Primary (Outstanding)"],
    hospital: "Royal Free Hospital",
    transportScore: "Good",
    greenSpaces: "New 1.5-acre park, podium gardens",
    amenities: ["Gym", "Screening rooms", "Co-working area", "24hr concierge"],
    areaOverview: "Well-connected North West London living benefiting from the Brent Cross regeneration.",
    images: []
  },
  {
    id: "lombard-square-berkeley",
    name: "Lombard Square",
    developer: "Berkeley Homes",
    zone: 4,
    location: "Plumstead",
    postcode: "SE28 0FX",
    nearestTube: {
      station: "Plumstead / Woolwich Arsenal",
      line: "National Rail / Elizabeth",
      walkTime: 7
    },
    coordinates: postcodeToCoords("SE28 0FX"),
    prices: {
      range: "£345k - £670k"
    },
    tenure: "Leasehold",
    schools: ["St Patrick's Catholic Primary (Good)"],
    hospital: "Queen Elizabeth Hospital",
    transportScore: "Good",
    greenSpaces: "Over 1.8 acres of new parkland on-site",
    amenities: ["12-hour concierge", "Gym", "Secure bike storage"],
    areaOverview: "A new neighbourhood bringing green squares and modern living to historic Plumstead.",
    images: []
  },
  {
    id: "beaufort-park-berkeley",
    name: "Beaufort Park",
    developer: "Berkeley Homes",
    zone: 4,
    location: "Colindale",
    postcode: "NW9 5GW",
    nearestTube: {
      station: "Colindale",
      line: "Northern",
      walkTime: 5
    },
    coordinates: { lat: 51.5835, lng: -0.2480 },
    prices: {
      range: "POA (Resale)"
    },
    tenure: "Leasehold",
    schools: ["The Orion Primary (Outstanding)"],
    hospital: "Royal Free Hospital",
    transportScore: "Good",
    greenSpaces: "25 acres of landscaped parkland on-site",
    amenities: ["Pool", "Spa", "Gym", "On-site shops, bars & restaurants"],
    areaOverview: "A fully established, modern urban village with a wide range of on-site amenities.",
    images: []
  },
  {
    id: "trent-park-berkeley",
    name: "Trent Park",
    developer: "Berkeley Homes",
    zone: 5,
    location: "Enfield",
    postcode: "EN4 0FD",
    nearestTube: {
      station: "Cockfosters / Oakwood",
      line: "Piccadilly",
      walkTime: 25
    },
    coordinates: postcodeToCoords("EN4 0FD"),
    prices: {
      range: "£750k - £2.3M"
    },
    tenure: "Freehold (Houses) & Leasehold (Apts)",
    schools: ["Trent CofE Primary (Outstanding)"],
    hospital: "Chase Farm Hospital",
    transportScore: "Fair",
    greenSpaces: "Set within a 413-acre historic park",
    amenities: ["Outdoor pool", "Gym", "Tennis courts", "Shuttle bus to station"],
    areaOverview: "Unique country estate living, blending restored mansions with new homes in a vast park.",
    images: []
  },
  {
    id: "heron-wharf-berkeley",
    name: "Heron Wharf (Poplar Riverside)",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Poplar",
    postcode: "E14 0LL",
    nearestTube: {
      station: "Canning Town / Langdon Park",
      line: "Jubilee, DLR / DLR",
      walkTime: 12
    },
    coordinates: postcodeToCoords("E14 0LL"),
    prices: {
      range: "£455k - £930k"
    },
    tenure: "Leasehold",
    schools: ["Culloden Primary (Outstanding)"],
    hospital: "The Royal London",
    transportScore: "Very Good",
    greenSpaces: "2.5-acre public park, riverside walk",
    amenities: ["Pool", "Spa with sauna & steam", "Gym", "Cinema", "Co-working space"],
    areaOverview: "A new riverside village on the River Lea, with extensive parkland and resident facilities.",
    images: []
  },
  {
    id: "regents-view-berkeley",
    name: "Regent's View",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Bethnal Green",
    postcode: "E2 9AP",
    nearestTube: {
      station: "Cambridge Heath / Bethnal Green",
      line: "Overground / Central",
      walkTime: 7
    },
    coordinates: postcodeToCoords("E2 9AP"),
    prices: {
      range: "POA"
    },
    tenure: "Leasehold",
    schools: ["Mulberry Academy (Outstanding)"],
    hospital: "The Royal London",
    transportScore: "Very Good",
    greenSpaces: "New 3-acre canalside park",
    amenities: ["24hr concierge", "Wellness centre", "Cinema", "Squash court", "Rooftop bar"],
    areaOverview: "A landmark development on Regent's Canal, moments from Broadway Market and London Fields.",
    images: []
  },
  {
    id: "trillium-berkeley",
    name: "Trillium",
    developer: "Berkeley Homes",
    zone: 1,
    location: "Marylebone",
    postcode: "W2",
    nearestTube: {
      station: "Edgware Road / Paddington",
      line: "Tube / Tube, National Rail, Elizabeth",
      walkTime: 7
    },
    coordinates: postcodeToCoords("W2-T"),
    prices: {
      range: "From £1.18M"
    },
    tenure: "Leasehold",
    schools: ["Hampden Gurney CofE (Outstanding)"],
    hospital: "St Mary's Hospital",
    transportScore: "Excellent",
    greenSpaces: "New landscaped gardens, near Hyde Park",
    amenities: ["Extensive wellness spa with pool, hydrotherapy, sauna, ice plunge"],
    areaOverview: "Westminster's tallest residential tower, offering sky-high luxury living and panoramic views.",
    images: []
  },
  {
    id: "250-city-road-berkeley",
    name: "250 City Road",
    developer: "Berkeley Homes",
    zone: 1,
    location: "Islington",
    postcode: "EC1V 2AB",
    nearestTube: {
      station: "Angel / Old Street",
      line: "Northern / Northern",
      walkTime: 10
    },
    coordinates: postcodeToCoords("EC1V 2AB"),
    prices: {
      range: "POA (Resale)"
    },
    tenure: "Leasehold",
    schools: ["City of London Academy (Good)"],
    hospital: "Moorfields Eye Hospital",
    transportScore: "Excellent",
    greenSpaces: "1.9 acres of Wi-Fi enabled gardens",
    amenities: ["Pool", "Spa", "Gym", "Residents' lounge", "Cinema room"],
    areaOverview: "Landmark towers at the heart of London's 'Tech City' hub, between Angel and Shoreditch.",
    images: []
  },
  {
    id: "parkside-collection-berkeley",
    name: "Parkside Collection",
    developer: "Berkeley Homes",
    zone: 1,
    location: "Battersea",
    postcode: "SW11 8QN",
    nearestTube: {
      station: "Sloane Square / Battersea Power Station",
      line: "Tube / Northern",
      walkTime: 12
    },
    coordinates: postcodeToCoords("SW11 8QN"),
    prices: {
      range: "From £695k"
    },
    tenure: "Leasehold",
    schools: ["Newton Prep (Outstanding)"],
    hospital: "Chelsea and Westminster",
    transportScore: "Very Good",
    greenSpaces: "Overlooks Battersea Park",
    amenities: ["24hr concierge", "Underground parking", "Access to hotel spa"],
    areaOverview: "Boutique apartments offering tranquil parkside living directly opposite Battersea Park.",
    images: []
  },
  {
    id: "fulham-reach-berkeley",
    name: "Fulham Reach",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Fulham",
    postcode: "W6 9GD",
    nearestTube: {
      station: "Hammersmith",
      line: "District, Piccadilly, H&C",
      walkTime: 8
    },
    coordinates: postcodeToCoords("W6 9GD"),
    prices: {
      range: "POA (Resale)"
    },
    tenure: "Leasehold",
    schools: ["St Paul's CofE Primary (Outstanding)"],
    hospital: "Charing Cross Hospital",
    transportScore: "Excellent",
    greenSpaces: "Riverside promenade and landscaped gardens",
    amenities: ["The Tamesis Club: pool, spa, gym, virtual golf, cinema, wine cellar"],
    areaOverview: "Award-winning riverside development with an exclusive private members' club feel.",
    images: []
  },
  {
    id: "chelsea-creek-berkeley",
    name: "Chelsea Creek",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Chelsea",
    postcode: "SW6 2FS",
    nearestTube: {
      station: "Imperial Wharf",
      line: "Overground, Southern",
      walkTime: 2
    },
    coordinates: postcodeToCoords("SW6 2FS"),
    prices: {
      range: "POA (Resale)"
    },
    tenure: "Leasehold",
    schools: ["Lady Margaret School (Outstanding)"],
    hospital: "Chelsea and Westminster",
    transportScore: "Good",
    greenSpaces: "European-style canals and gardens",
    amenities: ["Spa", "Swimming pool", "Gym", "24-hour concierge"],
    areaOverview: "A prestigious and tranquil waterside enclave, blending the best of Chelsea and Fulham.",
    images: []
  },
  {
    id: "sutton-berkeley",
    name: "Sutton",
    developer: "Berkeley Homes",
    zone: 5,
    location: "Sutton",
    postcode: "SM1 4GR",
    nearestTube: {
      station: "Sutton",
      line: "National Rail",
      walkTime: 5
    },
    coordinates: postcodeToCoords("SM1 4GR"),
    prices: {
      range: "POA"
    },
    tenure: "Leasehold",
    schools: ["Sutton Grammar (Outstanding)"],
    hospital: "St Helier Hospital",
    transportScore: "Good",
    greenSpaces: "Close to Manor Park",
    amenities: ["Amenities to be confirmed"],
    areaOverview: "An upcoming town centre regeneration project promising to redefine a key South London hub.",
    images: []
  }
];

// Property of the Week
export const propertyOfTheWeek = {
  development: developments.find(d => d.id === "south-quay-plaza-berkeley")!,
  floorplanUrl: "https://example.com/south-quay-floorplan.pdf"
};
