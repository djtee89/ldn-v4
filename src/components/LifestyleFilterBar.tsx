import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, ChevronDown, ChevronUp, School, Utensils, Landmark, ShoppingBag, Cross, Train, Building2 } from 'lucide-react';
import { AmenityType, amenityLabels } from '@/data/amenities';

interface LifestyleFilterBarProps {
  selectedTypes: AmenityType[];
  onTypesChange: (types: AmenityType[]) => void;
}

const amenityIcons: Record<AmenityType, React.ReactNode> = {
  private_schools: <GraduationCap className="w-4 h-4" />,
  prep_schools: <School className="w-4 h-4" />,
  state_schools: <School className="w-4 h-4" />,
  grammar_schools: <GraduationCap className="w-4 h-4" />,
  universities: <Building2 className="w-4 h-4" />,
  michelin_restaurants: <Utensils className="w-4 h-4" />,
  culture_landmarks: <Landmark className="w-4 h-4" />,
  shopping_lifestyle: <ShoppingBag className="w-4 h-4" />,
  hospitals_clinics: <Cross className="w-4 h-4" />,
  transport_hubs: <Train className="w-4 h-4" />,
};

const LifestyleFilterBar: React.FC<LifestyleFilterBarProps> = ({
  selectedTypes,
  onTypesChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleType = (type: AmenityType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const amenityTypesList: AmenityType[] = ['private_schools', 'prep_schools', 'state_schools', 'grammar_schools', 'universities', 'michelin_restaurants', 'culture_landmarks', 'shopping_lifestyle', 'hospitals_clinics', 'transport_hubs'];

  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-soft ring-1 ring-black/5 supports-[backdrop-filter]:bg-white/60 p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full hover:opacity-70 transition-smooth"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse amenity filters" : "Expand amenity filters"}
        >
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Curated</p>
            <h2 className="text-2xl font-bold text-neutral-900">Best of London</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Schools, transport, dining, lifestyle—your London, simplified
              {selectedTypes.length > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {selectedTypes.length} active
                </span>
              )}
            </p>
          </div>
          <div className="shrink-0">
            {isExpanded ? <ChevronUp className="w-5 h-5 text-neutral-700" /> : <ChevronDown className="w-5 h-5 text-neutral-700" />}
          </div>
        </button>
      
        <div className={`${isExpanded ? 'block animate-accordion-down' : 'hidden animate-accordion-up'} mt-4 pt-4 border-t border-neutral-200`}>
          <div className="flex flex-wrap gap-2">
            {amenityTypesList.map((type) => {
              const isSelected = selectedTypes.includes(type);
              return (
                <Button
                  key={type}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleType(type)}
                  className="h-9 text-sm gap-2 whitespace-nowrap rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  {amenityIcons[type]}
                  <span>{amenityLabels[type]}</span>
                </Button>
              );
            })}
          </div>
          
          {selectedTypes.length > 0 && (
            <div className="mt-4 flex items-center justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTypesChange([])}
                className="h-8 text-sm hover:bg-destructive/10 hover:text-destructive rounded-xl"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LifestyleFilterBar;
