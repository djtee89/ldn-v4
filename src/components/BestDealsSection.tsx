import React, { useState } from 'react';
import { bestDeals } from '@/data/bestDeals';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, MapPin, Bed, Maximize } from 'lucide-react';
import DealModal from './DealModal';

const BestDealsSection = () => {
  const [selectedDeal, setSelectedDeal] = useState<typeof bestDeals[0] | null>(null);

  return (
    <>
      <section className="w-full py-12 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-4">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-semibold">HOT DEALS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Best Deals in London Right Now
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-picked opportunities from London's leading developers. Limited availability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bestDeals.map((deal) => (
              <Card
                key={deal.unitNumber}
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => setSelectedDeal(deal)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.developmentName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <Badge className="absolute top-3 right-3 bg-destructive text-white">
                    <Flame className="h-3 w-3 mr-1" />
                    Hot Deal
                  </Badge>
                  {deal.availableUntil && (
                    <div className="absolute bottom-3 left-3 text-xs text-white/90 font-medium bg-black/50 px-2 py-1 rounded">
                      Until {new Date(deal.availableUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="text-xs text-muted-foreground font-medium mb-1">
                    {deal.developer}
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">
                    {deal.developmentName}
                  </h3>
                  
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-primary">
                      {deal.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      £{deal.pricePerSqft}/sqft
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>{deal.beds} bed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="h-4 w-4" />
                      <span>{deal.sqft} sqft</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {deal.whyBestDeal[0]}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Modal */}
      {selectedDeal && (
        <DealModal
          deal={selectedDeal}
          isOpen={!!selectedDeal}
          onClose={() => setSelectedDeal(null)}
        />
      )}
    </>
  );
};

export default BestDealsSection;
