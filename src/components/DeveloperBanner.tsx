import React from 'react';

interface DeveloperBannerProps {
  onDeveloperClick: (developer: string) => void;
  highlightedDeveloper: string | null;
}

const developers = [
  'Berkeley',
  'Barratt',
  'Ballymore', 
  'Canary Wharf Group',
  'St George',
  'Persimmon',
  'Taylor Wimpey',
  'Crest Nicholson',
  'Galliard Homes',
  'Mount Anvil'
];

const DeveloperBanner: React.FC<DeveloperBannerProps> = ({ onDeveloperClick, highlightedDeveloper }) => {
  return (
    <div className="bg-muted border-y border-border py-3 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        <div className="inline-flex items-center gap-8">
          {[...developers, ...developers].map((developer, index) => (
            <div 
              key={`${developer}-${index}`}
              onClick={() => onDeveloperClick(developer)}
              className={`px-4 py-2 rounded-lg shadow-soft border transition-smooth cursor-pointer ${
                highlightedDeveloper === developer
                  ? 'bg-premium-gradient text-white border-primary shadow-premium'
                  : 'bg-card hover:bg-card-hover border-border'
              }`}
            >
              <span className="text-sm font-medium">
                {developer}
              </span>
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