import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const YieldCalculator: React.FC = () => {
  const [price, setPrice] = useState(1000000);
  const [rent, setRent] = useState(3500);
  const [serviceCharge, setServiceCharge] = useState(2500);
  const [groundRent, setGroundRent] = useState(350);

  const annualRent = rent * 12;
  const annualCosts = serviceCharge + groundRent;
  const netRent = annualRent - annualCosts;
  const yieldPercent = (netRent / price) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rental Yield Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="yield-price">Property Price (£)</Label>
            <Input
              id="yield-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              step={10000}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rent">Monthly Rent (£)</Label>
            <Input
              id="rent"
              type="number"
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
              step={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service">Service Charge (£/year)</Label>
            <Input
              id="service"
              type="number"
              value={serviceCharge}
              onChange={(e) => setServiceCharge(Number(e.target.value))}
              step={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ground">Ground Rent (£/year)</Label>
            <Input
              id="ground"
              type="number"
              value={groundRent}
              onChange={(e) => setGroundRent(Number(e.target.value))}
              step={50}
            />
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Annual Rent:</span>
            <span>£{annualRent.toLocaleString('en-GB')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Annual Costs:</span>
            <span>£{annualCosts.toLocaleString('en-GB')}</span>
          </div>
          <div className="flex justify-between text-sm font-medium pt-2 border-t">
            <span>Net Annual Income:</span>
            <span>£{netRent.toLocaleString('en-GB')}</span>
          </div>
          
          <div className="text-center pt-3">
            <p className="text-sm text-muted-foreground mb-1">Net Rental Yield</p>
            <p className="text-3xl font-bold text-primary">
              {yieldPercent.toFixed(2)}%
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            This does not include tax, maintenance, or void periods. Consult a financial advisor.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
