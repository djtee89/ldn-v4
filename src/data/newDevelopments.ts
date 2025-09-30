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
    oneBed?: string;
    twoBed?: string;
    threeBed?: string;
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
    coordinates: {
      lat: 51.4845,
      lng: -0.0521
    },
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
    coordinates: {
      lat: 51.4305,
      lng: -0.1685
    },
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
      station: "North Acton",
      line: "Central, Elizabeth Line",
      walkTime: 6
    },
    coordinates: {
      lat: 51.5177,
      lng: -0.2597
    },
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
    coordinates: {
      lat: 51.3991,
      lng: -0.2568
    },
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
    coordinates: {
      lat: 51.5635,
      lng: -0.2792
    },
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
    coordinates: {
      lat: 51.5041,
      lng: -0.4219
    },
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
    coordinates: {
      lat: 51.5889,
      lng: -0.2347
    },
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
    coordinates: {
      lat: 51.5918,
      lng: -0.3346
    },
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
    coordinates: {
      lat: 51.5004,
      lng: -0.0187
    },
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
    coordinates: {
      lat: 51.4906,
      lng: 0.0669
    },
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
    coordinates: {
      lat: 51.5074,
      lng: -0.3753
    },
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
    coordinates: {
      lat: 51.4639,
      lng: 0.0269
    },
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
    coordinates: {
      lat: 51.5127,
      lng: -0.2244
    },
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
    coordinates: {
      lat: 51.5044,
      lng: -0.0556
    },
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
    coordinates: {
      lat: 51.5414,
      lng: -0.1426
    },
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
    postcode: "SW6 2FP",
    nearestTube: {
      station: "Fulham Broadway / Imperial Wharf",
      line: "District",
      walkTime: 12
    },
    coordinates: {
      lat: 51.4763,
      lng: -0.1893
    },
    prices: {
      range: "£793k - £4.9M"
    },
    tenure: "Leasehold",
    schools: ["Lady Margaret School (Outstanding)"],
    hospital: "Chelsea and Westminster",
    transportScore: "Good",
    greenSpaces: "A new 6-acre park is the centrepiece",
    amenities: ["25m pool", "Vitality pool", "Spa", "Gym", "Two cinemas", "Virtual golf", "Residents' lounge"],
    areaOverview: "A new sustainable neighbourhood just off the iconic King's Road, blending heritage with modern luxury.",
    images: []
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
    coordinates: {
      lat: 51.4816,
      lng: -0.1134
    },
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
    images: []
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
    coordinates: {
      lat: 51.4926,
      lng: -0.0673
    },
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
  }
];

// Property of the Week
export const propertyOfTheWeek = {
  development: developments.find(d => d.id === "south-quay-plaza-berkeley")!,
  floorplanUrl: "https://example.com/south-quay-floorplan.pdf"
};
