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
    <div className="w-full">
      <div className="rounded-2xl bg-white shadow-md border border-border p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full hover:opacity-80 transition-all group"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse amenity filters" : "Expand amenity filters"}
        >
          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Explore</p>
            <h2 className="text-sm font-bold text-foreground tracking-tight">Best of London</h2>
            <p className="text-xs text-foreground font-light">
              Explore the best of London around your new home.
              {selectedTypes.length > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {selectedTypes.length} active
                </span>
              )}
            </p>
          </div>
          <div className="shrink-0">
            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" /> : <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />}
          </div>
        </button>
      
        <div className={`${isExpanded ? 'block animate-accordion-down' : 'hidden animate-accordion-up'} mt-3 pt-3 border-t border-border/50`}>
          <div className="flex flex-wrap gap-2">
            {amenityTypesList.map((type) => {
              const isSelected = selectedTypes.includes(type);
              return (
                <Button
                  key={type}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleType(type)}
                  className={`h-8 text-xs gap-1.5 whitespace-nowrap rounded-full font-medium transition-all ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground hover:bg-primary-hover' 
                      : 'text-foreground border-border hover:bg-muted'
                  }`}
                >
                  {amenityIcons[type]}
                  <span>{amenityLabels[type]}</span>
                </Button>
              );
            })}
          </div>
          
          {selectedTypes.length > 0 && (
            <div className="mt-3 flex items-center justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTypesChange([])}
                className="h-7 text-xs hover:bg-destructive/10 hover:text-destructive rounded-full"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LifestyleFilterBar;
