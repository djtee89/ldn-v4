import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Clock } from 'lucide-react';
import OfferModal from './OfferModal';

interface Offer {
  id: string;
  dev_id: string;
  offer_title: string;
  offer_description: string | null;
  voucher_code: string;
  savings_amount: string | null;
  expiry_date: string | null;
  terms: any;
  image_url?: string | null;
  developments: {
    name: string;
    developer: string;
    images: string[];
  };
}

const ThisWeeksOffers = () => {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('development_offers')
        .select(`
          *,
          developments (name, developer, images)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setOffers(data as Offer[] || []);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || offers.length === 0) {
    return null;
  }

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
            {offers.map((offer) => (
              <Card
                key={offer.id}
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => setSelectedOffer(offer)}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={offer.image_url || offer.developments.images?.[0] || '/placeholder.svg'}
                    alt={offer.developments.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Savings Badge */}
                  {offer.savings_amount && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-white font-bold text-sm px-3 py-1">
                        Save {offer.savings_amount}
                      </Badge>
                    </div>
                  )}

                  {/* Expiry */}
                  {offer.expiry_date && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-white/90 font-medium bg-black/60 px-2 py-1 rounded">
                      <Clock className="h-3 w-3" />
                      Ends {new Date(offer.expiry_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="text-xs text-muted-foreground font-medium mb-1">
                    {offer.developments.developer}
                  </div>
                  <h3 className="font-bold text-base mb-2 line-clamp-2">
                    {offer.offer_title}
                  </h3>
                  
                  {offer.offer_description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {offer.offer_description}
                    </p>
                  )}

                  {offer.voucher_code && (
                    <div className="mb-3 flex items-center gap-2 bg-primary/10 border border-primary/20 rounded px-2 py-1.5">
                      <span className="text-xs text-muted-foreground">Voucher:</span>
                      <span className="font-mono font-bold text-sm text-primary">{offer.voucher_code}</span>
                    </div>
                  )}

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
          offer={{
            id: selectedOffer.id,
            title: selectedOffer.offer_title,
            development: selectedOffer.developments.name,
            developmentId: selectedOffer.dev_id,
            developer: selectedOffer.developments.developer,
            description: selectedOffer.offer_description || '',
            image: selectedOffer.image_url || selectedOffer.developments.images?.[0] || '/placeholder.svg',
            savingsAmount: selectedOffer.savings_amount || '',
            expiryDate: selectedOffer.expiry_date || '',
            voucherCode: selectedOffer.voucher_code,
            terms: Array.isArray(selectedOffer.terms) ? selectedOffer.terms : [],
            eligibility: ['Contact sales team for full eligibility criteria'],
            howToClaim: 'Book a viewing and mention this offer to our sales team',
            category: 'other' as const,
            featured: true
          }}
          isOpen={!!selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}
    </>
  );
};

export default ThisWeeksOffers;
