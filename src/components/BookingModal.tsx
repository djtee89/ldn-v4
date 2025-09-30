import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { X, Calendar, MessageCircle, Phone, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import wechatQR from '@/assets/qr_wechat.png';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  developmentName: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, developmentName }) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Form states
  const [calendarForm, setCalendarForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });

  const [wechatForm, setWechatForm] = useState({
    name: '',
    email: '',
    phone: '',
    wechatId: ''
  });

  const [agentForm, setAgentForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredTime: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID'; // Replace with your Formspree form ID

  if (!isOpen) return null;

  const handleCopyWeChat = () => {
    navigator.clipboard.writeText('LDN_Properties_2024');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "WeChat ID has been copied to your clipboard"
    });
  };

  const handleCalendarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          development: developmentName,
          name: calendarForm.name.trim(),
          email: calendarForm.email.trim(),
          phone: calendarForm.phone.trim(),
          preferredDate: calendarForm.preferredDate,
          preferredTime: calendarForm.preferredTime || 'Flexible',
          message: calendarForm.message.trim() || 'None',
        }),
      });

      if (response.ok) {
        toast({
          title: "Request sent!",
          description: "We've received your viewing request and will contact you soon."
        });
        
        // Reset form
        setCalendarForm({
          name: '',
          email: '',
          phone: '',
          preferredDate: '',
          preferredTime: '',
          message: ''
        });
        
        onClose();
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

  const handleWeChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "WeChat request submitted",
      description: "Our team will contact you via WeChat within 24 hours."
    });
    onClose();
  };

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Agent callback requested",
      description: "One of our expert agents will call you back within 2 hours."
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-premium max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Book a Viewing</h2>
            <p className="text-sm text-muted-foreground">{developmentName}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Calendar Booking</span>
                <span className="sm:hidden">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="wechat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">WeChat</span>
                <span className="sm:hidden">WeChat</span>
              </TabsTrigger>
              <TabsTrigger value="agent" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">WhatsApp Booking</span>
                <span className="sm:hidden">WhatsApp</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Schedule Your Viewing</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCalendarSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cal-name">Full Name *</Label>
                        <Input
                          id="cal-name"
                          value={calendarForm.name}
                          onChange={(e) => setCalendarForm({...calendarForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cal-email">Email *</Label>
                        <Input
                          id="cal-email"
                          type="email"
                          value={calendarForm.email}
                          onChange={(e) => setCalendarForm({...calendarForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cal-phone">Phone Number *</Label>
                        <Input
                          id="cal-phone"
                          type="tel"
                          value={calendarForm.phone}
                          onChange={(e) => setCalendarForm({...calendarForm, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cal-date">Preferred Date *</Label>
                        <Input
                          id="cal-date"
                          type="date"
                          value={calendarForm.preferredDate}
                          onChange={(e) => setCalendarForm({...calendarForm, preferredDate: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cal-time">Preferred Time</Label>
                      <Input
                        id="cal-time"
                        type="time"
                        value={calendarForm.preferredTime}
                        onChange={(e) => setCalendarForm({...calendarForm, preferredTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cal-message">Message</Label>
                      <Textarea
                        id="cal-message"
                        placeholder="Any specific requirements or questions?"
                        value={calendarForm.message}
                        onChange={(e) => setCalendarForm({...calendarForm, message: e.target.value})}
                      />
                    </div>
                    <Button type="submit" variant="premium" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Viewing Request'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wechat" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connect via WeChat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* WeChat QR Code */}
                  <div className="flex justify-center">
                    <div className="bg-muted rounded-lg p-8 text-center">
                      <img src={wechatQR} alt="WeChat QR Code" className="w-48 h-48 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">Scan QR Code to connect</p>
                    </div>
                  </div>

                  {/* WeChat ID */}
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">WeChat ID</p>
                        <p className="text-lg font-mono">LDN_Properties_2024</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyWeChat}
                        className="flex items-center gap-2"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <form onSubmit={handleWeChatSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="wc-name">Full Name *</Label>
                        <Input
                          id="wc-name"
                          value={wechatForm.name}
                          onChange={(e) => setWechatForm({...wechatForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="wc-email">Email *</Label>
                        <Input
                          id="wc-email"
                          type="email"
                          value={wechatForm.email}
                          onChange={(e) => setWechatForm({...wechatForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="wc-phone">Phone Number *</Label>
                        <Input
                          id="wc-phone"
                          type="tel"
                          value={wechatForm.phone}
                          onChange={(e) => setWechatForm({...wechatForm, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="wc-wechat">Your WeChat ID</Label>
                        <Input
                          id="wc-wechat"
                          value={wechatForm.wechatId}
                          onChange={(e) => setWechatForm({...wechatForm, wechatId: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button type="submit" variant="premium" className="w-full">
                      Submit WeChat Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agent" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">WhatsApp Booking</CardTitle>
                  <CardDescription>
                    Connect with us instantly via WhatsApp for property viewings and inquiries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted rounded-lg p-6 text-center">
                    <MessageCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Chat with us on WhatsApp</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get instant responses to your questions and book viewings directly through WhatsApp
                    </p>
                    <Button
                      variant="premium"
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        const message = encodeURIComponent(
                          `Hi, I'm interested in viewing ${developmentName || 'a property'}. Can you help me book a viewing?`
                        );
                        window.open(`https://wa.me/447776598031?text=${message}`, '_blank');
                      }}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Open WhatsApp
                    </Button>
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    <p>Available Monday - Saturday, 9:00 AM - 7:00 PM</p>
                    <p className="mt-1">Response time: Usually within 5 minutes</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;