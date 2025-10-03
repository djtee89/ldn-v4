import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Offer } from '@/data/offers';
import { Gift, Clock, Check, Phone, Mail, Calendar, Info, Copy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface OfferModalProps {
  offer: Offer;
  isOpen: boolean;
  onClose: () => void;
}

const OfferModal: React.FC<OfferModalProps> = ({ offer, isOpen, onClose }) => {
  const { toast } = useToast();
  
  const handleClaimOffer = () => {
    window.open(`/contact-options?development=${encodeURIComponent(offer.development)}&offer=${encodeURIComponent(offer.title)}`, '_blank');
  };

  const handleContactDeveloper = () => {
    window.open(`/contact-options?developer=${encodeURIComponent(offer.developer)}`, '_blank');
  };

  const copyVoucherCode = () => {
    if (offer.voucherCode) {
      navigator.clipboard.writeText(offer.voucherCode);
      toast({
        title: 'Voucher Code Copied',
        description: `${offer.voucherCode} has been copied to your clipboard`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                {offer.developer}
              </div>
              <DialogTitle className="text-2xl md:text-3xl">
                {offer.title}
              </DialogTitle>
              <div className="text-sm text-muted-foreground mt-1">
                {offer.development}
              </div>
            </div>
            <Badge className="bg-primary text-white shrink-0 font-bold">
              Save {offer.savingsAmount}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Hero Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={offer.image}
              alt={offer.development}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-sm text-white font-medium bg-black/70 px-3 py-1.5 rounded">
              <Clock className="h-4 w-4" />
              Offer ends {new Date(offer.expiryDate).toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-lg">
              {offer.description}
            </p>
          </div>

          {/* Voucher Code */}
          {offer.voucherCode && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quote this voucher code when booking:</p>
                  <p className="font-mono font-bold text-2xl text-primary">{offer.voucherCode}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyVoucherCode}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Terms */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Offer Terms
            </h3>
            <div className="space-y-2">
              {offer.terms.map((term, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{term}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Eligibility */}
          <div>
            <h3 className="font-bold text-lg mb-3">Eligibility</h3>
            <div className="space-y-2">
              {offer.eligibility.map((requirement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-sm">{requirement}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* How to Claim */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              How to Claim
            </h3>
            <p className="text-sm">
              {offer.howToClaim}
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <Button 
              onClick={handleClaimOffer}
              className="w-full"
              size="lg"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Viewing to Claim Offer
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleContactDeveloper}
                variant="outline"
                size="lg"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact {offer.developer}
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.open('/contact-options', '_blank')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Get More Info
              </Button>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
            <p className="font-medium mb-1">Need Assistance?</p>
            <p>
              Our team can help you understand the offer details and guide you through the claiming process.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferModal;
