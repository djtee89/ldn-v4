import React, { useState, useEffect } from 'react';
import { Development } from '@/data/newDevelopments';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, MapPin, Train, GraduationCap, Download, Heart, Share2, Car, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { translations } from '@/i18n/translations';
import { PhotoGallery } from '@/components/PhotoGallery';
import { MortgageCalculator } from '@/components/MortgageCalculator';
import { YieldCalculator } from '@/components/YieldCalculator';
import { KrpAskBox } from '@/components/KrpAskBox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  const {
    toast
  } = useToast();
  const isKRP = development.id === 'kings-road-park-berkeley';

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
  }, [isKRP]);
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
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied',
      description: 'Property link copied to clipboard'
    });
  };
  return <div className="modal-backdrop">
      <div className="modal-panel modal-panel-wide">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">{development.name}</h2>
                <Badge variant="secondary" className="mt-1">{development.developer}</Badge>
              </div>
              {development.developer === 'Berkeley Homes' && (
                <img 
                  src="/logos/berkeley.jpg" 
                  alt="Berkeley Homes" 
                  className="h-16 w-auto object-contain rounded-lg shadow-sm"
                />
              )}
              {development.developer === 'Barratt Homes' && (
                <img 
                  src="/logos/barratt.jpg" 
                  alt="Barratt Homes" 
                  className="h-16 w-auto object-contain rounded-lg shadow-sm"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={onToggleShortlist}>
                      <Heart className={`h-5 w-5 ${isInShortlist ? 'fill-red-500 text-red-500' : ''}`} />
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
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="px-4 sm:px-6 pt-3 pb-2">
          <PhotoGallery images={development.images} name={development.name} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="sticky top-0 z-10 bg-background border-b px-4 sm:px-6 py-2">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="schools">Schools</TabsTrigger>
              
              <TabsTrigger value="calculators">Calculators</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
          </div>

          <div className="modal-body overflow-y-auto max-h-[60vh]">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-0">
              {/* Quick Facts Bar */}
              <div className="flex flex-wrap gap-3">
                {development.prices.oneBed && <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary">
                    <span className="text-sm font-medium">1-bed {development.prices.oneBed}</span>
                  </div>}
                {development.prices.twoBed && <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary">
                    <span className="text-sm font-medium">2-bed {development.prices.twoBed}</span>
                  </div>}
                {development.prices.threeBed && <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary">
                    <span className="text-sm font-medium">3-bed {development.prices.threeBed}</span>
                  </div>}
              </div>

              {/* Zone & Tenure */}
              <div className="flex flex-wrap gap-3">
                <Badge className="px-4 py-2 text-base">Zone {development.zone}</Badge>
                <Badge variant="secondary" className="px-4 py-2 text-base">{development.tenure}</Badge>
                {isKRP && <Badge variant="secondary" className="px-4 py-2 text-base flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    Underground (2-bed+) • EV points
                  </Badge>}
              </div>

              {/* CTA Row */}
              <div className="flex flex-wrap gap-3">
                <Button variant="default" size="lg" onClick={onBookViewing} className="flex-1 min-w-[200px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book a viewing
                </Button>
                <Button variant="outline" size="lg" className="flex-1 min-w-[200px]">
                  <Download className="mr-2 h-4 w-4" />
                  Download brochure
                </Button>
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

              {/* Unique Value */}
              <div className="space-y-3">
                <h4 className="font-semibold">About this development</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {development.areaOverview}
                </p>
                {isKRP && <>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong>Landmark & views:</strong> Public park encircles a restored Grade II listed gasholder; upper floors may see the City and the Thames.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong>Green space:</strong> 6 acres of parkland and landscaped gardens; near Eel Brook Common and Parsons Green.
                    </p>
                  </>}
              </div>

              {/* Status */}
              {isKRP && <p className="text-xs text-muted-foreground">
                  Phased completion; first residents 2022. Key buildings: The Beaumont, The Windsor, The Wren. Construction ongoing.
                </p>}

              {/* KRP Ask Box */}
              {isKRP && <div className="pt-4">
                  <KrpAskBox />
                </div>}
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
              <div className="flex flex-wrap gap-2">
                {development.amenities.map((amenity, index) => <Badge key={index} variant="secondary" className="text-sm px-3 py-1.5">
                    {amenity}
                  </Badge>)}
              </div>
            </TabsContent>

            {/* Transport Tab */}
            <TabsContent value="transport" className="space-y-6 mt-0">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Train className="h-4 w-4 text-primary" />
                      Stations & Lines
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{development.nearestTube.station}</p>
                          <p className="text-sm text-muted-foreground">{development.nearestTube.line}</p>
                        </div>
                        <Badge variant="secondary">{development.nearestTube.walkTime} min walk</Badge>
                      </div>
                      {isKRP && <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Imperial Wharf</p>
                            <p className="text-sm text-muted-foreground">Overground / National Rail</p>
                          </div>
                          <Badge variant="secondary">10 min walk</Badge>
                        </div>}
                    </div>
                  </div>

                  {isKRP && <div>
                      <h4 className="font-semibold mb-3">Typical Journeys</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bond Street</span>
                          <span className="font-medium">~15 mins</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bank/Monument</span>
                          <span className="font-medium">~20 mins</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">UCL (Euston Square)</span>
                          <span className="font-medium">~25 mins</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Heathrow (T2/3)</span>
                          <span className="font-medium">~45 mins</span>
                        </div>
                      </div>
                    </div>}

                  <p className="text-xs text-muted-foreground pt-4 border-t">
                    {development.transportScore}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Indicative journey times. Check TfL for live information.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schools Tab */}
            <TabsContent value="schools" className="space-y-4 mt-0">
              {development.schools.map((school, index) => <Card key={index}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <span className="font-medium">{school}</span>
                    </div>
                    {school.toLowerCase().includes('outstanding') && <Badge className="bg-green-600">Outstanding</Badge>}
                  </CardContent>
                </Card>)}
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm">
                    <strong>Nearby hospital:</strong> {development.hospital}
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

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-4 mt-0">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">What is the tenure?</h4>
                  <p className="text-sm text-muted-foreground">{development.tenure}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">What amenities are included?</h4>
                  <p className="text-sm text-muted-foreground">
                    {development.amenities.slice(0, 3).join(', ')}, and more.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">How do I book a viewing?</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the "Book a viewing" button or contact our team directly.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
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