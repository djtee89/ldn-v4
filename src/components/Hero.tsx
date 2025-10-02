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
  return <section className="relative isolate mb-6">
      {/* Banner image */}
      <div className="relative overflow-hidden rounded-[24px]">
        <img src="/battersea-power-station.png" alt="Battersea Power Station London luxury property development" className="h-[clamp(320px,40vh,450px)] w-full object-cover" loading="eager" />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50" />
      </div>

      {/* Content overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl px-4">
          {/* Heading */}
          <div className="max-w-3xl">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Search new-build property across London
            </h1>
            <p className="mt-2 sm:mt-3 text-white/95 text-base sm:text-lg font-light">
              Off-plan and ready-to-move homes from leading developers.
            </p>
          </div>

          {/* Developer Banner - Transparent Overlay */}
          <div className="mt-6">
            <DeveloperBanner onDeveloperClick={onDeveloperClick} highlightedDeveloper={highlightedDeveloper} />
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;