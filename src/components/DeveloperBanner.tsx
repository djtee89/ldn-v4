import React from 'react';

interface DeveloperBannerProps {
  onDeveloperClick: (developer: string) => void;
  highlightedDeveloper: string | null;
}

const developers = [
  { name: 'Ballymore', logo: '/logos/ballymore.jpeg' },
  { name: 'Barratt London', logo: '/logos/barratt.jpg' },
  { name: 'Bellway', logo: '/logos/bellway.jpg' },
  { name: 'Berkeley Homes', logo: '/logos/berkeley.jpg' },
  { name: 'Canary Wharf Group', logo: '/logos/canary-wharf.jpg' },
  { name: 'Countryside Homes', logo: '/logos/countryside.jpg' },
  { name: 'Hill Group', logo: '/logos/hill.jpg' },
  { name: 'Lendlease', logo: '/logos/lendlease.jpg' },
  { name: 'London Square', logo: '/logos/london-square.png' },
  { name: 'Mount Anvil', logo: '/logos/mount-anvil.jpg' },
  { name: 'Regal', logo: '/logos/regal.png' },
  { name: 'Taylor Wimpey', logo: '/logos/taylor-wimpey.jpg' }
];

const DeveloperBanner: React.FC<DeveloperBannerProps> = ({ onDeveloperClick, highlightedDeveloper }) => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-black/5 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex items-center justify-between px-2 pb-2">
          <h3 className="text-base font-semibold text-neutral-900">Top developers</h3>
          <a href="#" className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">
            View all →
          </a>
        </div>

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-2 pb-1 scrollbar-hide">
          {developers.map((developer) => (
            <button
              key={developer.name}
              onClick={() => onDeveloperClick(developer.name)}
              className={`group snap-start shrink-0 rounded-xl border bg-white px-4 py-3 shadow-sm hover:shadow-md transition-all ${
                highlightedDeveloper === developer.name
                  ? 'border-primary ring-2 ring-primary shadow-md'
                  : 'border-neutral-900/10'
              }`}
            >
              <div className="flex h-12 w-36 items-center justify-center">
                <img
                  src={developer.logo}
                  alt={`${developer.name} logo`}
                  className={`max-h-8 max-w-[8rem] object-contain transition-all ${
                    highlightedDeveloper === developer.name
                      ? 'opacity-100 grayscale-0'
                      : 'opacity-80 grayscale hover:opacity-100 hover:grayscale-0'
                  }`}
                  loading="lazy"
                />
              </div>
              <div className="mt-2 text-center text-xs font-medium text-neutral-700">
                {developer.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeveloperBanner;