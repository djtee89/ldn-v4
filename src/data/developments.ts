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
  schools: {
    outstanding: string[];
    private: string[];
  };
  universities: {
    name: string;
    distance: string;
  }[];
  prices: {
    oneBed: string;
    twoBed: string;
    threeBed: string;
  };
  investment: {
    yield: string;
    serviceCharge: string;
  };
  amenities: string[];
  greenSpaceScore: number;
  hospital: string;
  chineseSupermarket: string;
  areaOverview: string;
  images: string[];
}

export const developments: Development[] = [
  // Berkeley Group Developments
  {
    id: "oval-village",
    name: "Oval Village",
    developer: "Berkeley Homes",
    zone: 1,
    location: "Oval, SE11",
    postcode: "SE11 5SS",
    nearestTube: {
      station: "Oval",
      line: "Northern",
      walkTime: 5
    },
    coordinates: {
      lat: 51.4816,
      lng: -0.1134
    },
    schools: {
      outstanding: ["Archbishop Tenison's School"],
      private: ["Dulwich College"]
    },
    universities: [
      { name: "KCL", distance: "20 mins" },
      { name: "LSE", distance: "25 mins" },
      { name: "UCL", distance: "30 mins" },
      { name: "Imperial", distance: "35 mins" }
    ],
    prices: {
      oneBed: "£595k",
      twoBed: "£820k",
      threeBed: "£1.45m"
    },
    investment: {
      yield: "4.2-4.8%",
      serviceCharge: "~£6.20 psf pa"
    },
    amenities: ["24/7 Concierge", "Gym", "Residents' Lounge", "Landscaped Gardens"],
    greenSpaceScore: 4,
    hospital: "St Thomas' Hospital",
    chineseSupermarket: "15 mins",
    areaOverview: "Zone 1 location with excellent transport links and green spaces nearby.",
    images: [
      "/src/assets/oval-village-1.png",
      "/src/assets/oval-village-2.png",
      "/src/assets/oval-village-3.png",
      "/src/assets/oval-village-4.png",
      "/src/assets/oval-village-5.png",
      "/src/assets/oval-village-6.png",
      "/src/assets/oval-village-7.png",
      "/src/assets/oval-village-8.png"
    ]
  },
  {
    id: "london-dock",
    name: "London Dock",
    developer: "St George",
    zone: 1,
    location: "Wapping, E1W",
    postcode: "E1W 1AT",
    nearestTube: {
      station: "Tower Hill",
      line: "District, Circle",
      walkTime: 10
    },
    coordinates: {
      lat: 51.5044,
      lng: -0.0556
    },
    schools: {
      outstanding: ["Mulberry School for Girls"],
      private: ["Tower House School"]
    },
    universities: [
      { name: "QMUL", distance: "8 mins" },
      { name: "UCL", distance: "20 mins" },
      { name: "KCL", distance: "15 mins" },
      { name: "LSE", distance: "18 mins" }
    ],
    prices: {
      oneBed: "£658k",
      twoBed: "£1.3m",
      threeBed: "£2.2m"
    },
    investment: {
      yield: "4.2-4.8%",
      serviceCharge: "~£6.80 psf pa"
    },
    amenities: ["24/7 Concierge", "Gym", "Spa", "Cinema", "Business Lounge"],
    greenSpaceScore: 3,
    hospital: "The Royal London Hospital",
    chineseSupermarket: "15 mins",
    areaOverview: "Historic riverside location with stunning Thames views and excellent transport links to the City.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "bermondsey-place",
    name: "Bermondsey Place",
    developer: "Berkeley Homes",
    zone: 2,
    location: "Bermondsey, SE1",
    postcode: "SE1 3UN",
    nearestTube: {
      station: "South Bermondsey",
      line: "National Rail",
      walkTime: 3
    },
    coordinates: {
      lat: 51.4926,
      lng: -0.0673
    },
    schools: {
      outstanding: ["Harris Academy Bermondsey"],
      private: ["Dulwich College"]
    },
    universities: [
      { name: "KCL", distance: "25 mins" },
      { name: "UCL", distance: "30 mins" },
      { name: "LSE", distance: "28 mins" }
    ],
    prices: {
      oneBed: "£500k",
      twoBed: "£630k",
      threeBed: "POA"
    },
    investment: {
      yield: "5.0-5.5%",
      serviceCharge: "~£5.80 psf pa"
    },
    amenities: ["Concierge", "Gym", "Communal Gardens"],
    greenSpaceScore: 3,
    hospital: "Guy's Hospital",
    chineseSupermarket: "20 mins",
    areaOverview: "Up-and-coming area with good transport links and development potential.",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "250-city-road",
    name: "250 City Road",
    developer: "Berkeley Homes",
    zone: 1,
    location: "Islington, EC1V",
    postcode: "EC1V 2QH",
    nearestTube: {
      station: "Angel",
      line: "Northern",
      walkTime: 7
    },
    coordinates: {
      lat: 51.5322,
      lng: -0.1035
    },
    schools: {
      outstanding: ["Central Foundation Boys' School"],
      private: ["City of London School"]
    },
    universities: [
      { name: "UCL", distance: "12 mins" },
      { name: "KCL", distance: "20 mins" },
      { name: "LSE", distance: "22 mins" }
    ],
    prices: {
      oneBed: "POA",
      twoBed: "POA",
      threeBed: "POA"
    },
    investment: {
      yield: "4.0-4.5%",
      serviceCharge: "~£8.00 psf pa"
    },
    amenities: ["24/7 Concierge", "Gym", "Sky Lounge"],
    greenSpaceScore: 3,
    hospital: "Moorfields Eye Hospital",
    chineseSupermarket: "10 mins",
    areaOverview: "Prime Zone 1 location with excellent transport connections.",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "camden-goods-yard",
    name: "Camden Goods Yard",
    developer: "St George",
    zone: 2,
    location: "Camden, NW1",
    postcode: "NW1 0AG",
    nearestTube: {
      station: "Chalk Farm",
      line: "Northern",
      walkTime: 5
    },
    coordinates: {
      lat: 51.5414,
      lng: -0.1426
    },
    schools: {
      outstanding: ["Camden School for Girls"],
      private: ["UCS Hampstead"]
    },
    universities: [
      { name: "UCL", distance: "10 mins" },
      { name: "LSE", distance: "15 mins" },
      { name: "KCL", distance: "15 mins" },
      { name: "Imperial", distance: "25 mins" }
    ],
    prices: {
      oneBed: "£945k",
      twoBed: "£1.45m",
      threeBed: "£2.1m"
    },
    investment: {
      yield: "4-4.5%",
      serviceCharge: "~£7.50 psf pa"
    },
    amenities: ["Concierge", "Gym", "Pool", "Lounge"],
    greenSpaceScore: 5,
    hospital: "UCL Hospital",
    chineseSupermarket: "20 mins",
    areaOverview: "Trendy Zone 2 location with excellent transport, vibrant lifestyle, and strong student demand.",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "kidbrooke-village",
    name: "Kidbrooke Village",
    developer: "Berkeley Homes",
    zone: 3,
    location: "Greenwich, SE3",
    postcode: "SE3 9LL",
    nearestTube: {
      station: "Kidbrooke",
      line: "National Rail",
      walkTime: 2
    },
    coordinates: {
      lat: 51.4639,
      lng: 0.0269
    },
    schools: {
      outstanding: ["Harris Academy Greenwich"],
      private: ["Blackheath High School"]
    },
    universities: [
      { name: "Greenwich", distance: "15 mins" },
      { name: "KCL", distance: "30 mins" },
      { name: "UCL", distance: "35 mins" },
      { name: "LSE", distance: "33 mins" }
    ],
    prices: {
      oneBed: "£350k",
      twoBed: "£620k",
      threeBed: "£800k"
    },
    investment: {
      yield: "5.8-6.5%",
      serviceCharge: "~£4.80 psf pa"
    },
    amenities: ["Village Square", "Gym", "Community Centre", "Retail Plaza"],
    greenSpaceScore: 5,
    hospital: "Queen Elizabeth Hospital",
    chineseSupermarket: "25 mins",
    areaOverview: "Award-winning sustainable community with excellent schools, green spaces and growing transport links.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "royal-arsenal-riverside",
    name: "Royal Arsenal Riverside",
    developer: "Berkeley Homes",
    zone: 4,
    location: "Woolwich, SE18",
    postcode: "SE18 6GP",
    nearestTube: {
      station: "Woolwich",
      line: "Elizabeth Line, DLR",
      walkTime: 3
    },
    coordinates: {
      lat: 51.4906,
      lng: 0.0669
    },
    schools: {
      outstanding: ["St Mary Magdalene School"],
      private: ["Blackheath High School"]
    },
    universities: [
      { name: "Greenwich", distance: "5 mins" },
      { name: "KCL", distance: "35 mins" },
      { name: "UCL", distance: "40 mins" },
      { name: "LSE", distance: "38 mins" }
    ],
    prices: {
      oneBed: "£600k",
      twoBed: "£750k",
      threeBed: "£915k"
    },
    investment: {
      yield: "6.5-7.2%",
      serviceCharge: "~£4.20 psf pa"
    },
    amenities: ["Concierge", "Gym", "Riverside Gardens", "Heritage Museum"],
    greenSpaceScore: 5,
    hospital: "Queen Elizabeth Hospital",
    chineseSupermarket: "30 mins",
    areaOverview: "Historic riverside development with excellent value and Elizabeth Line connectivity.",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
    ]
  },
  // Mount Anvil Developments
  {
    id: "the-fountainhead",
    name: "The Fountainhead",
    developer: "Mount Anvil",
    zone: 1,
    location: "St James's Park, SW1",
    postcode: "SW1H 0BD",
    nearestTube: {
      station: "St James's Park",
      line: "District, Circle",
      walkTime: 1
    },
    coordinates: {
      lat: 51.4993,
      lng: -0.1347
    },
    schools: {
      outstanding: ["Westminster School"],
      private: ["Westminster School"]
    },
    universities: [
      { name: "KCL", distance: "15 mins" },
      { name: "UCL", distance: "20 mins" },
      { name: "LSE", distance: "10 mins" },
      { name: "Imperial", distance: "25 mins" }
    ],
    prices: {
      oneBed: "POA",
      twoBed: "£3.95m",
      threeBed: "£5.5m"
    },
    investment: {
      yield: "3.0-3.5%",
      serviceCharge: "~£12.00 psf pa"
    },
    amenities: ["24/7 Concierge", "Private Gym", "Wine Cellar", "Roof Terrace"],
    greenSpaceScore: 5,
    hospital: "St Thomas' Hospital",
    chineseSupermarket: "15 mins",
    areaOverview: "Ultra-prime central London location with unparalleled access to government and finance.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "the-bellamy",
    name: "The Bellamy",
    developer: "Mount Anvil",
    zone: 2,
    location: "Canary Wharf, E14",
    postcode: "E14 9QS",
    nearestTube: {
      station: "Canary Wharf",
      line: "Jubilee, Elizabeth Line",
      walkTime: 5
    },
    coordinates: {
      lat: 51.5054,
      lng: -0.0235
    },
    schools: {
      outstanding: ["Canary Wharf College"],
      private: ["Tower House School"]
    },
    universities: [
      { name: "QMUL", distance: "10 mins" },
      { name: "UCL", distance: "25 mins" },
      { name: "KCL", distance: "20 mins" },
      { name: "LSE", distance: "22 mins" }
    ],
    prices: {
      oneBed: "£550k",
      twoBed: "£750k",
      threeBed: "£1.1m"
    },
    investment: {
      yield: "4.5-5.0%",
      serviceCharge: "~£7.20 psf pa"
    },
    amenities: ["24/7 Concierge", "Gym", "Business Lounge", "Roof Garden"],
    greenSpaceScore: 3,
    hospital: "The Royal London Hospital",
    chineseSupermarket: "10 mins",
    areaOverview: "Heart of London's financial district with excellent transport and amenities.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "chelsea-botanica",
    name: "Chelsea Botanica",
    developer: "Mount Anvil",
    zone: 2,
    location: "Fulham, SW6",
    postcode: "SW6 2SU",
    nearestTube: {
      station: "Imperial Wharf",
      line: "Overground",
      walkTime: 3
    },
    coordinates: {
      lat: 51.4746,
      lng: -0.1901
    },
    schools: {
      outstanding: ["The London Oratory School"],
      private: ["Fulham Prep School"]
    },
    universities: [
      { name: "Imperial", distance: "20 mins" },
      { name: "KCL", distance: "25 mins" },
      { name: "UCL", distance: "30 mins" },
      { name: "LSE", distance: "32 mins" }
    ],
    prices: {
      oneBed: "£800k",
      twoBed: "£1.2m",
      threeBed: "POA"
    },
    investment: {
      yield: "3.8-4.2%",
      serviceCharge: "~£8.50 psf pa"
    },
    amenities: ["24/7 Concierge", "Gym", "Botanical Gardens", "Private Cinema"],
    greenSpaceScore: 5,
    hospital: "Chelsea & Westminster",
    chineseSupermarket: "20 mins",
    areaOverview: "Prestigious Chelsea location with beautiful botanical gardens and river access.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop"
    ]
  },
  // Barratt London Developments
  {
    id: "bermondsey-heights",
    name: "Bermondsey Heights",
    developer: "Barratt London",
    zone: 2,
    location: "Bermondsey, SE15",
    postcode: "SE15 1LE",
    nearestTube: {
      station: "South Bermondsey",
      line: "National Rail",
      walkTime: 8
    },
    coordinates: {
      lat: 51.4845,
      lng: -0.0521
    },
    schools: {
      outstanding: ["Harris Academy Bermondsey"],
      private: ["Dulwich College"]
    },
    universities: [
      { name: "KCL", distance: "20 mins" },
      { name: "UCL", distance: "25 mins" },
      { name: "LSE", distance: "25 mins" },
      { name: "QMUL", distance: "18 mins" }
    ],
    prices: {
      oneBed: "£447k",
      twoBed: "POA",
      threeBed: "£742k"
    },
    investment: {
      yield: "5.2-5.8%",
      serviceCharge: "~£5.20 psf pa"
    },
    amenities: ["Concierge", "Gym", "Communal Gardens"],
    greenSpaceScore: 4,
    hospital: "Guy's Hospital",
    chineseSupermarket: "18 mins",
    areaOverview: "Emerging area with strong regeneration and good value for money.",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "royal-gateway",
    name: "Royal Gateway",
    developer: "Barratt London",
    zone: 3,
    location: "Acton, W3",
    postcode: "W3 0DS",
    nearestTube: {
      station: "North Acton",
      line: "Central, Elizabeth Line",
      walkTime: 5
    },
    coordinates: {
      lat: 51.5177,
      lng: -0.2597
    },
    schools: {
      outstanding: ["Ark Byron Primary Academy"],
      private: ["The Mall School"]
    },
    universities: [
      { name: "Imperial", distance: "25 mins" },
      { name: "UCL", distance: "30 mins" },
      { name: "KCL", distance: "35 mins" },
      { name: "LSE", distance: "35 mins" }
    ],
    prices: {
      oneBed: "£475k",
      twoBed: "POA",
      threeBed: "£1.5m"
    },
    investment: {
      yield: "5.0-5.5%",
      serviceCharge: "~£5.80 psf pa"
    },
    amenities: ["Concierge", "Gym", "Roof Gardens"],
    greenSpaceScore: 4,
    hospital: "Central Middlesex Hospital",
    chineseSupermarket: "15 mins",
    areaOverview: "Well-connected location with Elizabeth Line access and excellent value.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "wembley-park-gardens",
    name: "Wembley Park Gardens",
    developer: "Barratt London",
    zone: 4,
    location: "Wembley, HA9",
    postcode: "HA9 0FD",
    nearestTube: {
      station: "Wembley Park",
      line: "Jubilee, Metropolitan",
      walkTime: 2
    },
    coordinates: {
      lat: 51.5635,
      lng: -0.2792
    },
    schools: {
      outstanding: ["Ark Academy"],
      private: ["North London Collegiate School"]
    },
    universities: [
      { name: "UCL", distance: "35 mins" },
      { name: "Imperial", distance: "40 mins" },
      { name: "KCL", distance: "45 mins" },
      { name: "LSE", distance: "40 mins" }
    ],
    prices: {
      oneBed: "£434k",
      twoBed: "£641k",
      threeBed: "POA"
    },
    investment: {
      yield: "5.5-6.0%",
      serviceCharge: "~£4.80 psf pa"
    },
    amenities: ["Concierge", "Gym", "Communal Gardens", "Retail"],
    greenSpaceScore: 4,
    hospital: "Northwick Park Hospital",
    chineseSupermarket: "20 mins",
    areaOverview: "Major regeneration area with excellent transport and entertainment facilities.",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop"
    ]
  }
];

// Property of the Week
export const propertyOfTheWeek = {
  development: developments.find(d => d.id === "the-fountainhead")!,
  floorplanUrl: "https://example.com/fountainhead-floorplan.pdf"
};