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
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle>{t.title} ({shortlist.length})</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">
            Your saved property developments
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto p-4 space-y-4">
          {shortlist.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t.empty}
            </div>
          ) : (
            shortlist.map((dev) => (
              <Card key={dev.name} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex gap-3 p-3">
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={dev.images[0]}
                        alt={dev.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-background/90 hover:bg-background"
                        onClick={() => onRemove(dev.name)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{dev.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{dev.developer}</p>
                      <p className="text-sm font-bold text-primary mb-2">
                        {t.zone} {getLowestPrice(dev)}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {t.zone} {dev.zone}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {dev.nearestTube.walkTime} {t.walk}
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-7"
                          onClick={() => onViewDetails(dev)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {t.viewDetails}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 text-xs h-7"
                          onClick={() => onBookViewing(dev)}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          {t.bookViewing}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 px-2"
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
