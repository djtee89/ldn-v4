import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Calendar, MessageSquare, Eye } from 'lucide-react';
import { Development } from '@/data/newDevelopments';

interface ShortlistDrawerProps {
  open: boolean;
  onClose: () => void;
  shortlist: Development[];
  onRemove: (developmentName: string) => void;
  onViewDetails: (development: Development) => void;
  onBookViewing: (development: Development) => void;
  language: string;
}

const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({
  open,
  onClose,
  shortlist,
  onRemove,
  onViewDetails,
  onBookViewing,
  language,
}) => {
  const t = language === 'zh' ? {
    title: '我的心愿单',
    empty: '您的心愿单为空。开始浏览并点击 ♥ 保存开发项目。',
    viewDetails: '查看详情',
    bookViewing: '预约看房',
    requestInfo: 'WhatsApp咨询',
    zone: '区域',
    walk: '分钟步行',
  } : {
    title: 'My Shortlist',
    empty: 'Your shortlist is empty. Start browsing and tap ♥ to save developments.',
    viewDetails: 'View Details',
    bookViewing: 'Book Viewing',
    requestInfo: 'Request Info',
    zone: 'Zone',
    walk: 'min walk',
  };

  const getLowestPrice = (dev: Development) => {
    const prices = [
      dev.prices.studio,
      dev.prices.oneBed,
      dev.prices.twoBed,
      dev.prices.threeBed,
      dev.prices.fourBed,
    ].filter(Boolean);
    
    if (prices.length > 0) {
      return prices[0];
    }
    return dev.prices.range || 'POA';
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b bg-card">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-bold">{t.title} ({shortlist.length})</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">
            Your saved property developments
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto p-4 space-y-3">
          {shortlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                {t.empty}
              </p>
            </div>
          ) : (
            shortlist.map((dev) => (
              <Card key={dev.name} className="overflow-hidden hover:shadow-medium transition-shadow">
                <CardContent className="p-0">
                  <div className="flex gap-3 p-3">
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={dev.images[0]}
                        alt={dev.name}
                        className="w-24 h-24 object-cover rounded-lg"
                        loading="lazy"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-white shadow-soft hover:bg-white"
                        onClick={() => onRemove(dev.name)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-1">{dev.name}</h3>
                        <p className="text-xs text-muted-foreground">{dev.location}</p>
                      </div>
                      
                      <p className="text-base font-bold text-primary">
                        {getLowestPrice(dev)}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 font-medium">
                          {t.zone} {dev.zone}
                        </Badge>
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 font-medium">
                          {dev.nearestTube.walkTime} {t.walk}
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1.5 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-8 rounded-lg"
                          onClick={() => onViewDetails(dev)}
                        >
                          <Eye className="h-3 w-3" />
                          {t.viewDetails}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 text-xs h-8 rounded-lg"
                          onClick={() => onBookViewing(dev)}
                        >
                          <Calendar className="h-3 w-3" />
                          {t.bookViewing}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-2.5 rounded-lg"
                          onClick={() => {
                            const message = encodeURIComponent(
                              `Hi, I'd like more information about ${dev.name} in ${dev.location}.`
                            );
                            window.open(`https://wa.me/447776598031?text=${message}`, '_blank');
                          }}
                        >
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ShortlistDrawer;
