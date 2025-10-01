import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MapPin, Star } from 'lucide-react';
import { propertyOfTheWeek } from '@/data/developments';
interface PropertyOfTheWeekProps {
  onViewClick: () => void;
}
const PropertyOfTheWeek: React.FC<PropertyOfTheWeekProps> = ({
  onViewClick
}) => {
  const {
    development,
    floorplanUrl
  } = propertyOfTheWeek;
  return;
};
export default PropertyOfTheWeek;