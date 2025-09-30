import React from 'react';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OffersButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/offers')}
      className="absolute bottom-4 left-4 bg-primary hover:bg-primary/90 transition-smooth shadow-medium z-10 h-9 px-3 text-sm"
      size="sm"
    >
      <Tag className="w-3.5 h-3.5 mr-1.5" />
      Offers
    </Button>
  );
};

export default OffersButton;
