export interface BestDeal {
  developer: string;
  developmentId: string;
  developmentName: string;
  unitNumber: string;
  price: string;
  priceNumeric: number;
  beds: number;
  sqft: number;
  pricePerSqft: number;
  image: string;
  floorplanImage?: string;
  salesPitch: string;
  whyBestDeal: string[];
  availableUntil?: string;
}

export const bestDeals: BestDeal[] = [
  {
    developer: "Argent",
    developmentId: "camden-goods-yard",
    developmentName: "Camden Goods Yard",
    unitNumber: "B-304",
    price: "£695,000",
    priceNumeric: 695000,
    beds: 2,
    sqft: 750,
    pricePerSqft: 927,
    image: "/kings-road-park-1.jpeg",
    salesPitch: "Exceptional value in Prime Camden - A rare opportunity to own a spacious 2-bed apartment in one of London's most vibrant neighborhoods at 15% below market average.",
    whyBestDeal: [
      "£927 per sqft - 15% below Camden's £1,090/sqft average",
      "Completion Q4 2025 - Brand new, move-in ready",
      "South-facing balcony with Regent's Canal views",
      "2-minute walk to King's Cross St Pancras (6 tube lines)",
      "£10,000 cashback incentive - limited time offer",
      "Help to Buy available - only 5% deposit required",
      "Private residents' gym, terrace & concierge included"
    ],
    availableUntil: "2025-11-30"
  },
  {
    developer: "Berkeley",
    developmentId: "woodberry-down",
    developmentName: "Woodberry Down",
    unitNumber: "A-205",
    price: "£520,000",
    priceNumeric: 520000,
    beds: 1,
    sqft: 580,
    pricePerSqft: 897,
    image: "/oval-village-1.png",
    salesPitch: "Outstanding value in Zone 2 with exceptional amenities and transport links.",
    whyBestDeal: [
      "£897 per sqft - Best value in Zone 2",
      "Free legal fees worth £2,500",
      "Overlooking nature reserve and reservoir",
      "Manor House & Finsbury Park tubes nearby",
      "24-hour concierge and residents' lounge",
      "Help to Buy available",
      "Completion Spring 2025"
    ],
    availableUntil: "2025-12-31"
  },
  {
    developer: "Barratt London",
    developmentId: "kings-road-park",
    developmentName: "Kings Road Park",
    unitNumber: "C-102",
    price: "£585,000",
    priceNumeric: 585000,
    beds: 2,
    sqft: 680,
    pricePerSqft: 860,
    image: "/kings-road-park-2.jpeg",
    salesPitch: "Prime location in Fulham with incredible transport links and riverside living.",
    whyBestDeal: [
      "£860 per sqft - 20% below Fulham average",
      "£5,000 furniture package included",
      "5-minute walk to Imperial Wharf station",
      "Riverside location with Thames Path access",
      "Private courtyard gardens",
      "Concierge service included",
      "Ready to move in Q3 2025"
    ],
    availableUntil: "2025-11-30"
  },
  {
    developer: "Countryside",
    developmentId: "acton-gardens",
    developmentName: "Acton Gardens",
    unitNumber: "D-301",
    price: "£475,000",
    priceNumeric: 475000,
    beds: 2,
    sqft: 720,
    pricePerSqft: 660,
    image: "/battersea-hero.png",
    salesPitch: "Exceptional value in West London with fantastic green spaces and transport.",
    whyBestDeal: [
      "£660 per sqft - Best value in West London",
      "£7,500 stamp duty contribution",
      "10 acres of parkland and gardens",
      "Acton Central & South Acton stations nearby",
      "Crossrail at Acton Main Line",
      "Help to Buy available",
      "Move in ready - immediate completion"
    ],
    availableUntil: "2026-01-31"
  },
  {
    developer: "Ballymore",
    developmentId: "embassy-gardens",
    developmentName: "Embassy Gardens",
    unitNumber: "E-405",
    price: "£895,000",
    priceNumeric: 895000,
    beds: 2,
    sqft: 850,
    pricePerSqft: 1053,
    image: "/battersea-power-station.png",
    salesPitch: "Iconic riverside development with world-class amenities in Nine Elms.",
    whyBestDeal: [
      "Sky Pool access - world's first floating pool",
      "£15,000 cashback on completion",
      "Zone 1 riverside location",
      "Vauxhall & Battersea Power Station tubes",
      "24-hour concierge & gym",
      "River views and private balcony",
      "Completion Q2 2025"
    ],
    availableUntil: "2025-10-31"
  },
  {
    developer: "Bellway",
    developmentId: "meridian-water",
    developmentName: "Meridian Water",
    unitNumber: "F-201",
    price: "£385,000",
    priceNumeric: 385000,
    beds: 2,
    sqft: 690,
    pricePerSqft: 558,
    image: "/oval-village-2.png",
    salesPitch: "Unbeatable value in North London's newest regeneration area.",
    whyBestDeal: [
      "£558 per sqft - Lowest price per sqft in London",
      "Brand new station opening 2025",
      "17 minutes to King's Cross",
      "Help to Buy available - 5% deposit",
      "New town centre with shops & restaurants",
      "£5,000 deposit contribution",
      "Immediate completion available"
    ],
    availableUntil: "2025-12-31"
  },
  {
    developer: "Canary Wharf Group",
    developmentId: "north-quay",
    developmentName: "North Quay",
    unitNumber: "G-503",
    price: "£725,000",
    priceNumeric: 725000,
    beds: 2,
    sqft: 750,
    pricePerSqft: 967,
    image: "/oval-village-3.png",
    salesPitch: "Premium Canary Wharf living with exceptional amenities and views.",
    whyBestDeal: [
      "£967 per sqft - Best value in Canary Wharf",
      "Direct Canary Wharf tube & DLR access",
      "River & city views",
      "Residents' gym, pool & cinema",
      "24-hour concierge",
      "Free legal fees worth £3,000",
      "Completion Summer 2025"
    ],
    availableUntil: "2025-09-30"
  },
  {
    developer: "Hill Group",
    developmentId: "central-hill",
    developmentName: "Central Hill",
    unitNumber: "H-102",
    price: "£445,000",
    priceNumeric: 445000,
    beds: 2,
    sqft: 700,
    pricePerSqft: 636,
    image: "/oval-village-4.png",
    salesPitch: "Affordable quality in South London with excellent transport and value.",
    whyBestDeal: [
      "£636 per sqft - Outstanding South London value",
      "Crystal Palace & Gipsy Hill stations",
      "Help to Buy - 5% deposit only",
      "Private communal gardens",
      "£10,000 deposit unlock available",
      "Part Exchange considered",
      "Ready to move in Q4 2025"
    ],
    availableUntil: "2025-12-31"
  },
  {
    developer: "Lendlease",
    developmentId: "elephant-park",
    developmentName: "Elephant Park",
    unitNumber: "J-304",
    price: "£650,000",
    priceNumeric: 650000,
    beds: 2,
    sqft: 720,
    pricePerSqft: 903,
    image: "/oval-village-5.png",
    salesPitch: "Prime Zone 1 location with exceptional regeneration and transport.",
    whyBestDeal: [
      "£903 per sqft - Excellent Zone 1 value",
      "Elephant & Castle tube & rail",
      "New town centre with shops & leisure",
      "3 acres of parkland on doorstep",
      "24-hour concierge",
      "Shared ownership available",
      "Completion Q3 2025"
    ],
    availableUntil: "2025-11-30"
  },
  {
    developer: "London Square",
    developmentId: "spitalfields",
    developmentName: "Spitalfields",
    unitNumber: "K-205",
    price: "£795,000",
    priceNumeric: 795000,
    beds: 2,
    sqft: 780,
    pricePerSqft: 1019,
    image: "/oval-village-6.png",
    salesPitch: "Prime City fringe location with exceptional transport and lifestyle.",
    whyBestDeal: [
      "£1,019 per sqft - Competitive City fringe pricing",
      "Liverpool Street 5 minutes walk",
      "Shoreditch & Brick Lane on doorstep",
      "Residents' lounge & gym",
      "10-year warranty",
      "Free stamp duty on selected units",
      "Immediate completion available"
    ],
    availableUntil: "2025-10-31"
  },
  {
    developer: "Mount Anvil",
    developmentId: "royal-wharf",
    developmentName: "Royal Wharf",
    unitNumber: "L-402",
    price: "£565,000",
    priceNumeric: 565000,
    beds: 2,
    sqft: 710,
    pricePerSqft: 796,
    image: "/oval-village-7.png",
    salesPitch: "Riverside living in East London with incredible amenities and value.",
    whyBestDeal: [
      "£796 per sqft - Excellent riverside value",
      "DLR station on site - 12 mins to Canary Wharf",
      "Thames Clipper pier for City commute",
      "Private residents' club with gym & pool",
      "River views and balcony",
      "Help to Buy available",
      "Completion Q2 2025"
    ],
    availableUntil: "2025-11-30"
  },
  {
    developer: "Taylor Wimpey",
    developmentId: "greenwich-peninsula",
    developmentName: "Greenwich Peninsula",
    unitNumber: "M-301",
    price: "£535,000",
    priceNumeric: 535000,
    beds: 2,
    sqft: 690,
    pricePerSqft: 775,
    image: "/oval-village-8.png",
    salesPitch: "Outstanding riverside location with world-class amenities and transport.",
    whyBestDeal: [
      "£775 per sqft - Best value riverside living",
      "North Greenwich tube (Jubilee line)",
      "O2 Arena & Design District on doorstep",
      "Emirates Air Line cable car",
      "Riverside walks and parks",
      "Help to Buy available",
      "Completion Autumn 2025"
    ],
    availableUntil: "2025-12-31"
  }
];
