import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Bed, Maximize } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import HottestDealPopup from './HottestDealPopup';

interface HottestDeal {
  unit_id: string;
  unit_number: string;
  beds: number;
  price: number;
  size_sqft: number;
  dev_id: string;
  dev_name: string;
  developer: string;
  image: string;
  override_reason: string;
}

interface BestDealsSectionProps {
  onBookViewing: (unitInfo: {
    developmentName: string;
    developmentId: string;
    unitId: string;
    unitNumber: string;
  }) => void;
}

const BestDealsSection: React.FC<BestDealsSectionProps> = ({ onBookViewing }) => {
  const [hottestDeals, setHottestDeals] = useState<HottestDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<HottestDeal | null>(null);

  useEffect(() => {
    loadHottestDeals();
  }, []);

  const loadHottestDeals = async () => {
    setLoading(true);
    try {
      const { data: hottestUnits, error } = await supabase
        .from('hottest_unit')
        .select(`
          unit_id,
          override_reason,
          units (
            id,
            unit_number,
            beds,
            price,
            size_sqft,
            dev_id
          )
        `)
        .order('score', { ascending: false })
        .limit(12);

      if (error) throw error;

      if (hottestUnits) {
        const dealsWithDevInfo = await Promise.all(
          hottestUnits.map(async (hot: any) => {
            const unit = hot.units;
            if (!unit) return null;

            const { data: dev } = await supabase
              .from('developments')
              .select('name, developer, images')
              .eq('id', unit.dev_id)
              .single();

            if (!dev) return null;

            return {
              unit_id: unit.id,
              unit_number: unit.unit_number,
              beds: unit.beds,
              price: unit.price,
              size_sqft: unit.size_sqft,
              dev_id: unit.dev_id,
              dev_name: dev.name,
              developer: dev.developer,
              image: dev.images?.[0] || '/placeholder.svg',
              override_reason: hot.override_reason || ''
            };
          })
        );

        setHottestDeals(dealsWithDevInfo.filter(Boolean) as HottestDeal[]);
      }
    } catch (error) {
      console.error('Error loading hottest deals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full py-12 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-muted-foreground">Loading hottest deals...</p>
          </div>
        </div>
      </section>
    );
  }

  if (hottestDeals.length === 0) {
    return null;
  }

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
            {hottestDeals.map((deal) => {
              const pricePerSqft = Math.round(deal.price / deal.size_sqft);
              const firstReason = deal.override_reason.split('\n').find(line => line.trim().length > 0) || '';
              
              return (
                <Card
                  key={deal.unit_id}
                  className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => setSelectedDeal(deal)}
                >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.dev_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <Badge className="absolute top-3 right-3 bg-destructive text-white">
                    <Flame className="h-3 w-3 mr-1" />
                    Hot Deal
                  </Badge>
                </div>

                <div className="p-4">
                  <div className="text-xs text-muted-foreground font-medium mb-1">
                    {deal.developer}
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">
                    {deal.dev_name}
                  </h3>
                  
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-primary">
                      £{deal.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      £{pricePerSqft}/sqft
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>{deal.beds} bed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="h-4 w-4" />
                      <span>{deal.size_sqft} sqft</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {firstReason.replace(/[🔥💰✨📊⏰📞]/g, '').trim()}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>

    {selectedDeal && (
      <HottestDealPopup
        unitId={selectedDeal.unit_id}
        devId={selectedDeal.dev_id}
        devName={selectedDeal.dev_name}
        developer={selectedDeal.developer}
        onClose={() => setSelectedDeal(null)}
        onBookViewing={() => {
          const unitInfo = {
            developmentName: selectedDeal.dev_name,
            developmentId: selectedDeal.dev_id,
            unitId: selectedDeal.unit_id,
            unitNumber: selectedDeal.unit_number
          };
          setSelectedDeal(null);
          onBookViewing(unitInfo);
        }}
      />
    )}
  </>
  );
};

export default BestDealsSection;
