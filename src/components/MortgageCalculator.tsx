import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const MortgageCalculator: React.FC = () => {
  const [price, setPrice] = useState(1000000);
  const [deposit, setDeposit] = useState(20);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(25);

  const loanAmount = price * (1 - deposit / 100);
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = years * 12;
  const monthly =
    loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Mortgage Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Property Price (£)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              step={10000}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deposit">Deposit (%)</Label>
            <Input
              id="deposit"
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              min={5}
              max={95}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Interest Rate (%)</Label>
            <Input
              id="rate"
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              step={0.1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="years">Term (Years)</Label>
            <Input
              id="years"
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              min={5}
              max={40}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</p>
            <p className="text-3xl font-bold text-primary">
              £{monthly.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            This is an estimate only. Consult a financial advisor for accurate advice.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
