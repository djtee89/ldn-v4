export interface Offer {
  id: string;
  title: string;
  development: string;
  developmentId: string;
  developer: string;
  description: string;
  terms: string[];
  eligibility: string[];
  howToClaim: string;
  category: 'furniture' | 'fees' | 'cashback' | 'other';
  expiryDate: string;
  image: string;
  featured: boolean;
  savingsAmount: string;
}

export const offers: Offer[] = [
  {
    id: '1',
    title: '£10,000 Saver at Woodberry Down',
    development: 'Woodberry Down',
    developmentId: 'woodberry-down',
    developer: 'Berkeley',
    savingsAmount: '£10,000',
    description: 'Save £10,000 on your new home at Woodberry Down with free legal fees and stamp duty contribution.',
    terms: [
      'Free legal fees worth up to £2,500',
      'Stamp duty contribution up to £7,500',
      'Available on selected units only',
      'Cannot be combined with other offers'
    ],
    eligibility: [
      'Exchange by 31 Dec 2025',
      'First-time buyers and investors eligible',
      'Applies to 1 & 2 bedroom apartments'
    ],
    howToClaim: 'Book a viewing and mention this offer to our sales team. The discount will be applied at exchange.',
    category: 'fees',
    expiryDate: '2025-12-31',
    image: '/oval-village-1.png',
    featured: true,
  },
  {
    id: '2',
    title: '£10,000 Furniture Package at Kings Road Park',
    development: 'Kings Road Park',
    developmentId: 'kings-road-park',
    developer: 'Barratt London',
    savingsAmount: '£10,000',
    description: 'Receive a £10,000 furniture package voucher to furnish your new home in style at Kings Road Park.',
    terms: [
      '£10,000 John Lewis voucher',
      'Redeemable on furniture and home accessories',
      'Valid for 12 months from completion',
      'Available on selected 2 & 3 bedroom apartments'
    ],
    eligibility: [
      'Reserve by 30 Nov 2025',
      'Complete by 31 Mar 2026',
      'All buyers eligible'
    ],
    howToClaim: 'Reserve your apartment before the deadline. Voucher will be provided on legal completion.',
    category: 'furniture',
    expiryDate: '2025-11-30',
    image: '/kings-road-park-1.jpeg',
    featured: true,
  },
  {
    id: '3',
    title: 'Berkeley Will Buy Your Home',
    development: 'Trent Park',
    developmentId: 'trent-park',
    developer: 'Berkeley',
    savingsAmount: 'Bespoke',
    description: 'Berkeley will purchase your current home, allowing you to pay only the difference for your new property at Trent Park.',
    terms: [
      'Berkeley purchases your existing home at market value',
      'No estate agent fees',
      'No chain delays',
      'Independent valuation arranged',
      'Legal fees for sale included'
    ],
    eligibility: [
      'UK homeowners only',
      'Property must be mortgage-free or have minimal outstanding mortgage',
      'Subject to Berkeley valuation and approval',
      'Available on selected units'
    ],
    howToClaim: 'Contact our sales team to arrange a free valuation of your current property.',
    category: 'other',
    expiryDate: '2026-02-28',
    image: '/battersea-hero.png',
    featured: true,
  },
  {
    id: '4',
    title: 'Stamp Duty Paid at Acton Gardens',
    development: 'Acton Gardens',
    developmentId: 'acton-gardens',
    developer: 'Countryside',
    savingsAmount: 'Up to £20,000',
    description: 'Countryside will pay your stamp duty on selected homes at Acton Gardens, saving you up to £20,000.',
    terms: [
      'Stamp duty paid on properties up to £1m',
      'Available on selected units',
      'First-time buyers and movers eligible',
      'Offer subject to availability'
    ],
    eligibility: [
      'Exchange by 31 Jan 2026',
      'Complete by 30 Jun 2026',
      'UK residents only'
    ],
    howToClaim: 'Visit the sales office and reserve an eligible unit. Stamp duty will be paid at completion.',
    category: 'fees',
    expiryDate: '2026-01-31',
    image: '/battersea-power-station.png',
    featured: true,
  },
  {
    id: '5',
    title: '5% Deposit at Meridian Water',
    development: 'Meridian Water',
    developmentId: 'meridian-water',
    developer: 'Bellway',
    savingsAmount: 'From £19,250',
    description: 'Own a new home with just 5% deposit through Help to Buy at Meridian Water.',
    terms: [
      'Government Help to Buy scheme',
      '5% deposit required',
      '40% equity loan (London)',
      'Interest-free for 5 years',
      'Prices from £385,000'
    ],
    eligibility: [
      'First-time buyers only',
      'Property must be your only residence',
      'Maximum household income £90,000',
      'UK residents only'
    ],
    howToClaim: 'Speak to our sales team about Help to Buy eligibility and application process.',
    category: 'other',
    expiryDate: '2025-12-31',
    image: '/oval-village-2.png',
    featured: false,
  },
  {
    id: '6',
    title: 'Part Exchange Available',
    development: 'Greenwich Peninsula',
    developmentId: 'greenwich-peninsula',
    developer: 'Taylor Wimpey',
    savingsAmount: 'No fees',
    description: 'Part exchange your current home and move to Greenwich Peninsula with no estate agent fees or chain delays.',
    terms: [
      'Free independent valuation',
      'No estate agent fees',
      'No chain - guaranteed sale',
      'Move in 30 days',
      'Available on selected homes'
    ],
    eligibility: [
      'UK homeowners only',
      'Your property must be in good condition',
      'Subject to valuation and acceptance',
      'Terms and conditions apply'
    ],
    howToClaim: 'Request a free valuation from our sales team to see how much your home is worth.',
    category: 'other',
    expiryDate: '2025-12-31',
    image: '/oval-village-8.png',
    featured: false,
  },
];
