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
      <div className="bg-white/70 backdrop-blur-md shadow-soft ring-1 ring-black/5 supports-[backdrop-filter]:bg-white/60 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-neutral-900">Featured Developers</h3>
        </div>
        
        <div className="relative overflow-hidden -mx-2">
          <div className="animate-marquee whitespace-nowrap">
            <div className="inline-flex items-center gap-4 px-2">
              {[...developers, ...developers].map((developer, index) => <button key={`${developer.name}-${index}`} onClick={() => onDeveloperClick(developer.name)} className={`group shrink-0 w-40 h-20 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all overflow-hidden ${highlightedDeveloper === developer.name ? 'border-primary ring-2 ring-primary/20' : 'border-neutral-200 hover:border-neutral-300'}`}>
                  <img src={developer.logo} alt={`${developer.name} logo`} className="w-full h-full object-cover transition-all" loading="lazy" />
                </button>)}
            </div>
          </div>
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
    </div>;
};
export default DeveloperBanner;