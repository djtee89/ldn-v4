import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface ClaimTokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  offerTitle: string;
  development: string;
}

const ClaimTokenDialog: React.FC<ClaimTokenDialogProps> = ({ isOpen, onClose, offerTitle, development }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const generateToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Required fields missing",
        description: "Please provide your name and email.",
        variant: "destructive",
      });
      return;
    }

    if (!consentGiven) {
      toast({
        title: "Consent required",
        description: "Please accept our privacy policy to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('submit-contact-form', {
        body: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          developmentName: development,
          offerTitle: offerTitle,
          source: 'token_claim',
          honeypot,
          consentGiven,
        },
      });

      if (error) throw error;

      const newToken = generateToken();
      setToken(newToken);

      toast({
        title: "Token claimed!",
        description: "Your unique token has been generated. We'll contact you shortly.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Token copied to clipboard.",
    });
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setPhone('');
    setHoneypot('');
    setConsentGiven(false);
    setToken('');
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claim Your Token</DialogTitle>
          <DialogDescription>
            {token ? 'Your unique token for this offer' : `Claim your token for ${offerTitle} at ${development}`}
          </DialogDescription>
        </DialogHeader>

        {!token ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field - hidden from real users */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                maxLength={255}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7XXX XXXXXX"
                maxLength={20}
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="consent"
                checked={consentGiven}
                onCheckedChange={(checked) => setConsentGiven(checked === true)}
                required
              />
              <label
                htmlFor="consent"
                className="text-sm text-muted-foreground leading-tight cursor-pointer"
              >
                I agree to the{' '}
                <Link to="/privacy-policy" className="text-primary hover:underline" target="_blank">
                  Privacy Policy
                </Link>{' '}
                and consent to my data being processed for this token claim. *
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Generate Token'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <code className="text-xl font-bold tracking-wider">{token}</code>
              <Button
                onClick={copyToken}
                variant="ghost"
                size="sm"
                className="ml-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This token has been sent to {email}. Save it to claim your offer with the developer.
            </p>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClaimTokenDialog;
