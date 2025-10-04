import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { AnalysisMode } from '@/pages/Analysis';

interface MethodNoteDialogProps {
  mode: AnalysisMode;
  metric?: string;
}

const methodNotes: Record<string, { title: string; description: string; lastUpdated: string }> = {
  'price-per-sqft': {
    title: 'Price per Square Foot',
    description: 'Calculated from available units in each area. Median values are used to reduce the impact of outliers. Data includes 1-3 bedroom units only.',
    lastUpdated: 'October 2025',
  },
  'yield': {
    title: 'Estimated Yield',
    description: 'Net rental yield estimates based on current market rents and property prices. Assumes typical service charges and ground rent for the area. Estimates are indicative only.',
    lastUpdated: 'October 2025',
  },
  'growth': {
    title: '12-Month Growth',
    description: 'Property price growth over the past 12 months, ranked into quintiles. Based on Land Registry price paid data and comparable market analysis.',
    lastUpdated: 'September 2025',
  },
  'schools': {
    title: 'Schools Rating',
    description: 'Count of Ofsted "Outstanding" rated primary and secondary schools within 1km. Composite score factors in school quality and proximity.',
    lastUpdated: 'September 2025',
  },
  'green': {
    title: 'Green Space',
    description: 'Percentage of green space within 800m radius. Includes parks, gardens, and nature reserves from OpenStreetMap and GLA data.',
    lastUpdated: 'August 2025',
  },
  'noise-air': {
    title: 'Noise & Air Quality',
    description: 'Combined badge based on DEFRA air quality monitoring and noise pollution data. "Good" = low pollution, "OK" = moderate, "Busy" = high traffic areas.',
    lastUpdated: 'July 2025',
  },
  'crime': {
    title: 'Crime Rate',
    description: 'Total recorded crimes per 1,000 residents over 12 months. Data from Metropolitan Police. Categorized relative to London average.',
    lastUpdated: 'September 2025',
  },
};

const MethodNoteDialog: React.FC<MethodNoteDialogProps> = ({ mode, metric }) => {
  const key = metric || mode;
  const note = methodNotes[key];

  if (!note) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Info className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <p className="text-sm">{note.description}</p>
            <p className="text-xs text-muted-foreground">
              <strong>Last updated:</strong> {note.lastUpdated}
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MethodNoteDialog;
