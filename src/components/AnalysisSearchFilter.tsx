import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface AnalysisSearchFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  beds: number[];
  zones: string[];
  completionWindow: string[];
}

const AnalysisSearchFilter: React.FC<AnalysisSearchFilterProps> = ({
  onSearch,
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    beds: [],
    zones: [],
    completionWindow: [],
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleBedsToggle = (beds: number) => {
    const newBeds = filters.beds.includes(beds)
      ? filters.beds.filter(b => b !== beds)
      : [...filters.beds, beds];
    const newFilters = { ...filters, beds: newBeds };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleZoneToggle = (zone: string) => {
    const newZones = filters.zones.includes(zone)
      ? filters.zones.filter(z => z !== zone)
      : [...filters.zones, zone];
    const newFilters = { ...filters, zones: newZones };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const emptyFilters = { beds: [], zones: [], completionWindow: [] };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Search Box */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search postcode, area, development..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 bg-background/95"
        />
      </div>

      {/* Filter Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6 mt-6">
            {/* Bedrooms */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">Bedrooms</Label>
              <div className="space-y-2">
                {[1, 2, 3, 4].map(beds => (
                  <div key={beds} className="flex items-center space-x-2">
                    <Checkbox
                      id={`beds-${beds}`}
                      checked={filters.beds.includes(beds)}
                      onCheckedChange={() => handleBedsToggle(beds)}
                    />
                    <label
                      htmlFor={`beds-${beds}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {beds} bed{beds !== 1 ? 's' : ''}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Zones */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">Zones</Label>
              <div className="space-y-2">
                {['1', '2', '3', '4', '5', '6'].map(zone => (
                  <div key={zone} className="flex items-center space-x-2">
                    <Checkbox
                      id={`zone-${zone}`}
                      checked={filters.zones.includes(zone)}
                      onCheckedChange={() => handleZoneToggle(zone)}
                    />
                    <label
                      htmlFor={`zone-${zone}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Zone {zone}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <Button variant="outline" onClick={resetFilters} className="w-full">
              Reset Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AnalysisSearchFilter;
