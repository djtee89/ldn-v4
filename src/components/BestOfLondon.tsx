import React from 'react';
import { ChevronDown } from 'lucide-react';

interface BestOfLondonProps {
  count?: number;
  onToggle?: () => void;
}

const BestOfLondon: React.FC<BestOfLondonProps> = ({ count = 0, onToggle }) => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Curated
          </p>
          <h2 className="text-2xl font-bold text-neutral-900">
            Best of London
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Schools, transport, dining, lifestyle — your London, simplified.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline rounded-full bg-neutral-900/5 px-3 py-1 text-xs text-neutral-700">
            {count} spots
          </span>
          {onToggle && (
            <button
              onClick={onToggle}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-900/10 bg-white px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              Toggle
              <ChevronDown className="h-4 w-4 opacity-70" />
            </button>
          )}
        </div>
      </div>

      {/* Hairline divider */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
    </section>
  );
};

export default BestOfLondon;
