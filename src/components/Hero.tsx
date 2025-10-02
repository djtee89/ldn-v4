import React from 'react';

interface HeroProps {
  onDeveloperClick?: (developer: string) => void;
  highlightedDeveloper?: string | null;
}

const Hero: React.FC<HeroProps> = () => {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl mx-4 mt-4 sm:mx-6 sm:mt-6">
      {/* Hero image */}
      <div className="relative overflow-hidden">
        <img 
          src="/hero-london-1920.webp" 
          alt="London skyline with The Shard at sunset" 
          className="h-[clamp(400px,50vh,500px)] w-full object-cover" 
          loading="eager"
          fetchPriority="high"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Centered content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-lg">
            Search new-build property across London
          </h1>
          <p className="mt-3 sm:mt-4 text-white/90 text-base sm:text-lg md:text-xl font-light drop-shadow">
            Off-plan and ready-to-move homes from leading developers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;