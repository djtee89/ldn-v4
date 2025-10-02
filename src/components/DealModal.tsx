import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BestDeal } from '@/data/bestDeals';
import { Flame, MapPin, Bed, Maximize, Check, Phone, Mail, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface DealModalProps {
  deal: BestDeal;
  isOpen: boolean;
  onClose: () => void;
}

const DealModal: React.FC<DealModalProps> = ({ deal, isOpen, onClose }) => {
  const handleBookViewing = () => {
    // TODO: Open booking modal with pre-filled development
    window.open(`/contact-options?development=${encodeURIComponent(deal.developmentName)}`, '_blank');
  };

  const handleContactDeveloper = () => {
    // TODO: Open contact modal for developer
    window.open(`/contact-options?developer=${encodeURIComponent(deal.developer)}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                {deal.developer}
              </div>
              <DialogTitle className="text-2xl md:text-3xl">
                {deal.developmentName}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Unit {deal.unitNumber}
              </div>
            </div>
            <Badge className="bg-destructive text-white shrink-0">
              <Flame className="h-3 w-3 mr-1" />
              Hot Deal
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Left Column - Image & Quick Stats */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={deal.image}
                alt={deal.developmentName}
                className="w-full h-full object-cover"
              />
            </div>

            {deal.floorplanImage && (
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <img
                  src={deal.floorplanImage}
                  alt="Floorplan"
                  className="w-full h-full object-contain bg-muted"
                />
                <div className="absolute top-2 left-2 bg-background/90 px-2 py-1 rounded text-xs font-medium">
                  Floorplan
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Bed className="h-4 w-4" />
                </div>
                <div className="font-bold">{deal.beds}</div>
                <div className="text-xs text-muted-foreground">Bedrooms</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Maximize className="h-4 w-4" />
                </div>
                <div className="font-bold">{deal.sqft}</div>
                <div className="text-xs text-muted-foreground">Sq Ft</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground mb-1">£/sqft</div>
                <div className="font-bold">{deal.pricePerSqft}</div>
                <div className="text-xs text-muted-foreground">Per Sq Ft</div>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-3xl font-bold text-primary mb-1">
                {deal.price}
              </div>
              {deal.availableUntil && (
                <div className="text-sm text-muted-foreground">
                  Offer available until {new Date(deal.availableUntil).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details & CTAs */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Why This Is The Best Deal</h3>
              <p className="text-muted-foreground mb-4">
                {deal.salesPitch}
              </p>
              <div className="space-y-2">
                {deal.whyBestDeal.map((reason, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-bold text-lg">Take Action Now</h3>
              <Button 
                onClick={handleBookViewing}
                className="w-full"
                size="lg"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book a Viewing
              </Button>
              <Button 
                onClick={handleContactDeveloper}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact {deal.developer}
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => window.open('/contact-options', '_blank')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Get Expert Advice
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
              <p className="font-medium mb-1">Need help?</p>
              <p>
                Our property experts are available to provide personalized advice and answer any questions about this opportunity.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DealModal;
