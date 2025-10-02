import React, { useState } from 'react';
import { offers } from '@/data/offers';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Clock } from 'lucide-react';
import OfferModal from './OfferModal';

const ThisWeeksOffers = () => {
  const [selectedOffer, setSelectedOffer] = useState<typeof offers[0] | null>(null);
  const featuredOffers = offers.filter(offer => offer.featured);

  return (
    <>
      <section className="w-full py-12 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-semibold">LIMITED TIME</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              This Week's Offers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Exclusive incentives from London's leading developers. Act fast - these offers won't last long.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredOffers.map((offer) => (
              <Card
                key={offer.id}
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => setSelectedOffer(offer)}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.development}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Savings Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary text-white font-bold text-sm px-3 py-1">
                      Save {offer.savingsAmount}
                    </Badge>
                  </div>

                  {/* Expiry */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-white/90 font-medium bg-black/60 px-2 py-1 rounded">
                    <Clock className="h-3 w-3" />
                    Ends {new Date(offer.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="text-xs text-muted-foreground font-medium mb-1">
                    {offer.developer}
                  </div>
                  <h3 className="font-bold text-base mb-2 line-clamp-2">
                    {offer.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {offer.description}
                  </p>

                  <div className="pt-3 border-t">
                    <div className="text-xs font-medium text-primary group-hover:underline">
                      View Offer Details →
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* View All Offers */}
          <div className="text-center mt-8">
            <a 
              href="/offers" 
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              View All Offers
              <Gift className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Offer Modal */}
      {selectedOffer && (
        <OfferModal
          offer={selectedOffer}
          isOpen={!!selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}
    </>
  );
};

export default ThisWeeksOffers;
