export const developerLogos: Record<string, string> = {
  'Ballymore': '/logos/ballymore.jpeg',
  'Barratt London': '/logos/barratt.jpg',
  'Barratt Homes': '/logos/barratt.jpg',
  'Bellway': '/logos/bellway.jpg',
  'Berkeley Homes': '/logos/berkeley.jpg',
  'Canary Wharf Group': '/logos/canary-wharf.jpg',
  'Countryside Homes': '/logos/countryside.jpg',
  'Hill Group': '/logos/hill.jpg',
  'Lendlease': '/logos/lendlease.jpg',
  'London Square': '/logos/london-square.png',
  'Mount Anvil': '/logos/mount-anvil.jpg',
  'Regal': '/logos/regal.png',
  'Taylor Wimpey': '/logos/taylor-wimpey.jpg',
};

export const getDeveloperLogo = (developerName: string): string | undefined => {
  return developerLogos[developerName];
};
