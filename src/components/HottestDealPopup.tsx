import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Flame, Bed, Maximize, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HottestDealPopupProps {
  unitId: string;
  devId: string;
  devName: string;
  developer: string;
  onClose: () => void;
  onBookViewing: () => void;
}

interface UnitDetails {
  unit_number: string;
  beds: number;
  price: number;
  size_sqft: number;
  floor?: number;
  building?: string;
  status: string;
  service_charge?: number;
  aspect?: string;
  completion_date?: string;
}

interface DevelopmentDetails {
  name: string;
  developer: string;
  images: string[];
  location?: string;
  postcode?: string;
}

const HottestDealPopup: React.FC<HottestDealPopupProps> = ({
  unitId,
  devId,
  devName,
  developer,
  onClose,
  onBookViewing
}) => {
  const [unit, setUnit] = useState<UnitDetails | null>(null);
  const [development, setDevelopment] = useState<DevelopmentDetails | null>(null);
  const [reason, setReason] = useState<string>('');
  const [floorplan, setFloorplan] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add('modal-open');
    loadDetails();
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [unitId, devId]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      // Load unit details
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('*')
        .eq('id', unitId)
        .single();

      if (unitError) throw unitError;
      setUnit(unitData);

      // Load development details
      const { data: devData, error: devError } = await supabase
        .from('developments')
        .select('name, developer, images, location, postcode')
        .eq('id', devId)
        .single();

      if (devError) throw devError;
      setDevelopment(devData);

      // Load hottest unit info (reason and floorplan)
      const { data: hotData, error: hotError } = await supabase
        .from('hottest_unit')
        .select('override_reason, floorplan_url')
        .eq('dev_id', devId)
        .maybeSingle();

      if (!hotError && hotData) {
        setReason(hotData.override_reason || '');
        setFloorplan(hotData.floorplan_url || '');
      }
    } catch (error) {
      console.error('Error loading deal details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !unit || !development) {
    return (
      <div className="modal-backdrop">
        <div className="modal-panel">
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const pricePerSqft = Math.round(unit.price / unit.size_sqft);
  const annualServiceCharge = unit.service_charge && unit.size_sqft 
    ? Math.round(unit.service_charge * unit.size_sqft)
    : null;

  return (
    <div className="modal-backdrop">
      <div className="modal-panel modal-panel-wide overflow-hidden flex flex-col h-[95vh] md:h-[90vh]">
        {/* Header */}
        <div className="modal-header flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-destructive text-white">
                  <Flame className="h-3 w-3 mr-1" />
                  Hottest Deal
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-foreground truncate">{development.name}</h2>
              <Badge variant="secondary" className="mt-1 text-xs">{development.developer}</Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="modal-content flex-1 overflow-y-auto">
          {/* Hero Image */}
          {development.images && development.images.length > 0 && (
            <div className="relative h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
              <img
                src={development.images[0]}
                alt={development.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}

          {/* Unit Details */}
          <div className="space-y-6">
            {/* Price and Unit Info */}
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Unit {unit.unit_number}</p>
                  <p className="text-4xl font-bold text-primary">£{unit.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">£{pricePerSqft}/sqft</p>
                </div>
                <Button onClick={onBookViewing} size="lg" className="gap-2">
                  Book Viewing
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bedrooms</p>
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4" />
                    <p className="font-semibold">{unit.beds}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Size</p>
                  <div className="flex items-center gap-2">
                    <Maximize className="h-4 w-4" />
                    <p className="font-semibold">{unit.size_sqft} sqft</p>
                  </div>
                </div>
                {unit.floor && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Floor</p>
                    <p className="font-semibold">{unit.floor}</p>
                  </div>
                )}
                {unit.building && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Building</p>
                    <p className="font-semibold">{unit.building}</p>
                  </div>
                )}
              </div>

              {annualServiceCharge && (
                <div className="pt-4 border-t mt-4">
                  <p className="text-sm text-muted-foreground">Annual Service Charge</p>
                  <p className="font-semibold">£{annualServiceCharge.toLocaleString()}/year</p>
                </div>
              )}
            </div>

            {/* Why This is Hot */}
            {reason && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="h-5 w-5 text-destructive" />
                  <h3 className="font-bold text-lg">Why This Deal is Hot</h3>
                </div>
                <div className="prose prose-sm max-w-none whitespace-pre-line text-foreground">
                  {reason}
                </div>
              </div>
            )}

            {/* Floorplan */}
            {floorplan && (
              <div>
                <h3 className="font-bold text-lg mb-4">Floorplan</h3>
                <div className="rounded-lg overflow-hidden border">
                  <img
                    src={floorplan}
                    alt="Unit floorplan"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Location */}
            {development.location && (
              <div>
                <h3 className="font-bold text-lg mb-4">Location</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{development.location}</p>
                    {development.postcode && (
                      <p className="text-sm text-muted-foreground">{development.postcode}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer flex-shrink-0">
          <Button onClick={onBookViewing} size="lg" className="w-full">
            Book a Viewing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HottestDealPopup;
