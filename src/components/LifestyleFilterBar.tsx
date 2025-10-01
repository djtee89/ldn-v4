import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dumbbell, ShoppingCart, Trees, GraduationCap, ChevronDown, ChevronUp, Activity, Cross, CupSoda, Utensils } from 'lucide-react';
import { AmenityType, amenityLabels } from '@/data/amenities';

interface LifestyleFilterBarProps {
  selectedTypes: AmenityType[];
  onTypesChange: (types: AmenityType[]) => void;
}

const amenityIcons: Record<AmenityType, React.ReactNode> = {
  tennis: <Activity className="w-4 h-4" />,
  grammar_schools: <GraduationCap className="w-4 h-4" />,
  chinese_restaurants: <Utensils className="w-4 h-4" />,
  supermarkets: <ShoppingCart className="w-4 h-4" />,
  parks: <Trees className="w-4 h-4" />,
  gyms: <Dumbbell className="w-4 h-4" />,
  hospitals: <Cross className="w-4 h-4" />,
  cafes: <CupSoda className="w-4 h-4" />,
};

const LifestyleFilterBar: React.FC<LifestyleFilterBarProps> = ({
  selectedTypes,
  onTypesChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleType = (type: AmenityType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const amenityTypesList: AmenityType[] = ['tennis', 'grammar_schools', 'chinese_restaurants', 'supermarkets', 'parks', 'gyms', 'hospitals', 'cafes'];

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm mb-4">
      <div className="flex items-center justify-between p-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Amenity Overlays</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Toggle amenities to see what's nearby. Click a property to compare walk times.</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden h-8 w-8 p-0 shrink-0"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>
      
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block px-3 pb-3`}>
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
