import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { offers, Offer } from '@/data/offers';
import ClaimTokenDialog from '@/components/ClaimTokenDialog';
import Header from '@/components/Header';
import { ArrowLeft, Calendar, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShortlist } from '@/hooks/use-shortlist';

const Offers: React.FC = () => {
  const navigate = useNavigate();
  const { shortlist } = useShortlist();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [claimedOffers, setClaimedOffers] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('all');
  const [sort, setSort] = useState<string>('newest');

  const filteredAndSortedOffers = useMemo(() => {
    let result = [...offers];

    // Filter
    if (filter !== 'all') {
      result = result.filter(offer => offer.category === filter);
    }

    // Sort
    result.sort((a, b) => {
      if (sort === 'expiring') {
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      // newest (default order in data is newest)
      return 0;
    });

    return result;
  }, [filter, sort]);

  const handleClaimToken = (offer: Offer) => {
    setSelectedOffer(offer);
  };

  const handleCloseDialog = () => {
    if (selectedOffer) {
      setClaimedOffers(prev => new Set(prev).add(selectedOffer.id));
    }
    setSelectedOffer(null);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      all: 'All',
      furniture: 'Furniture',
      fees: 'Fees',
      cashback: 'Cashback',
      other: 'Other',
    };
    return labels[category] || category;
  };

  return (
    <>
      <Header
        onAboutClick={() => navigate('/')}
        onBookViewingClick={() => navigate('/contact-options')}
        onGuideClick={() => navigate('/')}
        onShortlistClick={() => navigate('/')}
        shortlistCount={shortlist.length}
      />
      
      <div className="min-h-screen bg-background pt-20 pb-12 overflow-y-auto">
        <div className="container mx-auto px-4 max-w-7xl">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Map
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">Current Developer Offers</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Limited-time incentives from leading developers. Claim a digital token and we'll connect you to secure the offer.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="furniture">Furniture</TabsTrigger>
                <TabsTrigger value="fees">Fees</TabsTrigger>
                <TabsTrigger value="cashback">Cashback</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedOffers.map((offer) => {
              const isClaimed = claimedOffers.has(offer.id);
              
              return (
                <Card key={offer.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{offer.title}</CardTitle>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {getCategoryLabel(offer.category)}
                      </span>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {offer.development} — {offer.developer}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <p className="text-sm mb-4">{offer.description}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {offer.eligibility}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button
                      onClick={() => handleClaimToken(offer)}
                      disabled={isClaimed}
                      className="w-full"
                      variant={isClaimed ? "secondary" : "default"}
                    >
                      {isClaimed ? 'Token Claimed' : 'Claim Digital Token'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {filteredAndSortedOffers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No offers found with the selected filters.</p>
            </div>
          )}
        </div>
      </div>

      {selectedOffer && (
        <ClaimTokenDialog
          isOpen={!!selectedOffer}
          onClose={handleCloseDialog}
          offerTitle={selectedOffer.title}
          development={selectedOffer.development}
        />
      )}
    </>
  );
};

export default Offers;
