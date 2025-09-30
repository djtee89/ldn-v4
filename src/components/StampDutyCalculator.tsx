import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';

const StampDutyCalculator = () => {
  const [propertyPrice, setPropertyPrice] = useState('500000');
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false);
  const [isInternationalBuyer, setIsInternationalBuyer] = useState(false);

  const calculateStampDuty = () => {
    const price = parseFloat(propertyPrice);
    if (isNaN(price)) return 0;

    let duty = 0;

    if (isFirstTimeBuyer && price <= 625000 && !isInternationalBuyer) {
      // First-time buyer relief (not available for international buyers)
      if (price <= 425000) {
        return 0;
      } else {
        // 5% on amount between £425,001 and £625,000
        duty = (price - 425000) * 0.05;
      }
    } else {
      // Standard rates (2024/25)
      if (price <= 250000) {
        duty = 0;
      } else if (price <= 925000) {
        duty = (price - 250000) * 0.05;
      } else if (price <= 1500000) {
        duty = 33750 + (price - 925000) * 0.10;
      } else {
        duty = 91250 + (price - 1500000) * 0.12;
      }
    }

    // Add 2% international buyer surcharge on entire amount
    if (isInternationalBuyer) {
      duty += price * 0.02;
    }

    return duty;
  };

  const duty = calculateStampDuty();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          <CardTitle>Stamp Duty Calculator</CardTitle>
        </div>
        <CardDescription>
          Calculate your stamp duty land tax (SDLT)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="property-price">Property Price (£)</Label>
          <Input
            id="property-price"
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(e.target.value)}
            placeholder="500000"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="first-time-buyer"
              checked={isFirstTimeBuyer}
              onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <Label htmlFor="first-time-buyer" className="cursor-pointer">
              I am a first-time buyer
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="international-buyer"
              checked={isInternationalBuyer}
              onChange={(e) => setIsInternationalBuyer(e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <Label htmlFor="international-buyer" className="cursor-pointer">
              I am an international buyer (non-UK resident)
            </Label>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Stamp Duty Payable</p>
            <p className="text-3xl font-bold text-primary">
              {duty.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Standard rates (2024/25):</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>0% on first £250,000</li>
            <li>5% on £250,001 - £925,000</li>
            <li>10% on £925,001 - £1.5m</li>
            <li>12% on £1.5m+</li>
          </ul>
          <p className="mt-2"><strong>First-time buyer relief:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>0% on properties up to £425,000</li>
            <li>5% on £425,001 - £625,000</li>
          </ul>
          <p className="mt-2"><strong>International buyer surcharge:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Additional 2% on the entire purchase price</li>
            <li>Applies to non-UK residents</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default StampDutyCalculator;
