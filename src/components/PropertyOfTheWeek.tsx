import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MapPin, Star } from 'lucide-react';
import { propertyOfTheWeek } from '@/data/developments';

interface PropertyOfTheWeekProps {
  onViewClick: () => void;
}

const PropertyOfTheWeek: React.FC<PropertyOfTheWeekProps> = ({ onViewClick }) => {
  const { development, floorplanUrl } = propertyOfTheWeek;

  return (
    <Button
      onClick={onViewClick}
      className="absolute bottom-4 left-4 bg-premium-gradient hover:shadow-premium transition-smooth shadow-medium z-10"
      size="sm"
    >
      <Star className="w-4 h-4 mr-2 fill-white" />
      Property of the Week
    </Button>
  );
};

export default PropertyOfTheWeek;