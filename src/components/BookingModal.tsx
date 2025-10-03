import React, { useState, useEffect, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { X, Calendar, MessageCircle, Phone, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import wechatQR from '@/assets/qr_wechat.png';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const HCAPTCHA_SITE_KEY = '10000000-ffff-ffff-ffff-000000000001'; // Test key - replace with real key in production

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  developmentName: string;
  developmentId?: string;
  unitId?: string;
  unitNumber?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  developmentName,
  developmentId,
  unitId,
  unitNumber
}) => {
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
    message: '',
    voucherCode: '',
    honeypot: '', // Hidden field for bot detection
    consentGiven: false // GDPR consent
  });

  const [wechatForm, setWechatForm] = useState({
    name: '',
    email: '',
    phone: '',
    wechatId: '',
    honeypot: '',
    consentGiven: false
  });

  const [agentForm, setAgentForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredTime: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const trapRef = useFocusTrap<HTMLDivElement>();
  const calendarCaptchaRef = useRef<HCaptcha>(null);
  const wechatCaptchaRef = useRef<HCaptcha>(null);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

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
    
    // Client-side validation
    if (!calendarForm.consentGiven) {
      toast({
        title: "Consent required",
        description: "Please accept the privacy policy to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!captchaToken) {
      toast({
        title: "Verification required",
        description: "Please complete the security verification.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Save viewing request to database
      const { error: dbError } = await supabase
        .from('viewing_requests')
        .insert({
          development_id: developmentId || developmentName.toLowerCase().replace(/\s+/g, '-'),
          development_name: developmentName,
          unit_id: unitId || null,
          unit_number: unitNumber || null,
          name: calendarForm.name.trim(),
          email: calendarForm.email.trim(),
          phone: calendarForm.phone.trim(),
          preferred_date: calendarForm.preferredDate,
          preferred_time: calendarForm.preferredTime || 'Flexible',
          message: calendarForm.message?.trim() || null,
          voucher_code: calendarForm.voucherCode?.trim() || null,
          source: 'calendar_booking',
          user_id: session?.user?.id || null
        });

      if (dbError) throw dbError;

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
        message: '',
        voucherCode: '',
        honeypot: '',
        consentGiven: false
      });
      setCaptchaToken('');
      calendarCaptchaRef.current?.resetCaptcha();
      
      onClose();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again or contact us via WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWeChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wechatForm.consentGiven) {
      toast({
        title: "Consent required",
        description: "Please accept the privacy policy to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!captchaToken) {
      toast({
        title: "Verification required",
        description: "Please complete the security verification.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('submit-contact-form', {
        body: {
          name: wechatForm.name,
          email: wechatForm.email,
          phone: wechatForm.phone,
          message: `WeChat ID: ${wechatForm.wechatId || 'Not provided'}`,
          developmentName: developmentName,
          source: 'wechat_booking',
          honeypot: wechatForm.honeypot,
          consentGiven: wechatForm.consentGiven,
          captchaToken: captchaToken
        },
        headers: session?.access_token ? {
          Authorization: `Bearer ${session.access_token}`
        } : {}
      });

      if (error) throw error;

      toast({
        title: "WeChat request submitted",
        description: "Our team will contact you via WeChat within 24 hours."
      });
      
      setWechatForm({
        name: '',
        email: '',
        phone: '',
        wechatId: '',
        honeypot: '',
        consentGiven: false
      });
      setCaptchaToken('');
      wechatCaptchaRef.current?.resetCaptcha();
      
      onClose();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hi, I'm interested in ${developmentName}. Can you help me?`;
    const whatsappUrl = `https://wa.me/447365472552?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose(); // Close modal after opening WhatsApp
    toast({
      title: "Opening WhatsApp",
      description: "Our agent will respond shortly."
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Book a viewing — ${developmentName}`}
        className="modal-panel modal-panel-wide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Book a Viewing</h2>
              <p className="text-sm text-muted-foreground">{developmentName}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close booking modal">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="modal-body">
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
                  <form onSubmit={handleCalendarSubmit} id="calendar-form" className="space-y-4">
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
                      <Label htmlFor="cal-time">Preferred Time *</Label>
                      <select
                        id="cal-time"
                        value={calendarForm.preferredTime}
                        onChange={(e) => setCalendarForm({...calendarForm, preferredTime: e.target.value})}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select a time</option>
                        {Array.from({ length: 29 }, (_, i) => {
                          const hour = Math.floor(i / 4) + 10;
                          const minute = (i % 4) * 15;
                          if (hour >= 17 && minute > 0) return null;
                          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                          return <option key={timeStr} value={timeStr}>{timeStr}</option>;
                        }).filter(Boolean)}
                      </select>
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
                    
                    <div>
                      <Label htmlFor="cal-voucher">Voucher Code (Optional)</Label>
                      <Input
                        id="cal-voucher"
                        type="text"
                        placeholder="e.g., WOOD10K, KRP10K"
                        value={calendarForm.voucherCode}
                        onChange={(e) => setCalendarForm({...calendarForm, voucherCode: e.target.value.toUpperCase()})}
                      />
                    </div>
                    
                    {/* Honeypot field - hidden from users, catches bots */}
                    <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                      <Input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={calendarForm.honeypot}
                        onChange={(e) => setCalendarForm({...calendarForm, honeypot: e.target.value})}
                      />
                    </div>
                    
                    {/* GDPR Consent */}
                    <div className="flex items-start gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="cal-consent"
                        checked={calendarForm.consentGiven}
                        onChange={(e) => setCalendarForm({...calendarForm, consentGiven: e.target.checked})}
                        required
                        className="mt-1"
                      />
                      <Label htmlFor="cal-consent" className="text-xs leading-tight cursor-pointer">
                        I agree to the <a href="/privacy-policy" target="_blank" className="text-primary underline">Privacy Policy</a> and consent to my personal data being processed for this booking request. *
                      </Label>
                    </div>
                    
                    {/* hCaptcha */}
                    <div className="flex justify-center pt-2">
                      <HCaptcha
                        ref={calendarCaptchaRef}
                        sitekey={HCAPTCHA_SITE_KEY}
                        onVerify={(token) => setCaptchaToken(token)}
                        onExpire={() => setCaptchaToken('')}
                      />
                    </div>
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
                  <form onSubmit={handleWeChatSubmit} id="wechat-form" className="space-y-4">
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
                    
                    {/* Honeypot field */}
                    <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                      <Input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={wechatForm.honeypot}
                        onChange={(e) => setWechatForm({...wechatForm, honeypot: e.target.value})}
                      />
                    </div>
                    
                    {/* GDPR Consent */}
                    <div className="flex items-start gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="wc-consent"
                        checked={wechatForm.consentGiven}
                        onChange={(e) => setWechatForm({...wechatForm, consentGiven: e.target.checked})}
                        required
                        className="mt-1"
                      />
                      <Label htmlFor="wc-consent" className="text-xs leading-tight cursor-pointer">
                        I agree to the <a href="/privacy-policy" target="_blank" className="text-primary underline">Privacy Policy</a> and consent to my personal data being processed for this request. *
                      </Label>
                    </div>
                    
                    {/* hCaptcha */}
                    <div className="flex justify-center pt-2">
                      <HCaptcha
                        ref={wechatCaptchaRef}
                        sitekey={HCAPTCHA_SITE_KEY}
                        onVerify={(token) => setCaptchaToken(token)}
                        onExpire={() => setCaptchaToken('')}
                      />
                    </div>
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

        {/* Sticky Footer */}
        <div className="modal-footer">
          {activeTab === 'calendar' && (
            <Button 
              type="submit" 
              form="calendar-form" 
              variant="premium" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Viewing Request'}
            </Button>
          )}
          {activeTab === 'wechat' && (
            <Button 
              type="submit" 
              form="wechat-form" 
              variant="premium" 
              className="w-full"
            >
              Submit WeChat Request
            </Button>
          )}
          {activeTab === 'agent' && (
            <Button
              variant="premium"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;