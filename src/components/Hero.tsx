import React, { useState } from 'react';

interface HeroProps {
  onSearch: (query: string, mode: 'sale' | 'rent') => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'sale' | 'rent'>('sale');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, searchMode);
  };

  const handleModeClick = (mode: 'sale' | 'rent') => {
    setSearchMode(mode);
    onSearch(searchQuery, mode);
  };

  return (
    <section className="relative isolate">
      {/* Banner image */}
      <div className="relative overflow-hidden rounded-[24px]">
        <img
          src="/kings-road-park-1.jpeg"
          alt=""
          className="h-[clamp(280px,35vh,400px)] w-full object-cover"
          loading="eager"
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      {/* Content overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl px-4">
          {/* Heading */}
          <div className="max-w-3xl">
            <p className="text-white/85 text-sm font-semibold tracking-wide">
              London Developer Network
            </p>
            <h1 className="mt-2 text-white text-4xl font-bold leading-tight sm:text-5xl">
              Search new-build property across London
            </h1>
            <p className="mt-3 text-white/90 text-lg">
              Off-plan and ready-to-move homes from leading developers.
            </p>
          </div>

          {/* Search panel */}
          <form 
            onSubmit={handleSubmit}
            className="mt-6 max-w-4xl rounded-2xl bg-[#0b1530]/92 p-4 shadow-2xl ring-1 ring-white/15 backdrop-blur"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search area, postcode, or station
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                id="hero-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Marylebone, W1, or Bond Street station"
                className="h-12 w-full rounded-xl border border-white/10 bg-white px-4 text-[#0b0f17] placeholder:text-[#7d8694] focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => handleModeClick('sale')}
                  className={`h-12 rounded-xl px-4 font-semibold transition-smooth ${
                    searchMode === 'sale'
                      ? 'bg-white text-[#0b0f17] ring-1 ring-white/10'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  For sale
                </button>
                <button
                  type="button"
                  onClick={() => handleModeClick('rent')}
                  className={`h-12 rounded-xl px-4 font-semibold transition-smooth ${
                    searchMode === 'rent'
                      ? 'bg-teal-400 text-[#0b0f17]'
                      : 'bg-teal-400/30 text-white hover:bg-teal-400/50'
                  }`}
                >
                  To rent
                </button>
              </div>
            </div>
          </form>

          {/* Trust line */}
          <div className="mt-3 text-white/80 text-sm">
            <span>Berkeley • Barratt • Ballymore • Taylor Wimpey • Mount Anvil</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
