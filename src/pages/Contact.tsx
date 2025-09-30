import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, MessageCircle, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import wechatQR from '@/assets/qr_wechat.png';

interface ContactProps {
  onBack: () => void;
}

const Contact: React.FC<ContactProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const FORMSPREE_URL = 'https://formspree.io/f/mnngdrog';

  const handleCopyWeChat = () => {
    navigator.clipboard.writeText('LDN_Properties_2024');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "WeChat ID has been copied to your clipboard"
    });
  };

  const handleEmailClick = () => {
    setIsEmailDialogOpen(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: emailForm.name.trim(),
          email: emailForm.email.trim(),
          phone: emailForm.phone.trim(),
          message: emailForm.message.trim(),
          subject: 'Property Inquiry - Contact Form'
        }),
      });

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "We've received your inquiry and will respond within 24 hours."
        });
        
        setEmailForm({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        
        setIsEmailDialogOpen(false);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission failed",
        description: "Please try again or contact us via WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi, I would like to speak with an expert about London properties."
    );
    window.open(`https://wa.me/447776598031?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Map
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Contact Our Experts
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose your preferred contact method
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Option */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleEmailClick}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Email</CardTitle>
                <CardDescription>
                  Send us an email and we'll respond within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  variant="premium"
                  className="w-full"
                  onClick={handleEmailClick}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  dan.taylor@fulhouse.co.uk
                </p>
              </CardContent>
            </Card>

            {/* WeChat Option */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">WeChat</CardTitle>
                <CardDescription>
                  Connect with us instantly via WeChat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* WeChat QR Code */}
                <div className="flex justify-center">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <img src={wechatQR} alt="WeChat QR Code" className="w-32 h-32 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Scan to connect</p>
                  </div>
                </div>

                {/* WeChat ID */}
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs font-medium mb-1">WeChat ID</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-mono">LDN_Properties_2024</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyWeChat}
                      className="h-8"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Option */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleWhatsAppClick}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">WhatsApp</CardTitle>
                <CardDescription>
                  Get instant responses to your questions
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  variant="premium"
                  className="w-full"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Open WhatsApp
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  Available Mon-Sat, 9AM-7PM
                </p>
                <p className="text-xs text-muted-foreground">
                  Response time: ~5 minutes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <Card className="bg-muted/30">
              <CardContent className="py-8">
                <h3 className="font-semibold text-lg mb-2">Need Immediate Assistance?</h3>
                <p className="text-muted-foreground mb-4">
                  Our expert team is ready to help you find your perfect London property
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="outline" onClick={handleEmailClick}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email Us
                  </Button>
                  <Button variant="outline" onClick={handleWhatsAppClick}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Email Form Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send us an Email</DialogTitle>
            <DialogDescription>
              Fill in the form below and we'll get back to you within 24 hours
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email-name">Full Name *</Label>
              <Input
                id="email-name"
                value={emailForm.name}
                onChange={(e) => setEmailForm({...emailForm, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="email-email">Email Address *</Label>
              <Input
                id="email-email"
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="email-phone">Phone Number *</Label>
              <Input
                id="email-phone"
                type="tel"
                value={emailForm.phone}
                onChange={(e) => setEmailForm({...emailForm, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="email-message">Message *</Label>
              <Textarea
                id="email-message"
                placeholder="Tell us about your property requirements..."
                value={emailForm.message}
                onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                required
                rows={4}
              />
            </div>
            <Button 
              type="submit" 
              variant="premium" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contact;
