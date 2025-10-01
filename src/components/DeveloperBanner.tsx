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
    <div className="bg-muted border-y border-border py-3 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        <div className="inline-flex items-center gap-8">
          {[...developers, ...developers].map((developer, index) => (
            <div 
              key={`${developer.name}-${index}`}
              onClick={() => onDeveloperClick(developer.name)}
              className={`w-40 h-20 rounded-lg shadow-soft border transition-smooth cursor-pointer overflow-hidden ${
                highlightedDeveloper === developer.name
                  ? 'border-primary shadow-premium ring-2 ring-primary'
                  : 'border-border hover:shadow-lg'
              }`}
            >
              <img 
                src={developer.logo} 
                alt={`${developer.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DeveloperBanner;