export interface Offer {
  id: string;
  title: string;
  development: string;
  developer: string;
  description: string;
  eligibility: string;
  category: 'furniture' | 'fees' | 'cashback' | 'other';
  expiryDate: string;
}

export const offers: Offer[] = [
  {
    id: '1',
    title: 'Free Legal Fees',
    development: 'Woodberry Down',
    developer: 'Berkeley',
    description: 'We\'ll cover all your legal fees when you exchange on a new home at Woodberry Down.',
    eligibility: 'Exchange by 31 Dec 2025',
    category: 'fees',
    expiryDate: '2025-12-31',
  },
  {
    id: '2',
    title: '£5,000 Furniture Package',
    development: 'Kings Road Park',
    developer: 'Barratt London',
    description: 'Receive a £5,000 furniture voucher to help you furnish your new home in style.',
    eligibility: 'Reserve by 30 Nov 2025',
    category: 'furniture',
    expiryDate: '2025-11-30',
  },
  {
    id: '3',
    title: '£10,000 Cashback',
    development: 'Oval Village',
    developer: 'Berkeley',
    description: 'Get £10,000 cashback on completion of your purchase at Oval Village.',
    eligibility: 'Complete by 28 Feb 2026',
    category: 'cashback',
    expiryDate: '2026-02-28',
  },
  {
    id: '4',
    title: 'Stamp Duty Contribution',
    development: 'Acton Gardens',
    developer: 'Countryside',
    description: 'We\'ll contribute up to £7,500 towards your Stamp Duty costs.',
    eligibility: 'Exchange by 31 Jan 2026',
    category: 'fees',
    expiryDate: '2026-01-31',
  },
];
