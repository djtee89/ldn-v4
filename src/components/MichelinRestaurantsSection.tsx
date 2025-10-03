import React from 'react';
import { SectionHeader } from './ui/SectionHeader';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, ExternalLink } from 'lucide-react';
import { michelinRestaurants, MichelinRestaurant } from '@/data/michelinRestaurants';
const MichelinRestaurantsSection = () => {
  const threeStars = michelinRestaurants.filter(r => r.stars === 3);
  const twoStars = michelinRestaurants.filter(r => r.stars === 2);
  const oneStars = michelinRestaurants.filter(r => r.stars === 1);
  const handleRestaurantClick = (restaurantName: string) => {
    const searchQuery = encodeURIComponent(`${restaurantName} London restaurant`);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank', 'noopener,noreferrer');
  };
  const renderStars = (count: number) => {
    return <div className="flex gap-0.5">
        {Array.from({
        length: count
      }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
      </div>;
  };
  const RestaurantCard = ({
    restaurant
  }: {
    restaurant: MichelinRestaurant;
  }) => <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]" onClick={() => handleRestaurantClick(restaurant.name)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {restaurant.isNew && <Badge variant="secondary" className="text-xs">New 2025</Badge>}
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
        {renderStars(restaurant.stars)}
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {restaurant.description}
        </p>
      </CardContent>
    </Card>;
  const RestaurantGrid = ({
    restaurants,
    title,
    subtitle
  }: {
    restaurants: MichelinRestaurant[];
    title: string;
    subtitle: string;
  }) => <div className="mb-12">
      <SectionHeader title={title} subtitle={subtitle} className="mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {restaurants.map((restaurant, idx) => <RestaurantCard key={idx} restaurant={restaurant} />)}
      </div>
    </div>;
  return <div className="py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader title="Michelin-Starred Restaurants in London" subtitle="Discover the finest dining experiences in the capital" className="mb-8" />
      
      <RestaurantGrid restaurants={threeStars} title="Three Michelin Stars" subtitle="Exceptional cuisine, worth a special journey" />
      
      <RestaurantGrid restaurants={twoStars} title="Two Michelin Stars" subtitle="Excellent cooking, worth a detour" />
      
      <RestaurantGrid restaurants={oneStars} title="One Michelin Star" subtitle="High quality cooking, worth a stop" />
    </div>;
};
export default MichelinRestaurantsSection;