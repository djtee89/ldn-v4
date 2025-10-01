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
  videoUrl?: string;
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
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "green-quarter-berkeley",
    name: "The Green Quarter",
    developer: "Berkeley Homes",
    zone: 4,
    location: "Southall / Ealing",
    postcode: "UB1 1BL",
    nearestTube: {
      station: "Southall",
      line: "Elizabeth Line, National Rail",
      walkTime: 5
    },
    coordinates: postcodeToCoords("UB1 1BL"),
    prices: {
      studio: "From £387,500",
      oneBed: "From £450,000",
      twoBed: "From £585,000",
      threeBed: "From £752,500",
      range: "£387.5k - £752.5k+"
    },
    tenure: "999-year leasehold",
    schools: ["Three Bridges Primary School (Outstanding)", "Villiers High School (Outstanding)"],
    hospital: "Ealing Hospital",
    transportScore: "Excellent — The Elizabeth Line is a game-changer, offering rapid access to Central London (Bond Street in 17 mins, Canary Wharf in 31 mins) and Heathrow Airport (8 mins).",
    greenSpaces: "The development is defined by its green space. It includes 13 acres of new parkland, wetlands, and open spaces, with two new parks and a pedestrianised piazza. Adjacent to the 90-acre Minet Country Park.",
    amenities: ["24-hour concierge", "Fully-equipped gym", "Swimming pool", "Spa", "Co-working space", "Private cinema", "Residents' lounge", "New primary school", "Cafés and retail spaces"],
    areaOverview: "This is where city living truly meets nature. The Green Quarter is one of London's most ambitious regeneration projects, transforming a former industrial area into a green oasis. Your lifestyle here revolves around wellness and the outdoors, with acres of parkland and canal towpaths on your doorstep for morning runs or evening strolls. Yet, you're not sacrificing city convenience; the Elizabeth Line means you can be in the heart of the West End in under 20 minutes. It's a vision of future London living: sustainable, connected, and surrounded by nature.",
    images: [
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/the-green-quarter/gallery/exteriors/the-green-quarter_exterior_12062025_1.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/the-green-quarter/gallery/exteriors/the-green-quarter_exterior_12062025_2.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/the-green-quarter/gallery/parkside-padel-club/the-green-quarter_parkside-club_12062025_1.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/the-green-quarter/gallery/parkside-padel-club/the-green-quarter_parkside-club_12062025_6.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/the-green-quarter/gallery/parkside-yards/the-green-quarter_parkside-yards_12062025_1.ashx"
    ]
  },
  {
    id: "kidbrooke-village-berkeley",
    name: "Kidbrooke Village",
    developer: "Berkeley Homes",
    zone: 3,
    location: "Kidbrooke / Royal Borough of Greenwich",
    postcode: "SE3 9ST",
    nearestTube: {
      station: "Kidbrooke",
      line: "Southeastern National Rail",
      walkTime: 5
    },
    coordinates: postcodeToCoords("SE3"),
    prices: {
      oneBed: "From £495,000",
      twoBed: "From £650,000",
      threeBed: "From £872,500",
      range: "£495k - £872.5k+"
    },
    tenure: "999-year leasehold",
    schools: ["Wingfield Primary School (Good)", "Harris Academy Greenwich (Outstanding)"],
    hospital: "Queen Elizabeth Hospital",
    transportScore: "Very Good — Direct trains from the on-site station reach London Bridge in 17 minutes and Charing Cross in 25 minutes, providing easy access to the City and West End.",
    greenSpaces: "Exceptional. The masterplan includes 136 acres of parks, wetlands, and open space. The award-winning Cator Park, with its wetlands and play areas, is at the heart of the community.",
    amenities: ["24-hour concierge", "Gym", "Swimming pool", "Cinema", "Business lounge", "Residents' dining room", "Supermarket", "Shops", "Café", "Doctor's surgery", "Schools"],
    areaOverview: "Welcome to a true London village. Kidbrooke Village is one of the capital's most acclaimed regeneration stories, creating a genuinely self-contained community. Life here is about balance – the peace and quiet of acres of parkland, combined with the convenience of an on-site station and shops. It's perfect for families and those seeking a calmer pace of life without sacrificing a London postcode. Weekends are for farmers' markets in the square, walks in the park, and knowing your neighbours.",
    images: [
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/kidbrooke-village/central-gardens---the-village-collection/gallery/kidbrooke-village_central-gardens_exterior1.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/kidbrooke-village/central-gardens---the-village-collection/gallery/kidbrooke-village_central-gardens_interior-kitchen2.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/kidbrooke-village/gallery/kidbrooke-village_central-gardens_interior_living_24072024.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/kidbrooke-village/gallery/kidbrooke-village_central-gardens_interior_bedroom2_24072024.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/kidbrooke-village/gallery/our-community/kidbrooke-village_our-community_image-1.ashx"
    ]
  },
  {
    id: "white-city-living-berkeley",
    name: "White City Living",
    developer: "Berkeley Homes",
    zone: 2,
    location: "White City / Hammersmith & Fulham",
    postcode: "W12 7RQ",
    nearestTube: {
      station: "White City / Wood Lane",
      line: "Central / Circle, Hammersmith & City",
      walkTime: 5
    },
    coordinates: postcodeToCoords("W12"),
    prices: {
      studio: "From £785,000",
      oneBed: "From £810,000",
      twoBed: "From £1,110,000",
      threeBed: "From £2,000,000",
      range: "£785k - £2M+"
    },
    tenure: "999-year leasehold",
    schools: ["St Stephen's C of E Primary (Outstanding)", "The Cardinal Vaughan Memorial RC School (Outstanding)"],
    hospital: "Hammersmith Hospital",
    transportScore: "Exceptional — Direct access to two tube stations and three tube lines provides phenomenal connectivity across London. The West End is just 12 minutes away on the Central Line.",
    greenSpaces: "Features 8 acres of landscaping, including a central water garden and connections to the adjacent 10-acre Hammersmith Park, which has Japanese gardens, a playground, and tennis courts.",
    amenities: ["24-hour concierge", "Extensive spa and pool facilities", "State-of-the-art gym", "Cinemas", "Business lounge", "Club lounge", "Adjacent to Westfield London"],
    areaOverview: "Live at the vibrant epicentre of West London's creative new hub. White City Living places you in the middle of everything. Your neighbours are the world-class shops and restaurants of Westfield, the groundbreaking ideas of Imperial College, and the creative energy of Television Centre. The lifestyle is pure convenience and luxury – from a morning workout in the residents' spa to an evening exploring the best retail on your doorstep. This is for those who want to be plugged into the dynamic, energetic pulse of modern London.",
    images: [
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/white-city-living/gallery/exterior/white-city-living---exterior-img1_11082025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/white-city-living/gallery/exterior/white-city-living---exterior-img2_11082025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/white-city-living/gallery/exterior/white-city-living---exterior-img3_11082025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/white-city-living/gallery/exterior/white-city-living---exterior-img4_11082025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/white-city-living/gallery/exterior/white-city-living-exterior-gallery-image-landscaping2-29032023.ashx"
    ]
  },
  {
    id: "london-dock-berkeley",
    name: "London Dock",
    developer: "Berkeley Homes",
    zone: 1,
    location: "Wapping / Tower Hamlets",
    postcode: "E1W 2AA",
    nearestTube: {
      station: "Tower Hill / Tower Gateway / Wapping",
      line: "District, Circle / DLR / Overground",
      walkTime: 12
    },
    coordinates: postcodeToCoords("E1W"),
    prices: {
      oneBed: "From £875,000",
      twoBed: "From £1,370,000",
      threeBed: "From £1,990,000",
      range: "£875k - £3M+"
    },
    tenure: "999-year leasehold",
    schools: ["St Paul's Whitechapel C of E Primary School (Outstanding)", "Mulberry School for Girls (Outstanding)"],
    hospital: "The Royal London Hospital",
    transportScore: "Excellent — Being in Zone 1 and a short walk from the City of London is a major advantage. Multiple transport links provide easy access to Canary Wharf, the West End, and City Airport.",
    greenSpaces: "The development features 7.5 acres of beautifully landscaped public space, including tree-lined promenades, water gardens, and Gauging Square with its interactive water features.",
    amenities: ["24-hour concierge", "'The Club' features a state-of-the-art gym", "Swimming pool and spa", "Virtual golf suite", "Squash court", "Private cinema"],
    areaOverview: "Discover a tranquil, sophisticated retreat right on the edge of the City. London Dock blends the area's rich maritime history with stunning contemporary design. The lifestyle here is about having a peaceful, waterside home just moments from the buzz of London's financial heart. Your weekends could be spent exploring the cobbled streets and historic pubs of Wapping, strolling to St Katharine Docks for lunch, or simply relaxing by the water gardens in Gauging Square. It's the perfect address for those who want to walk to work in the City and come home to a calming oasis.",
    images: [
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/london-dock/gallery/jade-wharf-showhome/london-dock_jade-wharf-sh_living-dining.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/london-dock/gallery/jade-wharf-showhome/london-dock_jade-wharf-sh_kitchen-dining.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/london-dock/gallery/facilities/london-dock_residents-fac_pool.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/london-dock/gallery/exterior/london-dock_exteriors_outside-grounds.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/london-dock/gallery/local-area/london-dock_local-area_dockyard.ashx"
    ]
  },
  {
    id: "camden-goods-yard-berkeley",
    name: "Camden Goods Yard",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Chalk Farm / Camden",
    postcode: "NW1 8AB",
    nearestTube: {
      station: "Chalk Farm / Camden Town",
      line: "Northern",
      walkTime: 7
    },
    coordinates: postcodeToCoords("NW1"),
    prices: {
      oneBed: "From £875,000",
      twoBed: "From £1,400,000",
      threeBed: "From £2,250,000",
      range: "£875k - £2.25M+"
    },
    tenure: "999-year leasehold",
    schools: ["Primrose Hill School (Outstanding)"],
    hospital: "Royal Free Hospital",
    transportScore: "Excellent — Superb Northern Line connections provide rapid access to the City and West End. King's Cross St. Pancras is just two stops away.",
    greenSpaces: "The development will create new rooftop gardens, courtyards, and public squares. It's perfectly located between the iconic green spaces of Regent's Park and Primrose Hill, both just a short walk away.",
    amenities: ["24-hour concierge", "'The Goods Yard' residents' club featuring a swimming pool", "Spa", "State-of-the-art gym", "Cinema", "Large new Morrisons supermarket", "Cafés and retail spaces"],
    areaOverview: "Imagine living where London's creative energy meets village-like charm. Camden Goods Yard places you at the crossroads of cool. Spend your mornings strolling up Primrose Hill for panoramic city views, your afternoons browsing the eclectic Camden Market, and your evenings catching a gig at The Roundhouse. This is a lifestyle of endless variety, with the tranquility of Regent's Park and the buzz of Camden Town on your doorstep. It's for those who want a sophisticated home in the heart of London's most vibrant cultural quarter.",
    images: [
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/camden-goods-yard/gallery/interiors/camden-goods-yard-interior-gallery-living-1_27082025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/camden-goods-yard/gallery/interiors/camden-goods-yard-interior-gallery-living-2_27082025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/camden-goods-yard/gallery/interiors/camden-goods-yard-interior-gallery-lounge-1_27082025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/camden-goods-yard/gallery/interiors/camden-goods-yard-interior-gallery-kitchen-details_27082025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/camden-goods-yard/gallery/interiors/camden-goods-yard-interior-gallery-kitchen-1_27082025.ashx"
    ]
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
    coordinates: { lat: 51.4760, lng: -0.1900 },
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
    zone: 2,
    location: "Oval / Kennington / Lambeth",
    postcode: "SE11 5SS",
    nearestTube: {
      station: "Oval / Vauxhall / Kennington",
      line: "Northern / Victoria, National Rail / Northern",
      walkTime: 10
    },
    coordinates: postcodeToCoords("SE11"),
    prices: {
      studio: "From £610,000",
      oneBed: "From £715,000",
      twoBed: "From £900,000",
      threeBed: "From £1,650,000",
      range: "£610k - £1.65M+"
    },
    tenure: "999-year leasehold",
    schools: ["Keyworth Primary (Good)"],
    hospital: "St Thomas' Hospital",
    transportScore: "Exceptional — Access to both the Northern and Victoria lines provides incredibly fast journeys across London. Being on the edge of Zone 1 makes it a walker's and cyclist's paradise.",
    greenSpaces: "A new, beautifully landscaped public park is at the heart of the development. It is also a short walk to the historic Kennington Park.",
    amenities: ["24-hour concierge", "Gym", "Swimming pool", "Spa", "Steam room", "Sauna", "Residents' lounge", "Private cinema", "New retail", "Café spaces", "Extensive co-working areas"],
    areaOverview: "Experience central London living with a unique sense of space and history. Oval Village offers a dynamic lifestyle where you can be in the West End in minutes, yet come home to a calming green oasis. Your weekends could involve watching world-class cricket at The Oval, exploring the trendy farmers' markets of Kennington, or jogging in the park. With its blend of historic landmarks and modern design, this is a sophisticated base for exploring everything the capital has to offer.",
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
    location: "Bermondsey / Southwark",
    postcode: "SE16 3RP",
    nearestTube: {
      station: "South Bermondsey / Bermondsey",
      line: "National Rail / Jubilee",
      walkTime: 8
    },
    coordinates: { lat: 51.4906, lng: -0.0673 },
    prices: {
      oneBed: "From £550,000",
      twoBed: "From £690,000",
      threeBed: "From £820,000",
      range: "£550k - £820k+"
    },
    tenure: "999-year leasehold",
    schools: ["Southwark Park Primary (Good)"],
    hospital: "Guy's Hospital",
    transportScore: "Very Good — The adjacent National Rail station gets you to London Bridge in just 4 minutes. The Jubilee line provides excellent access to Canary Wharf and the West End. The area is also set to benefit from the future Bakerloo Line extension.",
    greenSpaces: "Features landscaped gardens and new public realm. The large Southwark Park, with its boating lake and sports facilities, is just a short walk away.",
    amenities: ["24-hour concierge", "Residents' gym", "Communal gardens"],
    areaOverview: "Be part of London's next exciting chapter. Bermondsey Place puts you at the heart of a vibrant area that's rapidly transforming. The lifestyle is about discovery – exploring the independent breweries and food stalls of the famous Bermondsey Beer Mile, browsing the antique markets, or cycling to the creative hub of nearby Peckham. With London Bridge just one train stop away, you have incredible value and connectivity, getting in on the ground floor of an area with a bright future.",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "prince-of-wales-drive-berkeley",
    name: "Prince of Wales Drive",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Battersea / Wandsworth",
    postcode: "SW11 4FA",
    nearestTube: {
      station: "Battersea Power Station / Battersea Park / Queenstown Road",
      line: "Northern / National Rail / National Rail",
      walkTime: 7
    },
    coordinates: postcodeToCoords("SW11"),
    prices: {
      oneBed: "From £780,000",
      twoBed: "From £1,100,000",
      threeBed: "From £1,815,000",
      range: "£780k - £1.82M+"
    },
    tenure: "999-year leasehold",
    schools: ["Newton Prep (Outstanding)"],
    hospital: "Chelsea and Westminster",
    transportScore: "Exceptional — The Northern Line extension provides direct access to the City and West End. Two nearby National Rail stations offer quick links to Victoria and Waterloo.",
    greenSpaces: "Superb. The development is located directly opposite the 200-acre Battersea Park, offering a boating lake, sports facilities, and beautiful gardens as your extended front yard. The development itself has 2.5 acres of landscaped gardens.",
    amenities: ["24-hour concierge", "17m swimming pool and spa", "Rooftop terrace with panoramic views", "Residents' lounge"],
    areaOverview: "This is the ultimate blend of parkside tranquility and city sophistication. Prince of Wales Drive offers a lifestyle where your morning run is through one of London's most beautiful parks, and your evenings are spent exploring the world-class restaurants and shops at the regenerated Battersea Power Station. It's an elegant, established, and incredibly well-connected neighbourhood that gives you the best of both worlds: a green escape and a prime central London address.",
    images: [
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/prince-of-wales-drive/gallery/lifestyle/prince-of-wales-drive_lifestyle-1_10082022.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/prince-of-wales-drive/gallery/lifestyle/prince-of-wales-drive_lifestyle-2_10082022.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/prince-of-wales-drive/gallery/lifestyle/prince-of-wales-drive_lifestyle-3_10082022.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/prince-of-wales-drive/gallery/exterior/prince-of-wales-drive_exterior-1_29-11-2024.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/prince-of-wales-drive/gallery/lifestyle/prince-of-wales-drive_lifestyle-5_10082022.ashx"
    ]
  },
  {
    id: "west-end-gate-berkeley",
    name: "West End Gate",
    developer: "Berkeley Homes",
    zone: 1,
    location: "Marylebone / Paddington / City of Westminster",
    postcode: "W2 1JA",
    nearestTube: {
      station: "Edgware Road",
      line: "Circle, District, H&C, Bakerloo",
      walkTime: 1
    },
    coordinates: postcodeToCoords("W2"),
    prices: {
      studio: "From £925,000",
      oneBed: "From £1,115,000",
      twoBed: "From £1,750,000",
      range: "£925k - £1.75M+"
    },
    tenure: "999-year leasehold",
    schools: ["St Mary's Bryanston Sq (Outstanding)"],
    hospital: "St Mary's Hospital",
    transportScore: "Exceptional — With four tube lines on the doorstep, connectivity is phenomenal. Paddington (with Elizabeth Line and Heathrow Express) is a short walk away. The rest of London is quickly and easily accessible.",
    greenSpaces: "Features a central landscaped courtyard providing a private oasis for residents. The vast green spaces of Hyde Park and Regent's Park are both within a 15-minute walk.",
    amenities: ["24-hour concierge", "'The Avery Club' includes a swimming pool", "Spa", "State-of-the-art gym", "Business lounge", "Private cinema"],
    areaOverview: "Positioned on the edge of everything that makes London great. West End Gate offers prime central living with unparalleled convenience. The lifestyle is effortlessly luxurious. You're a short stroll from the chic boutiques of Marylebone High Street, the world-class theatres of the West End, the tranquil canals of Little Venice, and the open spaces of Hyde Park. With four tube lines outside your front door, the whole city is your playground. This is for those who desire a sophisticated home with London's finest experiences within immediate reach.",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "bow-green-berkeley",
    name: "Bow Green",
    developer: "Berkeley Homes",
    zone: 3,
    location: "Bow / Tower Hamlets",
    postcode: "E3 3LL",
    nearestTube: {
      station: "Bromley-by-Bow / Devons Road",
      line: "District, Hammersmith & City / DLR",
      walkTime: 5
    },
    coordinates: postcodeToCoords("E3"),
    prices: {
      oneBed: "From £490,000",
      twoBed: "From £650,000",
      threeBed: "From £780,000",
      range: "£490k - £780k+"
    },
    tenure: "999-year leasehold",
    schools: ["Bonner Primary School (Good)"],
    hospital: "Mile End Hospital",
    transportScore: "Excellent — The District and H&C lines offer easy access to the City and Westminster, while the DLR is a direct link to Canary Wharf (12 mins) and Stratford (7 mins).",
    greenSpaces: "The development is designed around a new central landscaped park and gardens. It is also a short walk from the historic Tower Hamlets Cemetery Park and a 15-minute walk to the Queen Elizabeth Olympic Park.",
    amenities: ["24-hour concierge", "Residents' gym", "Lounge", "Co-working spaces", "On-site cafés", "Shops", "Community spaces"],
    areaOverview: "Discover a green neighbourhood in the heart of East London's creative buzz. Bow Green offers a tranquil escape that's perfectly connected to the capital's key hubs. Your lifestyle here is about balance: peaceful morning walks in the park, easy commutes to Canary Wharf or the City, and vibrant weekends exploring the nearby canals of Hackney Wick or the Olympic Park. You're surrounded by history and character, but with all the comforts of a modern, design-led home. It's the ideal spot for those who want green space without giving up the energy of East London.",
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "wandsworth-mills-berkeley",
    name: "Wandsworth Mills",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Wandsworth",
    postcode: "SW18 1DE",
    nearestTube: {
      station: "Wandsworth Town",
      line: "National Rail",
      walkTime: 5
    },
    coordinates: postcodeToCoords("SW18"),
    prices: {
      range: "TBC (launching late 2025)"
    },
    tenure: "999-year leasehold",
    schools: ["Brandlehow Primary (Outstanding)"],
    hospital: "St George's Hospital",
    transportScore: "Very Good — National Rail services from Wandsworth Town reach Waterloo in just 14 minutes. The nearby River Bus pier also offers a scenic commute into the city.",
    greenSpaces: "The development will create new public squares and open up access to the River Wandle, with new riverside walkways. It is also a short walk to the expansive Wandsworth Park and Wandsworth Common.",
    amenities: ["Boutique hotel", "Gym", "Residents' facilities", "Shops", "Cafés", "Restaurants", "New microbrewery"],
    areaOverview: "Be part of the rebirth of a London icon. Wandsworth Mills is set to become one of Southwest London's most exciting new destinations. The lifestyle will be a vibrant mix of heritage and modern living, centred around a new public square filled with artisan food, craft beer from the on-site microbrewery, and boutique shops. You're moments from the charming pubs of Old York Road, the greenery of Wandsworth Park, and the bustling Southside shopping centre. It's a community for those who appreciate history, character, and a lively local scene.",
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "woodberry-down-berkeley",
    name: "Woodberry Down",
    developer: "Berkeley Homes",
    zone: 3,
    location: "Finsbury Park / Hackney",
    postcode: "N4 2SB",
    nearestTube: {
      station: "Manor House",
      line: "Piccadilly Line",
      walkTime: 7
    },
    coordinates: postcodeToCoords("N4"),
    prices: {
      oneBed: "From £580,000",
      twoBed: "From £750,000",
      threeBed: "From £1,100,000",
      range: "£580k - £1.1M+"
    },
    tenure: "999-year leasehold",
    schools: ["Parkwood Primary (Good)"],
    hospital: "Whittington Hospital",
    transportScore: "Excellent — The Piccadilly Line provides direct, fast access to King's Cross (10 mins), Covent Garden (16 mins), and Heathrow Airport. Finsbury Park station (Victoria, Piccadilly, National Rail) is also nearby.",
    greenSpaces: "Unparalleled for London. The development is set amongst 64 acres of open water (two large reservoirs) and 15 acres of parkland and landscaping. Finsbury Park is a 10-minute walk away.",
    amenities: ["24-hour concierge", "Luxury gym", "Swimming pool", "Spa facilities", "On-site Sainsbury's Local", "Cafés", "Community centre", "West Reservoir watersports facility"],
    areaOverview: "This is London's hidden nature reserve. Woodberry Down offers a lifestyle that feels a world away from the hustle of the city, yet you're only a short tube ride from the centre. Life here is lived by the water; morning coffees overlooking the reservoir, weekend afternoons spent sailing or kayaking, and evening strolls watching the birds. You're surrounded by an incredible sense of peace and openness. With the cool bars and restaurants of Stoke Newington and Finsbury Park nearby, it's a perfect home for those who want a city life with nature at its very core.",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "twelvetrees-park-berkeley",
    name: "TwelveTrees Park",
    developer: "Berkeley Homes",
    zone: 3,
    location: "West Ham / Newham",
    postcode: "E16 4GU",
    nearestTube: {
      station: "West Ham",
      line: "Jubilee, DLR, District, Hammersmith & City, c2c National Rail",
      walkTime: 2
    },
    coordinates: postcodeToCoords("E16"),
    prices: {
      studio: "From £460,000",
      oneBed: "From £530,000",
      twoBed: "From £695,000",
      range: "£460k - £695k+"
    },
    tenure: "999-year leasehold",
    schools: ["Colegrave Primary (Outstanding)"],
    hospital: "Newham University Hospital",
    transportScore: "Exceptional — West Ham is one of the best-connected stations in London. The Jubilee Line offers rapid access to Canary Wharf (4 mins) and Bond Street (17 mins). The DLR, District, and H&C lines provide numerous other direct routes across the capital.",
    greenSpaces: "The development is centered around a new 4.5-acre park (the 'Linear Park'), with extensive landscaping, gardens, and play areas throughout the 26-acre site. It is also close to the Queen Elizabeth Olympic Park.",
    amenities: ["24-hour concierge", "Gym", "Swimming pool", "Private cinema", "Business/residents' lounge", "New secondary school", "Community hub", "Shops", "Cafés", "Large supermarket"],
    areaOverview: "Live at the centre of your own universe. TwelveTrees Park is all about connection. It's built for a fast-paced London lifestyle, where you can get anywhere you need to be, effortlessly. From a quick hop to Canary Wharf for work, to a shopping spree at Westfield Stratford, or a night out in the West End, it's all just minutes away. But it's not just a transport hub; a huge new park and on-site amenities mean you can just as easily stay local and enjoy a relaxed weekend. It's the perfect launchpad for anyone who wants to experience everything London has to offer.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "alexandra-gate-berkeley",
    name: "Alexandra Gate",
    developer: "Berkeley Homes",
    zone: 3,
    location: "Haringey",
    postcode: "N8 0ES",
    nearestTube: {
      station: "Alexandra Palace / Hornsey / Bowes Park / Wood Green",
      line: "Great Northern / Piccadilly",
      walkTime: 10
    },
    coordinates: { lat: 51.5904, lng: -0.1218 },
    prices: {
      studio: "From £435,000",
      oneBed: "From £435,000",
      twoBed: "From £590,000",
      range: "£435k - £650k"
    },
    tenure: "999-year leasehold",
    schools: ["Alexandra Park School (Outstanding)"],
    hospital: "North Middlesex Hospital",
    transportScore: "Very Good — Short walk to four key Zone 3 stations providing excellent connectivity. King's Cross is just 10 minutes by train with direct services from Alexandra Palace.",
    greenSpaces: "Located beside the iconic Alexandra Park and Alexandra Palace, offering extensive green space, stunning city views, and recreational facilities.",
    amenities: ["'The Park Club' residents' facilities", "Gym", "Swimming pool", "Spa facilities", "Sauna", "Steam room", "Meeting spaces", "Community lounge", "Waterside Café", "On-site retail coming soon"],
    areaOverview: "Experience the best of both worlds: a brand-new, premium home beside one of London's most iconic landmarks. Alexandra Gate offers a sophisticated lifestyle where everything you need is on your doorstep. Your weekend could start with a walk through Alexandra Park, followed by brunch at the on-site café, and then an easy trip into Central London. It's a life of ultimate convenience in a thriving neighbourhood with spectacular views and green space on your doorstep.",
    images: [
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/alexandra-gate/gallery/alexandra-gate-the-park-club-image-1_28042025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/alexandra-gate/gallery/alexandra-gate-the-park-club-image-10_28042025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/alexandra-gate/gallery/alexandra-gate-the-park-club-image-11_28042025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/alexandra-gate/gallery/alexandra-gate-the-park-club-image-3_28042025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/alexandra-gate/gallery/alexandra-gate-the-park-club-image-4_28042025.ashx"
    ]
  },
  {
    id: "grand-union-berkeley",
    name: "Grand Union",
    developer: "Berkeley Homes",
    zone: 4,
    location: "Alperton / Brent",
    postcode: "HA0 1NW",
    nearestTube: {
      station: "Stonebridge Park / Alperton",
      line: "Bakerloo Line, Overground / Piccadilly Line",
      walkTime: 12
    },
    coordinates: postcodeToCoords("HA0"),
    prices: {
      studio: "From £425,000",
      oneBed: "From £495,000",
      twoBed: "From £635,000",
      threeBed: "From £795,000",
      range: "£425k - £795k+"
    },
    tenure: "999-year leasehold",
    schools: ["Ark Academy (Outstanding)"],
    hospital: "Central Middlesex Hospital",
    transportScore: "Good — The Bakerloo and Piccadilly lines offer direct routes into Central London. Wembley Stadium and the London Designer Outlet are just a short journey away.",
    greenSpaces: "A key feature of the development is the 11 acres of new public green space, including landscaped gardens, riverside meadows, and walkways along the Grand Union Canal and River Brent.",
    amenities: ["24-hour concierge", "'The Union Club' includes a gym", "Swimming pool", "Sauna and steam room", "Treatment room", "Residents' lounge", "Community Hub", "Bowling alley", "Creative workspaces", "Nursery", "Canalside piazza with shops and cafés"],
    areaOverview: "Discover London's new creative waterside village. Grand Union is a destination in the making, transforming an underused area into a vibrant community hub. The lifestyle here is active and social, built around the canal. Spend weekends kayaking, cycling the towpaths, or meeting friends at the canalside cafés. With a bowling alley, creative studios, and extensive gardens on-site, there's a real sense of community. It's an opportunity to be part of a forward-thinking neighbourhood that blends industrial heritage with a modern, wellness-focused way of life.",
    images: [
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/grand-union/gallery/life-at-grand-union/grand-union---gallery-life-at-image-1_12062025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/grand-union/gallery/life-at-grand-union/grand-union---gallery-life-at-image-2_12062025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/grand-union/gallery/life-at-grand-union/grand-union---gallery-life-at-image-3_12062025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/grand-union/gallery/life-at-grand-union/grand-union---gallery-life-at-image-4_12062025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/grand-union/gallery/life-at-grand-union/grand-union---gallery-life-at-image-5_12062025.ashx"
    ]
  },
  {
    id: "silkstream-berkeley",
    name: "Silkstream",
    developer: "Berkeley Homes",
    zone: 4,
    location: "Hendon / Barnet",
    postcode: "NW9 6FB",
    nearestTube: {
      station: "Hendon / Hendon Central",
      line: "National Rail / Northern Line",
      walkTime: 7
    },
    coordinates: { lat: 51.5889, lng: -0.2265 },
    prices: {
      studio: "From £399,000",
      oneBed: "From £465,000",
      twoBed: "From £595,000",
      threeBed: "From £799,000",
      range: "£399k - £799k+"
    },
    tenure: "999-year leasehold",
    schools: ["St Joseph's Catholic Primary (Outstanding)"],
    hospital: "Royal Free Hospital",
    transportScore: "Very Good — National Rail offers a fast 16-minute journey to St Pancras International. The Northern Line provides 24-hour service and direct access to both the City and West End branches.",
    greenSpaces: "The development is set within 1.5 acres of its own landscaped gardens and sits alongside the Silk Stream river. The 150-acre Brent Reservoir (The Welsh Harp) and its nature reserve are just a short walk away, offering extensive walks and sailing.",
    amenities: ["24-hour concierge", "'The Silk Club' includes a gym", "Swimming pool", "Spa facilities", "Screening room", "Virtual golf suite"],
    areaOverview: "Find your green sanctuary in North London. Silkstream offers a peaceful retreat with the city still within easy reach. The lifestyle is one of relaxation and convenience. Enjoy tranquil walks along the river, explore the vast open space of the nearby reservoir, or simply unwind in the residents' spa. When you need the excitement of the city, the Northern Line and fast rail links are minutes away. With the huge transformation of Brent Cross happening nearby, you're investing in an area with a very bright future. It's the perfect home for balancing a busy work life with a need for nature.",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "lombard-square-berkeley",
    name: "Lombard Square",
    developer: "Berkeley Homes",
    zone: 4,
    location: "Plumstead / Royal Borough of Greenwich",
    postcode: "SE18 6FR",
    nearestTube: {
      station: "Plumstead / Woolwich",
      line: "Southeastern, Elizabeth Line / Southeastern, DLR, Elizabeth Line",
      walkTime: 10
    },
    coordinates: postcodeToCoords("SE18"),
    prices: {
      oneBed: "From £425,000",
      twoBed: "From £540,000",
      threeBed: "From £650,000",
      range: "£425k - £650k+"
    },
    tenure: "999-year leasehold",
    schools: ["St Patrick's Catholic Primary (Good)"],
    hospital: "Queen Elizabeth Hospital",
    transportScore: "Excellent — The arrival of the Elizabeth Line at nearby Woolwich has been transformative, offering incredibly fast journeys to Canary Wharf (8 mins), Liverpool Street (14 mins), and Heathrow Airport.",
    greenSpaces: "The development is designed around a new public square and four private landscaped courtyard gardens, creating a series of green oases. The vast green spaces of Plumstead Common and Winn's Common are just a short walk away.",
    amenities: ["24-hour concierge", "Residents' gym", "Lounge", "Co-working spaces", "Space for new on-site shops and cafés"],
    areaOverview: "Be part of Southeast London's exciting transformation. Lombard Square offers modern, connected living in an area that's on the rise. Thanks to the Elizabeth Line, this part of London has never been better connected, making it a smart choice for professionals and investors. The lifestyle is about enjoying great value without compromising on quality or commute time. Explore the historic Royal Arsenal in Woolwich, with its new restaurants and cultural venues, or enjoy the peaceful, green expanse of Plumstead Common. It's a chance to get into a thriving, well-connected community.",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "beaufort-park-berkeley",
    name: "Beaufort Park",
    developer: "Berkeley Homes",
    zone: 4,
    location: "Colindale / Barnet",
    postcode: "NW9 5EN",
    nearestTube: {
      station: "Colindale",
      line: "Northern",
      walkTime: 7
    },
    coordinates: { lat: 51.5835, lng: -0.2480 },
    prices: {
      range: "From £410k (new-phase apartments)"
    },
    tenure: "999-year leasehold",
    schools: ["The Orion Primary (Outstanding)"],
    hospital: "Royal Free Hospital",
    transportScore: "Very Good — The Northern Line provides direct 24-hour service to Central London (King's Cross in 25 mins, Leicester Square in 30 mins). The station itself has recently been modernised and upgraded.",
    greenSpaces: "Features 8 acres of beautifully maintained, award-winning landscaped parkland, private courtyards, and tree-lined boulevards, creating a green and pleasant environment throughout the development.",
    amenities: ["'The Spa' with a large swimming pool", "State-of-the-art gym", "Sauna and steam room", "Numerous shops", "Restaurants", "Cafés", "Tesco Express", "Medical centre", "Dental surgery", "Nursery"],
    areaOverview: "Welcome to the complete modern village. Beaufort Park is more than just a place to live; it's a fully-formed community where everything you need is right on your doorstep. The lifestyle is one of ultimate convenience. Start your day at the residents' gym, grab a coffee from the on-site café, and do your shopping without ever leaving the development. With its tree-lined streets, friendly atmosphere, and direct line into central London, it offers a relaxed, safe, and social environment. It's the perfect choice for those who want the buzz of a community and the ease of having it all in one place.",
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "trent-park-berkeley",
    name: "Trent Park",
    developer: "Berkeley Homes",
    zone: 5,
    location: "Oakwood / Enfield",
    postcode: "EN4 0PS",
    nearestTube: {
      station: "Oakwood / Cockfosters",
      line: "Piccadilly",
      walkTime: 25
    },
    coordinates: postcodeToCoords("EN4"),
    prices: {
      oneBed: "From £595,000",
      twoBed: "From £750,000 (Apartments) / From £1,200,000 (Houses)",
      threeBed: "From £1,050,000 (Apartments) / From £1,600,000 (Houses)",
      range: "£595k - £1.6M+"
    },
    tenure: "Freehold (Houses) & 999-year Leasehold (Apartments)",
    schools: ["Trent CofE Primary (Outstanding)"],
    hospital: "Chase Farm Hospital",
    transportScore: "Good — The Piccadilly Line provides a direct and reliable service into Central London (King's Cross in 27 mins). The M25 is also easily accessible by car.",
    greenSpaces: "Unrivalled. The development is set within 56 acres of private grounds, which itself is surrounded by over 400 acres of Trent Country Park, a former royal hunting ground. Residents have access to lawns, historic walled gardens, and ancient woodland.",
    amenities: ["The Lawn Club provides residents with an open-air swimming pool", "State-of-the-art gym", "Tennis courts", "Shuttle bus service", "Restored Mansion House with exclusive apartments and further facilities"],
    areaOverview: "Live in London's country estate. Trent Park offers a lifestyle that is simply not found anywhere else in the capital. This is for those who dream of country living – the vast open spaces, the peace and quiet, the connection to nature – but don't want to leave London. Your daily life is set against a backdrop of ancient woodland and historic architecture. Weekends are for long walks in the park, a game of tennis, or a swim in the outdoor pool. It's an escape, a sanctuary, and a truly unique place to call home, all while remaining on the Tube map.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "heron-wharf-berkeley",
    name: "Heron Wharf (Poplar Riverside)",
    developer: "Berkeley Homes",
    zone: 3,
    location: "Poplar / Tower Hamlets",
    postcode: "E14 0JW",
    nearestTube: {
      station: "Canning Town / East India",
      line: "Jubilee, DLR / DLR",
      walkTime: 10
    },
    coordinates: postcodeToCoords("E14-LL"),
    prices: {
      studio: "From £480,000",
      oneBed: "From £570,000",
      twoBed: "From £715,000",
      threeBed: "From £875,000",
      range: "£480k - £875k+"
    },
    tenure: "999-year leasehold",
    schools: ["Culloden Primary (Outstanding)"],
    hospital: "The Royal London",
    transportScore: "Excellent — The Jubilee Line at Canning Town provides superb connections to Canary Wharf (4 mins), London Bridge (10 mins), and the West End. The DLR links directly to the City and City Airport.",
    greenSpaces: "A new 2.5-acre public park is the centrepiece of the development, running down to the river. A new riverside walkway will also be created, connecting to the wider Leamouth Peninsula.",
    amenities: ["24-hour concierge", "'The Riverside Club' includes a large swimming pool with panoramic river views", "Spa", "Gym", "Residents' lounge", "Private cinema", "New riverside pub", "Cafés and shops"],
    areaOverview: "Discover East London's new riverside destination. Poplar Riverside is perfectly placed between the financial might of Canary Wharf and the creative energy of the Royal Docks. The lifestyle is about enjoying stunning river views and beautiful green spaces, without losing your connection to the city. Imagine morning runs along the new promenade, weekends exploring nearby Trinity Buoy Wharf, and evenings watching the lights of the O2 from the residents' pool. It's a bold vision for modern, green, riverside living.",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/250-city-road/gallery/exteriors/250-city-road_exterior.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/250-city-road/gallery/exteriors/250-city-road-exterior-18012022-1.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/250-city-road/gallery/exteriors/250-city-road-exterior-18012022-2.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/250-city-road/gallery/exteriors/250-city-road-exterior-18012022-3.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/250-city-road/gallery/exteriors/250-city-road-exterior-18012022-4.ashx"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ]
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
    images: [
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/fulham-reach/palmer-house/gallery/fulham-reach_palmer-house_exterior1.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/fulham-reach/palmer-house/gallery/fulham-reach_palmer-house_exterior2.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/fulham-reach/palmer-house/gallery/fulham-reach_palmer-house_exterior3.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/fulham-reach/palmer-house/gallery/exteriors/fulham-reach_exterior_image-2_26102023.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/fulham-reach/palmer-house/gallery/exteriors/fulham-reach_palmer-house_exterior2.ashx"
    ]
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
    coordinates: { lat: 51.4757, lng: -0.1835 },
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
    images: [
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/chelsea-creek/gallery/the-doulton-collection-showhome/chelsea-creek_the-doulton-collection-showhome-img1_03072025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/chelsea-creek/gallery/the-doulton-collection-showhome/chelsea-creek_the-doulton-collection-showhome-img2_03072025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/chelsea-creek/gallery/the-doulton-collection-showhome/chelsea-creek_the-doulton-collection-showhome-img3_03072025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/chelsea-creek/gallery/the-doulton-collection-showhome/chelsea-creek_the-doulton-collection-showhome-img4_03072025.ashx",
      "https://www.berkeleygroup.co.uk/-/media/migration/berkeley-group/developments/chelsea-creek/gallery/the-doulton-collection-showhome/chelsea-creek_the-doulton-collection-showhome-img9_03072025.ashx"
    ]
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
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
    ]
  }
];

// Property of the Week
export const propertyOfTheWeek = {
  development: developments.find(d => d.id === "south-quay-plaza-berkeley")!,
  floorplanUrl: "https://example.com/south-quay-floorplan.pdf"
};
