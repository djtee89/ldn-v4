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
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                {offer.developer}
              </div>
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl">
                {offer.title}
              </DialogTitle>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                {offer.development}
              </div>
            </div>
            <Badge className="bg-primary text-white shrink-0 font-bold self-start">
              Save {offer.savingsAmount}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-0 px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Hero Image */}
          {offer.image && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={offer.image}
                alt={offer.development}
                className="w-full h-full object-cover"
              />
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex items-center gap-1 text-xs sm:text-sm text-white font-medium bg-black/70 px-2 sm:px-3 py-1 sm:py-1.5 rounded">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Offer ends</span>
              <span className="sm:hidden">Ends</span> {new Date(offer.expiryDate).toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'short',
                year: 'numeric'
              })}
            </div>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="text-base sm:text-lg">
              {offer.description}
            </p>
          </div>

          {/* Voucher Code */}
          {offer.voucherCode && (
            <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Quote this voucher code when booking:</p>
                  <p className="font-mono font-bold text-lg sm:text-2xl text-primary break-all">{offer.voucherCode}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyVoucherCode}
                  className="shrink-0 self-start sm:self-center"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Terms */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Offer Terms
            </h3>
            <div className="space-y-2">
              {offer.terms.map((term, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">{term}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Eligibility */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3">Eligibility</h3>
            <div className="space-y-2">
              {offer.eligibility.map((requirement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">{requirement}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* How to Claim */}
          <div className="p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="font-bold text-base sm:text-lg mb-2 flex items-center gap-2">
              <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              How to Claim
            </h3>
            <p className="text-xs sm:text-sm">
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
              <span className="hidden sm:inline">Book Viewing to Claim Offer</span>
              <span className="sm:hidden">Book Viewing</span>
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Button 
                onClick={handleContactDeveloper}
                variant="outline"
                size="lg"
              >
                <Phone className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Contact {offer.developer}</span>
                <span className="sm:hidden">Contact</span>
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.open('/contact-options', '_blank')}
              >
                <Mail className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Get More Info</span>
                <span className="sm:hidden">Info</span>
              </Button>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-muted rounded-lg text-xs sm:text-sm text-muted-foreground">
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
