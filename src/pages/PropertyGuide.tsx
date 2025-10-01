import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calculator, FileText, Users, Building, CheckCircle } from 'lucide-react';
import StampDutyCalculator from '@/components/StampDutyCalculator';

interface PropertyGuideProps {
  onBack: () => void;
}

const PropertyGuide: React.FC<PropertyGuideProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState('500000');
  const [interestRate, setInterestRate] = useState('4.5');
  const [loanTerm, setLoanTerm] = useState('25');

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment.toLocaleString('en-GB', { 
      style: 'currency', 
      currency: 'GBP',
      maximumFractionDigits: 0 
    });
  };

  const steps = [
    {
      title: "Find Your Property",
      description: "Browse developments on our platform or book a viewing",
      icon: Building,
      details: "Use our map to explore London's new builds, filter by your preferences, and shortlist properties."
    },
    {
      title: "Make an Offer",
      description: "Submit your offer through the developer or your agent",
      icon: FileText,
      details: "Once accepted, you'll pay a reservation fee (typically £1,000-£5,000) to secure the property."
    },
    {
      title: "Exchange Contracts",
      description: "Pay 10% deposit and legally commit to the purchase",
      icon: CheckCircle,
      details: "This usually happens 21-28 days after offer acceptance. Your solicitor handles the legal work."
    },
    {
      title: "Complete Purchase",
      description: "Pay the remaining balance and receive your keys",
      icon: Users,
      details: "This happens on the agreed completion date, often when the property is finished being built."
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-y-auto pb-8">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </Button>
          <h1 className="text-3xl font-bold text-foreground">UK Property Purchase Guide</h1>
          <p className="text-muted-foreground mt-2">
            Everything you need to know about buying property in London
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stamp Duty Calculator */}
        <StampDutyCalculator />

        {/* Mortgage Calculator */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              <CardTitle>Mortgage Calculator</CardTitle>
            </div>
            <CardDescription>
              Calculate your estimated monthly mortgage payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="loan-amount">Loan Amount (£)</Label>
                <Input
                  id="loan-amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="500000"
                />
              </div>
              <div>
                <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                <Input
                  id="interest-rate"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="4.5"
                />
              </div>
              <div>
                <Label htmlFor="loan-term">Loan Term (years)</Label>
                <Input
                  id="loan-term"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="25"
                />
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Estimated Monthly Payment</p>
                <p className="text-2xl font-bold text-primary">{calculateMonthlyPayment()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Process */}
        <Card>
          <CardHeader>
            <CardTitle>Property Purchase Process</CardTitle>
            <CardDescription>
              Step-by-step guide to buying your London property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      <p className="text-sm text-foreground">{step.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Professional Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitors & Conveyancers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Essential for handling the legal aspects of your purchase:
              </p>
              <ul className="text-sm space-y-1 text-foreground">
                <li>• Property searches and due diligence</li>
                <li>• Contract review and exchange</li>
                <li>• Stamp duty and land registry</li>
                <li>• Transfer of funds and completion</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                <strong>Cost:</strong> £1,000-£2,000 for a standard purchase
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mortgage Brokers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Help you find the best mortgage deal:
              </p>
              <ul className="text-sm space-y-1 text-foreground">
                <li>• Access to exclusive lender rates</li>
                <li>• Application management</li>
                <li>• Expert advice on product types</li>
                <li>• Support through to completion</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                <strong>Cost:</strong> Often free (paid by lenders) or £300-£500 fee
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Costs */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Costs to Consider</CardTitle>
            <CardDescription>
              Budget for these extra expenses when buying
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-3">Upfront Costs</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Stamp Duty</span>
                    <span className="text-muted-foreground">0-12% of property value</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Survey</span>
                    <span className="text-muted-foreground">£300-£1,500</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Mortgage valuation</span>
                    <span className="text-muted-foreground">£150-£1,500</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Mortgage arrangement fee</span>
                    <span className="text-muted-foreground">£0-£2,000</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-3">Ongoing Costs</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Service charge</span>
                    <span className="text-muted-foreground">£3-£15 per sq ft/year</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Ground rent</span>
                    <span className="text-muted-foreground">£200-£500/year</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Insurance</span>
                    <span className="text-muted-foreground">£150-£500/year</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Council tax</span>
                    <span className="text-muted-foreground">£1,000-£3,000/year</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="bg-premium-gradient text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Need Expert Guidance?</h3>
            <p className="mb-4 opacity-90">
              Our property experts can guide you through every step of the purchase process
            </p>
            <Button 
              variant="outline" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/contact-options')}
            >
              Speak to an Expert
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyGuide;