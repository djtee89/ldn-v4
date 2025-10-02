import React from 'react';
import DeveloperBanner from '@/components/DeveloperBanner';
interface HeroProps {
  onDeveloperClick: (developer: string) => void;
  highlightedDeveloper: string | null;
}
const Hero: React.FC<HeroProps> = ({
  onDeveloperClick,
  highlightedDeveloper
}) => {
  return (
    <section className="relative isolate">
      {/* Hero image with responsive srcset */}
      <div className="relative overflow-hidden">
        <img 
          src="/battersea-hero.png" 
          alt="Battersea Power Station rooftop pool with iconic chimneys and London skyline" 
          className="h-[clamp(400px,50vh,600px)] w-full object-cover" 
          loading="eager"
          fetchPriority="high"
        />
        {/* Gradient overlay for text legibility on bright images */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl px-4">
          {/* Heading */}
          <div className="max-w-3xl">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight drop-shadow-lg">
              Search new-build property across London
            </h1>
            <p className="mt-2 sm:mt-3 text-white/95 text-base sm:text-lg font-light drop-shadow">
              Off-plan and ready-to-move homes from leading developers.
            </p>
          </div>

          {/* Developer Banner - Glass panel for better legibility */}
          <div className="mt-6">
            <div className="rounded-2xl bg-panel/90 p-4 shadow-lift ring-1 ring-white/15 backdrop-blur-sm">
              <DeveloperBanner 
                onDeveloperClick={onDeveloperClick} 
                highlightedDeveloper={highlightedDeveloper} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;