import React, { useState, useEffect } from 'react';
import { Development } from '@/data/newDevelopments';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, MapPin, Train, GraduationCap, Download, Heart, Share2, Car, Calendar, Gift, Copy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { translations } from '@/i18n/translations';
import { PhotoGallery } from '@/components/PhotoGallery';
import { MortgageCalculator } from '@/components/MortgageCalculator';
import { YieldCalculator } from '@/components/YieldCalculator';
import { KrpAskBox } from '@/components/KrpAskBox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { extractAllPrices } from '@/lib/priceParser';
interface Unit {
  id: string;
  unit_number: string;
  beds: number;
  price: number;
  size_sqft: number;
  status: string;
  building?: string;
  completion_date?: string;
  aspect?: string;
  floor?: number;
  service_charge?: number;
}

interface DevelopmentOffer {
  id: string;
  offer_title: string;
  offer_description: string;
  voucher_code: string;
  savings_amount: string;
  expiry_date: string;
  terms: any;
}
interface DevelopmentPopupProps {
  development: Development;
  onClose: () => void;
  onBookViewing: () => void;
  isInShortlist: boolean;
  onToggleShortlist: () => void;
  language: string;
}
const DevelopmentPopup: React.FC<DevelopmentPopupProps> = ({
  development,
  onClose,
  onBookViewing,
  isInShortlist,
  onToggleShortlist,
  language
}) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [hottestUnit, setHottestUnit] = useState<Unit | null>(null);
  const [hottestReason, setHottestReason] = useState<string>('');
  const [hottestFloorplan, setHottestFloorplan] = useState<string>('');
  const [loadingHottest, setLoadingHottest] = useState(false);
  const [developmentOffers, setDevelopmentOffers] = useState<DevelopmentOffer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const {
    toast
  } = useToast();
  const isKRP = development.id === 'kings-road-park-berkeley';

  // Map developer names to logo paths
  const developerLogos: Record<string, string> = {
    'Berkeley Homes': '/logos/berkeley.jpg',
    'Berkeley': '/logos/berkeley.jpg',
    'Barratt Homes': '/logos/barratt.jpg',
    'Barratt London': '/logos/barratt.jpg',
    'Bellway': '/logos/bellway.jpg',
    'Taylor Wimpey': '/logos/taylor-wimpey.jpg',
    'Countryside': '/logos/countryside.jpg',
    'Ballymore': '/logos/ballymore.jpeg',
    'Canary Wharf Group': '/logos/canary-wharf.jpg',
    'Hill': '/logos/hill.jpg',
    'Lendlease': '/logos/lendlease.jpg',
    'London Square': '/logos/london-square.png',
    'Mount Anvil': '/logos/mount-anvil.jpg',
    'Regal London': '/logos/regal.png',
  };

  const developerLogo = development.developer ? developerLogos[development.developer] : null;

  // Body scroll lock
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Load units for KRP
  useEffect(() => {
    if (isKRP) {
      loadUnits();
    }
    loadHottestUnit();
    loadDevelopmentOffers();
  }, [isKRP, development.id]);
  const loadUnits = async () => {
    setLoadingUnits(true);
    try {
      const {
        data,
        error
      } = await supabase.from('units').select('*').eq('dev_id', 'krp').order('beds', {
        ascending: true
      }).order('price', {
        ascending: true
      });
      if (error) throw error;
      setUnits(data || []);
    } catch (error) {
      console.error('Error loading units:', error);
    } finally {
      setLoadingUnits(false);
    }
  };

  const loadHottestUnit = async () => {
    setLoadingHottest(true);
    try {
      const { data: hottest, error: hottestError } = await supabase
        .from('hottest_unit')
        .select('unit_id, override_reason, floorplan_url')
        .eq('dev_id', development.id)
        .maybeSingle();

      if (hottestError) throw hottestError;

      if (hottest?.unit_id) {
        const { data: unit, error: unitError } = await supabase
          .from('units')
          .select('*')
          .eq('id', hottest.unit_id)
          .single();

        if (!unitError && unit) {
          setHottestUnit(unit);
          setHottestReason(hottest.override_reason || '');
          setHottestFloorplan(hottest.floorplan_url || '');
        }
      }
    } catch (error) {
      console.error('Error loading hottest unit:', error);
    } finally {
      setLoadingHottest(false);
    }
  };

  const loadDevelopmentOffers = async () => {
    setLoadingOffers(true);
    try {
      const { data, error } = await supabase
        .from('development_offers')
        .select('*')
        .eq('dev_id', development.id)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevelopmentOffers(data || []);
    } catch (error) {
      console.error('Error loading development offers:', error);
    } finally {
      setLoadingOffers(false);
    }
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Voucher Code Copied',
      description: `${code} has been copied to your clipboard`,
    });
  };
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied',
      description: 'Property link copied to clipboard'
    });
  };
  return <div className="modal-backdrop">
      <div className="modal-panel modal-panel-wide overflow-hidden flex flex-col h-[95vh] md:h-[90vh]">
        {/* Header */}
        <div className="modal-header flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-foreground truncate">{development.name}</h2>
                <Badge variant="secondary" className="mt-1 text-xs">{development.developer}</Badge>
              </div>
              {developerLogo && (
                <img 
                  src={developerLogo} 
                  alt={development.developer} 
                  className="h-12 md:h-16 w-auto object-contain rounded-lg shadow-sm hidden sm:block" 
                />
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={onToggleShortlist} 
                      className="touch-target"
                      aria-pressed={isInShortlist}
                      aria-label={isInShortlist ? 'Remove from shortlist' : 'Add to shortlist'}
                    >
                      <Heart className={`h-4 w-4 md:h-5 md:w-5 ${isInShortlist ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isInShortlist ? 'Remove from shortlist' : 'Add to shortlist'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleShare} className="touch-target hidden sm:flex">
                      <Share2 className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="ghost" size="icon" onClick={onClose} className="touch-target">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="px-3 sm:px-6 pt-2 pb-2 flex-shrink-0">
          <PhotoGallery images={development.images} name={development.name} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="sticky top-0 z-10 bg-background border-b px-3 sm:px-6 py-2 flex-shrink-0 overflow-x-auto">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap min-w-max">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="hottest">🔥 Hottest Unit</TabsTrigger>
              <TabsTrigger value="offers">🎁 Special Offers</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="calculators">Calculators</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <div className="px-3 sm:px-6 py-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-0">
              {/* Pricing Section */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-5">
                  <h4 className="font-semibold text-base mb-4">Pricing</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(() => {
                      const priceData = extractAllPrices(development.prices);
                      
                      return (
                        <>
                          {priceData.studio && (
                            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border">
                              <p className="text-xs text-muted-foreground mb-1">Studio</p>
                              <p className="font-bold text-primary">{priceData.studio}</p>
                            </div>
                          )}
                          {priceData.oneBed && (
                            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border">
                              <p className="text-xs text-muted-foreground mb-1">1 Bedroom</p>
                              <p className="font-bold text-primary">{priceData.oneBed}</p>
                            </div>
                          )}
                          {priceData.twoBed && (
                            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border">
                              <p className="text-xs text-muted-foreground mb-1">2 Bedrooms</p>
                              <p className="font-bold text-primary">{priceData.twoBed}</p>
                            </div>
                          )}
                          {priceData.threeBed && (
                            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border">
                              <p className="text-xs text-muted-foreground mb-1">3 Bedrooms</p>
                              <p className="font-bold text-primary">{priceData.threeBed}</p>
                            </div>
                          )}
                          {priceData.fourBed && (
                            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border">
                              <p className="text-xs text-muted-foreground mb-1">4 Bedrooms</p>
                              <p className="font-bold text-primary">{priceData.fourBed}</p>
                            </div>
                          )}
                          {!priceData.studio && !priceData.oneBed && !priceData.twoBed && !priceData.threeBed && !priceData.fourBed && (
                            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border col-span-2">
                              <p className="text-sm text-muted-foreground">Contact us for pricing information</p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  {development.prices.range && (
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      Full price range: {development.prices.range}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Zone & Tenure */}
              <div className="flex flex-wrap gap-3">
                <Badge className="px-4 py-2 text-base">Zone {development.zone}</Badge>
                <Badge variant="secondary" className="px-4 py-2 text-base">
                  {development.tenure}
                  {units && units.length > 0 && units.some(u => u.service_charge && u.size_sqft) && (
                    <span className="ml-2 text-xs opacity-80">
                      (Service Charge: from £{Math.min(...units.filter(u => u.service_charge && u.size_sqft).map(u => u.service_charge! * u.size_sqft)).toLocaleString()}/yr)
                    </span>
                  )}
                </Badge>
                {isKRP && <Badge variant="secondary" className="px-4 py-2 text-base flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    Underground Parking (2-bed+) • EV Charging
                  </Badge>}
              </div>

              {/* CTA Row */}
              <div className="flex flex-wrap gap-3">
                
                
              </div>

              {/* Location */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{development.location}</p>
                      <p className="text-sm text-muted-foreground">{development.postcode}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transport Chips */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Quick Transport</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {development.nearestTube.station} — {development.nearestTube.line} — {development.nearestTube.walkTime} min
                  </Badge>
                  {isKRP && <Badge variant="secondary" className="text-sm">
                      Imperial Wharf — Overground / Nat Rail — 10 min
                    </Badge>}
                </div>
              </div>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6 mt-0">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">About {development.name}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {development.areaOverview}
                </p>
                
                {isKRP ? (
                  <>
                    <div className="space-y-3 pt-2">
                      <div>
                        <h5 className="font-semibold text-base mb-2">The Development</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          King's Road Park is a landmark regeneration project by Berkeley Homes, transforming a historic gasworks site into a vibrant mixed-use community. The development features contemporary architecture designed by award-winning architects, creating a harmonious blend of modern design and heritage preservation.
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-base mb-2">Heritage & Design</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          At the heart of the development sits a beautifully restored Grade II listed gasholder, now transformed into a stunning public park. This 6-acre green space offers residents and visitors a peaceful retreat with landscaped gardens, walking paths, and community spaces. The architecture celebrates this industrial heritage while providing contemporary living spaces with floor-to-ceiling windows, private balconies, and premium finishes throughout.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-base mb-2">Location & Lifestyle</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Perfectly positioned at the intersection of Chelsea and Fulham, King's Road Park offers the best of both worlds. The iconic King's Road is moments away, lined with designer boutiques, artisan cafes, and world-class restaurants. Fulham's village atmosphere provides local character, with Parsons Green, Eel Brook Common, and the River Thames all within easy reach.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-base mb-2">Views & Aspect</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Upper floor apartments offer breathtaking views across London, with vistas of the City skyline and the Thames. Park-facing homes overlook the central gasholder park, while river-view apartments capture the beauty of the Thames. All residences benefit from excellent natural light and thoughtful orientation.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-base mb-2">Completion Status</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          The development is being delivered in phases, with the first residents moving in from 2022. Key buildings include The Beaumont, The Windsor, and The Wren, each offering distinctive character while maintaining the development's cohesive architectural language. Construction continues on later phases, with completion expected in the coming years.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-base mb-2">Parking & EV Charging</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Underground parking is available for 2-bedroom apartments and larger, with dedicated spaces and secure access. All parking spaces are equipped with electric vehicle charging points, supporting sustainable living and future-proofing your investment.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3 pt-2">
                      <div>
                        <h5 className="font-semibold text-base mb-2">The Development</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {development.name} represents {development.developer}'s commitment to creating exceptional living spaces in prime London locations. This development combines contemporary design with thoughtful amenities to create a true sense of community.
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-base mb-2">Design & Architecture</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          The architecture features clean lines, premium materials, and floor-to-ceiling windows that maximize natural light. Each home is designed with modern living in mind, offering open-plan layouts, high-quality finishes, and attention to detail throughout.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-base mb-2">Location Benefits</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Located in {development.location}, this development offers excellent connectivity across London. Zone {development.zone} location provides fast access to Central London, with {development.nearestTube.station} station just {development.nearestTube.walkTime} minutes away on the {development.nearestTube.line}.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-base mb-2">Community & Lifestyle</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          The surrounding area offers a wealth of amenities, from boutique shops and restaurants to parks and cultural venues. This is more than just a place to live—it's a complete lifestyle destination where everything you need is right at your doorstep.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* KRP Ask Box */}
              {isKRP && <div className="pt-4">
                  <KrpAskBox />
                </div>}
            </TabsContent>

            {/* Hottest Unit Tab */}
            <TabsContent value="hottest" className="mt-0">
              {loadingHottest ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Loading hottest unit...</p>
                  </CardContent>
                </Card>
              ) : hottestUnit ? (
                <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-3xl">🔥</span>
                      <h3 className="text-2xl font-bold">Hottest Deal Right Now</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground mb-1">Unit</p>
                        <p className="text-xl font-bold">{hottestUnit.unit_number}</p>
                      </div>
                      <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground mb-1">Bedrooms</p>
                        <p className="text-xl font-bold">{hottestUnit.beds}</p>
                      </div>
                      <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground mb-1">Size</p>
                        <p className="text-xl font-bold">{hottestUnit.size_sqft.toLocaleString()} sq ft</p>
                      </div>
                      <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground mb-1">Price</p>
                        <p className="text-xl font-bold text-primary">£{hottestUnit.price.toLocaleString()}</p>
                      </div>
                    </div>

                    {(hottestUnit.building || hottestUnit.floor || hottestUnit.aspect) && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {hottestUnit.building && (
                          <div className="bg-background/60 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">Building</p>
                            <p className="font-medium">{hottestUnit.building}</p>
                          </div>
                        )}
                        {hottestUnit.floor !== null && hottestUnit.floor !== undefined && (
                          <div className="bg-background/60 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">Floor</p>
                            <p className="font-medium">{hottestUnit.floor}</p>
                          </div>
                        )}
                        {hottestUnit.aspect && (
                          <div className="bg-background/60 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">Aspect</p>
                            <p className="font-medium">{hottestUnit.aspect}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {hottestReason && (
                      <div className="mt-4 p-4 bg-background/60 rounded-lg border">
                        <h4 className="font-semibold mb-2">Why This Is The Best Deal</h4>
                        <div className="text-sm text-muted-foreground whitespace-pre-line">
                          {hottestReason}
                        </div>
                      </div>
                    )}

                    {hottestFloorplan && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Floorplan</h4>
                        <img 
                          src={hottestFloorplan} 
                          alt="Unit floorplan" 
                          className="w-full rounded border"
                        />
                      </div>
                    )}

                    <div className="pt-4 flex gap-3">
                      <Button onClick={onBookViewing} className="flex-1" size="lg">
                        Book Viewing
                      </Button>
                      <Button variant="outline" onClick={onBookViewing} className="flex-1" size="lg">
                        Request Info
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No hottest unit designated for this development yet.</p>
                    <Button onClick={onBookViewing} className="mt-4">
                      View All Available Units
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Special Offers Tab */}
            <TabsContent value="offers" className="mt-0">
              {loadingOffers ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Loading offers...</p>
                  </CardContent>
                </Card>
              ) : developmentOffers.length > 0 ? (
                <div className="space-y-4">
                  {developmentOffers.map((offer) => (
                    <Card key={offer.id} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Gift className="h-6 w-6 text-primary" />
                            <h3 className="text-xl font-bold">{offer.offer_title}</h3>
                          </div>
                          <Badge className="bg-primary text-white font-bold">
                            Save {offer.savings_amount}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{offer.offer_description}</p>
                        
                        <div className="p-4 bg-background/80 rounded-lg border mb-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Quote this code when booking:</p>
                              <p className="font-mono font-bold text-xl text-primary">{offer.voucher_code}</p>
                            </div>
                            <Button variant="outline" size="icon" onClick={() => copyVoucherCode(offer.voucher_code)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <Button onClick={onBookViewing} className="w-full" size="lg">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Viewing with This Offer
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No special offers available for this development at the moment.</p>
                    <Button onClick={onBookViewing}>Book Viewing</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability" className="mt-0">
              {isKRP ? <div className="space-y-4">
                  {loadingUnits ? <p className="text-center text-muted-foreground py-8">Loading units...</p> : units.length > 0 ? <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Unit</TableHead>
                            <TableHead>Beds</TableHead>
                            <TableHead>Size (sq ft)</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Service Charge</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Building</TableHead>
                            <TableHead>Completion</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {units.map(unit => <TableRow key={unit.id}>
                              <TableCell className="font-medium">{unit.unit_number}</TableCell>
                              <TableCell>{unit.beds}</TableCell>
                              <TableCell>{unit.size_sqft.toLocaleString()}</TableCell>
                              <TableCell className="font-semibold text-primary">
                                £{unit.price.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-sm">
                                {unit.service_charge ? `£${unit.service_charge.toLocaleString()}/yr` : '—'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={unit.status === 'Available' ? 'default' : 'secondary'}>
                                  {unit.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{unit.building || '—'}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {unit.completion_date || '—'}
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline" onClick={onBookViewing}>
                                  Book
                                </Button>
                              </TableCell>
                            </TableRow>)}
                        </TableBody>
                      </Table>
                      <p className="text-xs text-muted-foreground text-center">
                        Live availability and pricing subject to change.
                      </p>
                    </> : <p className="text-center text-muted-foreground py-8">No units currently available.</p>}
                </div> : <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground text-center">
                      Contact us for availability information for this development.
                    </p>
                    <div className="flex justify-center mt-4">
                      <Button onClick={onBookViewing}>Request Information</Button>
                    </div>
                  </CardContent>
                </Card>}
            </TabsContent>

            {/* Amenities Tab */}
            <TabsContent value="amenities" className="mt-0">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-base mb-2">Development Amenities</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Exclusive facilities and features available to residents at this development.
                  </p>
                </div>
                {development.amenities && development.amenities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {development.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-sm px-3 py-1.5">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground text-center">
                        Amenity information will be added soon. Contact us for details about this development's facilities.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Transport Tab */}
            <TabsContent value="transport" className="space-y-6 mt-0">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-5 space-y-5">
                    <div>
                      <h4 className="font-semibold text-base mb-4 flex items-center gap-2">
                        <Train className="h-5 w-5 text-primary" />
                        Nearby Stations & Lines
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start p-3 bg-accent/50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold text-base">{development.nearestTube.station}</p>
                            <p className="text-sm text-muted-foreground mt-1">{development.nearestTube.line}</p>
                            <p className="text-xs text-muted-foreground mt-1">Zone {development.zone}</p>
                          </div>
                          <Badge variant="default" className="text-sm px-3 py-1">
                            {development.nearestTube.walkTime} min walk
                          </Badge>
                        </div>
                        
                        {isKRP && (
                          <div className="flex justify-between items-start p-3 bg-accent/50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-semibold text-base">Imperial Wharf</p>
                              <p className="text-sm text-muted-foreground mt-1">London Overground / National Rail</p>
                              <p className="text-xs text-muted-foreground mt-1">Zone 2/3</p>
                            </div>
                            <Badge variant="default" className="text-sm px-3 py-1">10 min walk</Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-base mb-3">Journey Times to Key Destinations</h4>
                      <div className="space-y-2.5">
                        {isKRP ? (
                          <>
                            <div className="flex justify-between items-center p-2 hover:bg-accent/30 rounded transition-colors">
                              <span className="text-sm">Sloane Square (King's Road)</span>
                              <span className="font-semibold text-sm">~8 mins</span>
                            </div>
                            <div className="flex justify-between items-center p-2 hover:bg-accent/30 rounded transition-colors">
                              <span className="text-sm">South Kensington (Museums)</span>
                              <span className="font-semibold text-sm">~12 mins</span>
                            </div>
                            <div className="flex justify-between items-center p-2 hover:bg-accent/30 rounded transition-colors">
                              <span className="text-sm">Bond Street (Oxford Street)</span>
                              <span className="font-semibold text-sm">~15 mins</span>
                            </div>
                            <div className="flex justify-between items-center p-2 hover:bg-accent/30 rounded transition-colors">
                              <span className="text-sm">Bank / Monument (City)</span>
                              <span className="font-semibold text-sm">~20 mins</span>
                            </div>
                            <div className="flex justify-between items-center p-2 hover:bg-accent/30 rounded transition-colors">
                              <span className="text-sm">King's Cross St. Pancras</span>
                              <span className="font-semibold text-sm">~22 mins</span>
                            </div>
                            <div className="flex justify-between items-center p-2 hover:bg-accent/30 rounded transition-colors">
                              <span className="text-sm">Canary Wharf</span>
                              <span className="font-semibold text-sm">~25 mins</span>
                            </div>
                            <div className="flex justify-between items-center p-2 hover:bg-accent/30 rounded transition-colors">
                              <span className="text-sm">Heathrow Airport (T2/3)</span>
                              <span className="font-semibold text-sm">~45 mins</span>
                            </div>
                            <div className="flex justify-between items-center p-2 hover:bg-accent/30 rounded transition-colors">
                              <span className="text-sm">Gatwick Airport</span>
                              <span className="font-semibold text-sm">~55 mins</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between items-center p-2 hover:bg-accent/30 rounded transition-colors">
                              <span className="text-sm">Oxford Circus</span>
                              <span className="font-semibold text-sm">~15 mins</span>
                            </div>
                            <div className="flex justify-between items-center p-2 hover:bg-accent/30 rounded transition-colors">
                              <span className="text-sm">King's Cross St. Pancras</span>
                              <span className="font-semibold text-sm">~20 mins</span>
                            </div>
                            <div className="flex justify-between items-center p-2 hover:bg-accent/30 rounded transition-colors">
                              <span className="text-sm">Canary Wharf</span>
                              <span className="font-semibold text-sm">~25 mins</span>
                            </div>
                            <div className="flex justify-between items-center p-2 hover:bg-accent/30 rounded transition-colors">
                              <span className="text-sm">Heathrow Airport</span>
                              <span className="font-semibold text-sm">~45 mins</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-base mb-3">Transport Score</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {development.transportScore}
                      </p>
                    </div>

                    {isKRP && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-base mb-3">Additional Transport Options</h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-muted-foreground leading-relaxed">
                            <strong>Bus routes:</strong> Multiple routes serve the area, connecting to Chelsea, South Kensington, Victoria, and beyond.
                          </p>
                          <p className="text-muted-foreground leading-relaxed">
                            <strong>Cycling:</strong> Cycle Superhighway 8 nearby; secure bike storage available in development.
                          </p>
                          <p className="text-muted-foreground leading-relaxed">
                            <strong>Thames Clipper:</strong> River bus services accessible from nearby piers for unique river commute.
                          </p>
                          <p className="text-muted-foreground leading-relaxed">
                            <strong>Road access:</strong> A4/M4 corridor provides direct routes west to Heathrow and M25.
                          </p>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground pt-4 border-t">
                      All journey times are approximate and based on typical off-peak travel. Check TfL Journey Planner for real-time information and alternative routes.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-4 mt-0">
              <div className="mb-4">
                <h4 className="font-semibold text-base mb-2">Nearby Schools & Universities</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The area offers excellent educational facilities, from outstanding primary schools to prestigious secondary institutions and world-class universities.
                </p>
              </div>
              
              {isKRP ? (
                <>
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Primary Schools</h5>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold">Thomas's Fulham</p>
                              <p className="text-sm text-muted-foreground mt-1">Independent Co-ed • Outstanding</p>
                              <p className="text-xs text-muted-foreground mt-1">0.3 miles • 6 min walk</p>
                            </div>
                          </div>
                          <Badge className="bg-green-600">Outstanding</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Fulham Primary School</p>
                            <p className="text-sm text-muted-foreground mt-1">Community Primary • Good Ofsted</p>
                            <p className="text-xs text-muted-foreground mt-1">0.5 miles • 10 min walk</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Parsons Green Prep School</p>
                            <p className="text-sm text-muted-foreground mt-1">Independent Prep • Excellent facilities</p>
                            <p className="text-xs text-muted-foreground mt-1">0.6 miles • 12 min walk</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">St Stephen's C of E Primary</p>
                            <p className="text-sm text-muted-foreground mt-1">Church of England Primary • Outstanding</p>
                            <p className="text-xs text-muted-foreground mt-1">0.4 miles • 8 min walk</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3 pt-4">
                    <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Secondary Schools</h5>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold">Lady Margaret School</p>
                              <p className="text-sm text-muted-foreground mt-1">Girls' Church of England • Outstanding Ofsted</p>
                              <p className="text-xs text-muted-foreground mt-1">0.8 miles • 15 min walk</p>
                            </div>
                          </div>
                          <Badge className="bg-green-600">Outstanding</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold">The London Oratory School</p>
                              <p className="text-sm text-muted-foreground mt-1">Boys' Catholic Secondary • Outstanding Ofsted</p>
                              <p className="text-xs text-muted-foreground mt-1">1.2 miles • 20 min bus</p>
                            </div>
                          </div>
                          <Badge className="bg-green-600">Outstanding</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Chelsea Academy</p>
                            <p className="text-sm text-muted-foreground mt-1">Ages 11-18 • Good Ofsted • Strong academics</p>
                            <p className="text-xs text-muted-foreground mt-1">0.6 miles • 12 min walk</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3 pt-4">
                    <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Independent Schools</h5>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Hill House International School</p>
                            <p className="text-sm text-muted-foreground mt-1">Co-ed Independent • Ages 4-13</p>
                            <p className="text-xs text-muted-foreground mt-1">1.5 miles • 10 min tube to Knightsbridge</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Falkner House</p>
                            <p className="text-sm text-muted-foreground mt-1">Girls' Independent • Ages 3-11</p>
                            <p className="text-xs text-muted-foreground mt-1">1.8 miles • South Kensington</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3 pt-4">
                    <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Universities & Higher Education</h5>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Imperial College London</p>
                            <p className="text-sm text-muted-foreground mt-1">World-leading university • Science, Engineering, Medicine & Business</p>
                            <p className="text-xs text-muted-foreground mt-1">2.2 miles • 15 min tube to South Kensington</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Royal College of Art</p>
                            <p className="text-sm text-muted-foreground mt-1">World's top-ranked art & design university</p>
                            <p className="text-xs text-muted-foreground mt-1">2.5 miles • 15 min tube to South Kensington</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Royal College of Music</p>
                            <p className="text-sm text-muted-foreground mt-1">Leading conservatoire • Performance & Composition</p>
                            <p className="text-xs text-muted-foreground mt-1">2.3 miles • 15 min tube to South Kensington</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">King's College London</p>
                            <p className="text-sm text-muted-foreground mt-1">Russell Group university • Multiple campuses</p>
                            <p className="text-xs text-muted-foreground mt-1">3.5 miles • 25 min tube to Strand Campus</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">London School of Economics (LSE)</p>
                            <p className="text-sm text-muted-foreground mt-1">World-renowned social sciences university</p>
                            <p className="text-xs text-muted-foreground mt-1">3.8 miles • 25 min tube to Holborn</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <>
                  {development.schools && development.schools.length > 0 ? (
                    <>
                      <div className="space-y-3">
                        <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Nearby Schools</h5>
                        {development.schools.map((school: any, index: number) => {
                          // Safely extract school data - handle various data structures
                          let schoolName = 'Unknown School';
                          
                          if (typeof school === 'string') {
                            schoolName = school;
                          } else if (school?.tags?.name && typeof school.tags.name === 'string') {
                            schoolName = school.tags.name;
                          } else if (school?.name && typeof school.name === 'string') {
                            schoolName = school.name;
                          } else if (school?.properties?.name && typeof school.properties.name === 'string') {
                            schoolName = school.properties.name;
                          }
                          
                          const distance = school?.distance_miles || null;
                          const schoolType = school?.type || school?.tags?.amenity || 'school';
                          
                          return (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3 flex-1">
                                    <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="font-semibold">{String(schoolName).replace(/\s*\((Good|Outstanding)\)/, '')}</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {schoolType === 'kindergarten' ? 'Kindergarten' :
                                         schoolType === 'university' ? 'University' :
                                         schoolType === 'college' ? 'College' :
                                         String(schoolName).toLowerCase().includes('primary') ? 'Primary School' : 
                                         String(schoolName).toLowerCase().includes('secondary') || String(schoolName).toLowerCase().includes('academy') || String(schoolName).toLowerCase().includes('high school') ? 'Secondary School' : 
                                         String(schoolName).toLowerCase().includes('college') ? 'College' : 
                                         String(schoolName).toLowerCase().includes('prep') ? 'Preparatory School' : 'School'}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {distance ? `${distance} miles away` : 'Walking distance from development'}
                                      </p>
                                    </div>
                                  </div>
                                  {String(schoolName).toLowerCase().includes('outstanding') && <Badge className="bg-green-600 flex-shrink-0">Outstanding</Badge>}
                                  {String(schoolName).toLowerCase().includes('good') && !String(schoolName).toLowerCase().includes('outstanding') && <Badge variant="secondary" className="flex-shrink-0">Good</Badge>}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      <div className="space-y-3 pt-4">
                        <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Nearby Universities</h5>
                        
                        {development.location.toLowerCase().includes('canary wharf') || development.location.toLowerCase().includes('poplar') || development.location.toLowerCase().includes('e14') ? (
                          <>
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-semibold">Queen Mary University of London</p>
                                    <p className="text-sm text-muted-foreground mt-1">Russell Group university • Mile End Campus</p>
                                    <p className="text-xs text-muted-foreground mt-1">2.5 miles • 15 min tube</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-semibold">University of Greenwich</p>
                                    <p className="text-sm text-muted-foreground mt-1">Modern university • Maritime Greenwich Campus</p>
                                    <p className="text-xs text-muted-foreground mt-1">3 miles • 20 min DLR</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </>
                        ) : development.location.toLowerCase().includes('marylebone') || development.location.toLowerCase().includes('w2') ? (
                          <>
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-semibold">University College London (UCL)</p>
                                    <p className="text-sm text-muted-foreground mt-1">World-leading research university</p>
                                    <p className="text-xs text-muted-foreground mt-1">1.5 miles • 10 min tube to Euston Square</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-semibold">University of Westminster</p>
                                    <p className="text-sm text-muted-foreground mt-1">Regent Campus • Media, Arts & Design</p>
                                    <p className="text-xs text-muted-foreground mt-1">0.8 miles • 15 min walk</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </>
                        ) : (
                          <>
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-semibold">King's College London</p>
                                    <p className="text-sm text-muted-foreground mt-1">Russell Group university • Multiple London campuses</p>
                                    <p className="text-xs text-muted-foreground mt-1">25-30 min by tube</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-semibold">London School of Economics (LSE)</p>
                                    <p className="text-sm text-muted-foreground mt-1">World-renowned for social sciences</p>
                                    <p className="text-xs text-muted-foreground mt-1">30 min by tube to Holborn</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">Contact us for information about schools and universities in this area.</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              <Card className="mt-4 bg-accent/50">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Note:</strong> School catchment areas and admission policies change regularly. Distances and journey times are approximate. Always verify current catchment areas, Ofsted ratings, and admission criteria directly with schools before making decisions.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Map Tab */}
            <TabsContent value="map" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  <iframe width="100%" height="400" frameBorder="0" style={{
                  border: 0
                }} src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${development.coordinates.lat},${development.coordinates.lng}&zoom=15`} allowFullScreen />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Calculators Tab */}
            <TabsContent value="calculators" className="space-y-6 mt-0">
              <MortgageCalculator />
              <YieldCalculator />
            </TabsContent>

            </div>
          </ScrollArea>
        </Tabs>

        {/* Sticky Footer */}
        <div className="modal-footer">
          <Button variant="default" onClick={onBookViewing} className="w-full">
            <Calendar className="mr-2 h-4 w-4" />
            Book Viewing
          </Button>
        </div>
      </div>
    </div>;
};
export default DevelopmentPopup;