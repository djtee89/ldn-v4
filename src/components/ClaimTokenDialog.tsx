import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Required fields missing",
        description: "Please provide your name and email.",
        variant: "destructive",
      });
      return;
    }

    const newToken = generateToken();
    setToken(newToken);

    // Log to console for now (would be sent to backend in production)
    console.log('Token claimed:', {
      token: newToken,
      offer: offerTitle,
      development,
      name,
      email,
      phone,
      timestamp: new Date().toISOString(),
    });

    toast({
      title: "Token claimed!",
      description: "Your unique token has been sent to your email.",
    });
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
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7XXX XXXXXX"
              />
            </div>

            <Button type="submit" className="w-full">
              Generate Token
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
