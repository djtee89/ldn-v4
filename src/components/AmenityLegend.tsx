import React from 'react';
import { AmenityType, amenityColors, amenityLabels } from '@/data/amenities';

interface AmenityLegendProps {
  activeTypes: AmenityType[];
}

const AmenityLegend: React.FC<AmenityLegendProps> = ({ activeTypes }) => {
  if (activeTypes.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg z-10">
      <p className="text-xs text-muted-foreground mb-2">Active Amenities</p>
      <div className="flex flex-col gap-1.5">
        {activeTypes.map((type) => (
          <div key={type} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border border-white"
              style={{ backgroundColor: amenityColors[type] }}
            />
            <span className="text-xs text-foreground">{amenityLabels[type]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenityLegend;
