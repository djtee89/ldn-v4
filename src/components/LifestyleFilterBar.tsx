import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dumbbell, Coffee, Utensils, Trees, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import { AmenityType, amenityLabels } from '@/data/amenities';

interface LifestyleFilterBarProps {
  selectedTypes: AmenityType[];
  onTypesChange: (types: AmenityType[]) => void;
}

const amenityIcons: Record<AmenityType, React.ReactNode> = {
  gyms: <Dumbbell className="w-4 h-4" />,
  coffee: <Coffee className="w-4 h-4" />,
  restaurants: <Utensils className="w-4 h-4" />,
  parks: <Trees className="w-4 h-4" />,
  schools: <GraduationCap className="w-4 h-4" />,
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

  const amenityTypesList: AmenityType[] = ['gyms', 'coffee', 'restaurants', 'parks', 'schools'];

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm mb-4">
      <div className="flex items-center justify-between p-3">
        <h3 className="text-sm font-semibold text-foreground">Lifestyle Heatmaps</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden h-8 w-8 p-0"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>
      
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block px-3 pb-3`}>
        <div className="flex flex-wrap gap-2">
          {amenityTypesList.map((type) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <Button
                key={type}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleType(type)}
                className="h-9 text-xs gap-1.5"
              >
                {amenityIcons[type]}
                <span>{amenityLabels[type]}</span>
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
              className="h-7 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LifestyleFilterBar;
