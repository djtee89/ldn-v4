import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, ChevronDown, ChevronUp, School, Utensils, Landmark, ShoppingBag, Cross, Train } from 'lucide-react';
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

  const amenityTypesList: AmenityType[] = ['private_schools', 'prep_schools', 'state_schools', 'grammar_schools', 'michelin_restaurants', 'culture_landmarks', 'shopping_lifestyle', 'hospitals_clinics', 'transport_hubs'];

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-3 w-full hover:bg-muted/50 transition-colors"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Collapse amenity filters" : "Expand amenity filters"}
      >
        <div className="text-left">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            Best of London
            {selectedTypes.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                ({selectedTypes.length} active)
              </span>
            )}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Schools, transport, dining, lifestyle—your London, simplified</p>
        </div>
        <div className="shrink-0">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      
      <div className={`${isExpanded ? 'block animate-accordion-down' : 'hidden animate-accordion-up'} px-3 pb-3`}>
        <div className="flex flex-wrap md:flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {amenityTypesList.map((type) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <Button
                key={type}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleType(type)}
                className="h-9 text-xs gap-1.5 whitespace-nowrap shrink-0"
              >
                {amenityIcons[type]}
                <span className="hidden sm:inline">{amenityLabels[type]}</span>
              </Button>
            );
          })}
        </div>
        
        {selectedTypes.length > 0 && (
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{selectedTypes.length} layer{selectedTypes.length > 1 ? 's' : ''} active</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTypesChange([])}
              className="h-7 text-xs hover:bg-destructive/10 hover:text-destructive"
            >
              Clear overlays
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LifestyleFilterBar;
