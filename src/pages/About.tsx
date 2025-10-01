import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Building2, Users, MapPin } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ onBack }) => {
  const features = [
    {
      icon: Building2,
      title: "All London New Builds",
      description: "Browse every new development across London in one comprehensive platform"
    },
    {
      icon: MapPin,
      title: "Transparent Information",
      description: "See complete details: prices, floorplans, schools, transport, lifestyle data"
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Connect with our team for personalized support and viewing accompaniment"
    }
  ];

  const benefits = [
    "No more scattered agent listings",
    "Complete transparency on all developments",
    "Direct booking with developers",
    "Expert team support when needed",
    "Comprehensive area and investment data",
    "Schools, transport, and lifestyle information"
  ];

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-premium-gradient p-2 rounded-lg shadow-medium">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-foreground">About LDN</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              London Development Network
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We are a network of premium developers offering exclusive access to London's finest new build properties. 
              Book direct with developers to access the best deals with LDN!
            </p>
          </div>

          {/* Problem & Solution */}
          <Card className="border-2 border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">The Problem We Solve</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Before LDN</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Scattered information across multiple agents</li>
                    <li>• Missing out on new developments</li>
                    <li>• Inconsistent or incomplete data</li>
                    <li>• Time-consuming research process</li>
                    <li>• Relying on individual agent knowledge</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">With LDN</h3>
                  <ul className="space-y-2 text-success">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-foreground">How We Help</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-medium transition-smooth">
                    <CardContent className="p-6">
                      <div className="bg-premium-gradient p-3 rounded-lg w-fit mx-auto mb-4">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* How It Works */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-4">
                  The London Developer Network is a curated network of premium developers across London. 
                  We connect you directly with developers, giving you access to exclusive offers and incentives 
                  that are only available when booking direct.
                </p>
                <p className="mb-4">
                  Browse transparently and see everything yourself: prices, floorplans, schools, transport, lifestyle, investment data.
                  Our platform brings together all the information you need in one place.
                </p>
                <p className="mb-6">
                  Book directly with developers to access special launch offers, early-bird discounts, and exclusive 
                  incentives. Our expert team is also available to guide you, answer questions, and accompany you to viewings.
                </p>
                
                <div className="bg-accent-muted rounded-lg p-6 not-prose">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Your Options</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-background rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Self-Service</h4>
                      <p className="text-sm text-muted-foreground">
                        Browse all developments, compare options, and book viewings directly with developers.
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Expert Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Get personalized guidance from our team who can accompany you to viewings and provide expert advice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Ready to Find Your Perfect London Home?</h2>
            <Button variant="premium" size="lg" onClick={onBack} className="text-lg px-8 py-3">
              Start Browsing Developments
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;