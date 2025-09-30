import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { X, Calendar, MessageCircle, Phone, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const handleCalendarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Viewing request submitted",
      description: "We'll contact you shortly to confirm your viewing appointment."
    });
    onClose();
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
                <span className="hidden sm:inline">Request Agent</span>
                <span className="sm:hidden">Agent</span>
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
                    <Button type="submit" variant="premium" className="w-full">
                      Submit Viewing Request
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
                  {/* WeChat QR Code Placeholder */}
                  <div className="flex justify-center">
                    <div className="bg-muted rounded-lg p-8 text-center">
                      <div className="w-32 h-32 bg-card border-2 border-dashed border-border rounded-lg flex items-center justify-center mb-4 mx-auto">
                        <MessageCircle className="h-12 w-12 text-muted-foreground" />
                      </div>
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
                  <CardTitle className="text-lg">Request Expert Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAgentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ag-name">Full Name *</Label>
                        <Input
                          id="ag-name"
                          value={agentForm.name}
                          onChange={(e) => setAgentForm({...agentForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="ag-email">Email *</Label>
                        <Input
                          id="ag-email"
                          type="email"
                          value={agentForm.email}
                          onChange={(e) => setAgentForm({...agentForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="ag-phone">Phone Number *</Label>
                        <Input
                          id="ag-phone"
                          type="tel"
                          value={agentForm.phone}
                          onChange={(e) => setAgentForm({...agentForm, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="ag-time">Preferred Call Time</Label>
                        <Input
                          id="ag-time"
                          placeholder="e.g., Weekdays 9-5pm"
                          value={agentForm.preferredTime}
                          onChange={(e) => setAgentForm({...agentForm, preferredTime: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="ag-message">How can we help?</Label>
                      <Textarea
                        id="ag-message"
                        placeholder="Tell us about your requirements and preferences..."
                        value={agentForm.message}
                        onChange={(e) => setAgentForm({...agentForm, message: e.target.value})}
                      />
                    </div>
                    <Button type="submit" variant="premium" className="w-full">
                      Request Callback
                    </Button>
                  </form>
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