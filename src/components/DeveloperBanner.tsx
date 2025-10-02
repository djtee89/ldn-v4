import React from 'react';
interface DeveloperBannerProps {
  onDeveloperClick: (developer: string) => void;
  highlightedDeveloper: string | null;
}
const developers = [{
  name: 'Ballymore',
  logo: '/logos/ballymore.jpeg'
}, {
  name: 'Barratt London',
  logo: '/logos/barratt.jpg'
}, {
  name: 'Bellway',
  logo: '/logos/bellway.jpg'
}, {
  name: 'Berkeley Homes',
  logo: '/logos/berkeley.jpg'
}, {
  name: 'Canary Wharf Group',
  logo: '/logos/canary-wharf.jpg'
}, {
  name: 'Countryside Homes',
  logo: '/logos/countryside.jpg'
}, {
  name: 'Hill Group',
  logo: '/logos/hill.jpg'
}, {
  name: 'Lendlease',
  logo: '/logos/lendlease.jpg'
}, {
  name: 'London Square',
  logo: '/logos/london-square.png'
}, {
  name: 'Mount Anvil',
  logo: '/logos/mount-anvil.jpg'
}, {
  name: 'Regal',
  logo: '/logos/regal.png'
}, {
  name: 'Taylor Wimpey',
  logo: '/logos/taylor-wimpey.jpg'
}];
const DeveloperBanner: React.FC<DeveloperBannerProps> = ({
  onDeveloperClick,
  highlightedDeveloper
}) => {
  return <div className="w-full">
      <div className="relative overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <div className="inline-flex items-center gap-3 px-1">
            {[...developers, ...developers].map((developer, index) => (
              <button 
                key={`${developer.name}-${index}`} 
                onClick={() => onDeveloperClick(developer.name)} 
                className={`group shrink-0 w-32 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                  highlightedDeveloper === developer.name 
                    ? 'ring-2 ring-white/90 shadow-lg scale-105' 
                    : 'hover:ring-2 hover:ring-white/60 hover:shadow-md hover:scale-105'
                }`}
                style={{
                  backdropFilter: 'blur(4px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.animationPlayState = 'paused';
                  e.currentTarget.parentElement!.style.animationPlayState = 'paused';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.parentElement!.style.animationPlayState = 'running';
                }}
              >
                <img 
                  src={developer.logo} 
                  alt={`${developer.name} logo`} 
                  className="w-full h-full object-cover transition-transform duration-300" 
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>;
};
export default DeveloperBanner;