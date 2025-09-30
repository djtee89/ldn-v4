import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from '@/components/ui/drawer';
import { SlidersHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export interface FilterState {
  priceFrom: string;
  priceTo: string;
  tenure: string;
  bedroomsMin: string;
  bedroomsMax: string;
  zones: string[];
  walkToStation: string;
  amenities: string[];
  completedNow: boolean;
  completionYear: string;
  keyword: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultsCount: number;
}

// Price steps as specified
const priceSteps = [
  { value: '200000', label: '£200k' },
  { value: '250000', label: '£250k' },
  { value: '300000', label: '£300k' },
  { value: '350000', label: '£350k' },
  { value: '400000', label: '£400k' },
  { value: '450000', label: '£450k' },
  { value: '500000', label: '£500k' },
  { value: '550000', label: '£550k' },
  { value: '600000', label: '£600k' },
  { value: '650000', label: '£650k' },
  { value: '700000', label: '£700k' },
  { value: '750000', label: '£750k' },
  { value: '800000', label: '£800k' },
  { value: '850000', label: '£850k' },
  { value: '900000', label: '£900k' },
  { value: '950000', label: '£950k' },
  { value: '1000000', label: '£1m' },
  { value: '1250000', label: '£1.25m' },
  { value: '1500000', label: '£1.5m' },
  { value: '1750000', label: '£1.75m' },
  { value: '2000000', label: '£2m' },
  { value: '2250000', label: '£2.25m' },
  { value: '2500000', label: '£2.5m' },
  { value: '2750000', label: '£2.75m' },
  { value: '3000000', label: '£3m' },
  { value: '3500000', label: '£3.5m' },
  { value: '4000000', label: '£4m' },
  { value: '4500000', label: '£4.5m' },
  { value: '5000000', label: '£5m' },
  { value: '6000000', label: '£6m' },
  { value: '7000000', label: '£7m' },
  { value: '7500000', label: '£7.5m' },
  { value: '10000000', label: '£10m' },
  { value: '15000000', label: '£15m' }
];

const bedroomOptions = [
  { value: '0', label: 'Studio' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6+' }
];

const amenitiesList = ['Gym', 'Pool', 'Concierge', '24/7 Security', 'Parking', 'Balcony'];

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, resultsCount }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const isMobile = useIsMobile();
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Sync local filters with prop filters when they change externally
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen && isMobile) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else if (!isDrawerOpen && isMobile) {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isDrawerOpen, isMobile]);

  const updateLocalFilter = (key: keyof FilterState, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = localFilters.amenities.includes(amenity)
      ? localFilters.amenities.filter(a => a !== amenity)
      : [...localFilters.amenities, amenity];
    updateLocalFilter('amenities', newAmenities);
  };

  const handleApply = () => {
    // Validate price range
    if (localFilters.priceFrom && localFilters.priceTo) {
      const from = parseInt(localFilters.priceFrom);
      const to = parseInt(localFilters.priceTo);
      if (from > to) {
        // Swap them
        onFiltersChange({
          ...localFilters,
          priceFrom: localFilters.priceTo,
          priceTo: localFilters.priceFrom
        });
      } else {
        onFiltersChange(localFilters);
      }
    } else {
      onFiltersChange(localFilters);
    }
    
    // Close drawer on mobile and scroll to results
    if (isMobile) {
      setIsDrawerOpen(false);
    }
    
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    const defaultFilters: FilterState = {
      priceFrom: '',
      priceTo: '',
      tenure: 'any',
      bedroomsMin: '',
      bedroomsMax: '',
      zones: [],
      walkToStation: 'any',
      amenities: [],
      completedNow: false,
      completionYear: 'any',
      keyword: ''
    };
    
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    
    // Close drawer on mobile
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  const handleBedroomsMinChange = (value: string) => {
    updateLocalFilter('bedroomsMin', value);
    // Auto-adjust max if needed
    if (localFilters.bedroomsMax && value) {
      const minVal = parseInt(value);
      const maxVal = parseInt(localFilters.bedroomsMax);
      if (minVal > maxVal) {
        updateLocalFilter('bedroomsMax', value);
      }
    }
  };

  const handleBedroomsMaxChange = (value: string) => {
    updateLocalFilter('bedroomsMax', value);
    // Auto-adjust min if needed
    if (localFilters.bedroomsMin && value) {
      const minVal = parseInt(localFilters.bedroomsMin);
      const maxVal = parseInt(value);
      if (minVal > maxVal) {
        updateLocalFilter('bedroomsMin', value);
      }
    }
  };

  const FilterControls = () => (
    <div className="space-y-3">
      {/* Price Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-medium mb-1 block">Price From</Label>
          <Select value={localFilters.priceFrom || undefined} onValueChange={value => updateLocalFilter('priceFrom', value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="No min" />
            </SelectTrigger>
            <SelectContent>
              {priceSteps.map(step => (
                <SelectItem key={step.value} value={step.value}>{step.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium mb-1 block">Price To</Label>
          <Select value={localFilters.priceTo || undefined} onValueChange={value => updateLocalFilter('priceTo', value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="No max" />
            </SelectTrigger>
            <SelectContent>
              {priceSteps.map(step => (
                <SelectItem key={step.value} value={step.value}>{step.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tenure */}
      <div>
        <Label className="text-xs font-medium mb-1 block">Tenure</Label>
        <Select value={localFilters.tenure} onValueChange={value => updateLocalFilter('tenure', value)}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="freehold">Freehold</SelectItem>
            <SelectItem value="leasehold">Leasehold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bedrooms */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-medium mb-1 block">Min Bedrooms</Label>
          <Select value={localFilters.bedroomsMin || undefined} onValueChange={handleBedroomsMinChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="No min" />
            </SelectTrigger>
            <SelectContent>
              {bedroomOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium mb-1 block">Max Bedrooms</Label>
          <Select value={localFilters.bedroomsMax || undefined} onValueChange={handleBedroomsMaxChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="No max" />
            </SelectTrigger>
            <SelectContent>
              {bedroomOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Zone */}
      <div>
        <Label className="text-xs font-medium mb-1 block">London TfL Zone</Label>
        <Select 
          value={localFilters.zones.length > 0 ? localFilters.zones[0] : undefined} 
          onValueChange={value => updateLocalFilter('zones', value ? [value] : [])}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Zone 1</SelectItem>
            <SelectItem value="2">Zone 2</SelectItem>
            <SelectItem value="3">Zone 3</SelectItem>
            <SelectItem value="4">Zone 4</SelectItem>
            <SelectItem value="5">Zone 5</SelectItem>
            <SelectItem value="6">Zone 6</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Walk to Station */}
      <div>
        <Label className="text-xs font-medium mb-1 block">Walk to Station</Label>
        <Select value={localFilters.walkToStation} onValueChange={value => updateLocalFilter('walkToStation', value)}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="5">≤ 5 min</SelectItem>
            <SelectItem value="10">≤ 10 min</SelectItem>
            <SelectItem value="15">≤ 15 min</SelectItem>
            <SelectItem value="20">≤ 20 min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Amenities */}
      <div>
        <Label className="text-xs font-medium mb-1 block">Amenities</Label>
        <div className="grid grid-cols-2 gap-2 h-[52px] overflow-y-auto pr-2 border border-border rounded-md p-2">
          {amenitiesList.map(amenity => (
            <div key={amenity} className="flex items-center space-x-1.5">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={localFilters.amenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
                className="h-2 w-2 min-h-0 min-w-0"
              />
              <Label htmlFor={`amenity-${amenity}`} className="text-xs cursor-pointer">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Mobile view with drawer
  if (isMobile) {
    return (
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  ref={drawerTriggerRef}
                  variant="outline"
                  className="flex items-center gap-2 h-9"
                  aria-expanded={isDrawerOpen}
                  aria-label="Open filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[90vh]">
                <DrawerHeader className="flex items-center justify-between">
                  <DrawerTitle>Filters</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-6 overflow-y-auto">
                  <FilterControls />
                </div>
                <DrawerFooter className="flex flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1 h-9"
                    aria-label="Reset all filters"
                  >
                    Reset
                  </Button>
                  <Button
                    variant="premium"
                    onClick={handleApply}
                    className="flex-1 h-9"
                    aria-label={`Apply filters, showing ${resultsCount} properties`}
                  >
                    Apply ({resultsCount})
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <div className="text-sm text-muted-foreground" aria-live="polite">
              {resultsCount} {resultsCount === 1 ? 'property' : 'properties'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-3">
            {/* Price From/To */}
            <div>
              <Label className="text-xs font-medium mb-1 block">Price From</Label>
              <Select value={localFilters.priceFrom || undefined} onValueChange={value => updateLocalFilter('priceFrom', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="No min" />
                </SelectTrigger>
                <SelectContent>
                  {priceSteps.map(step => (
                    <SelectItem key={step.value} value={step.value}>{step.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium mb-1 block">Price To</Label>
              <Select value={localFilters.priceTo || undefined} onValueChange={value => updateLocalFilter('priceTo', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="No max" />
                </SelectTrigger>
                <SelectContent>
                  {priceSteps.map(step => (
                    <SelectItem key={step.value} value={step.value}>{step.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tenure */}
            <div>
              <Label className="text-xs font-medium mb-1 block">Tenure</Label>
              <Select value={localFilters.tenure} onValueChange={value => updateLocalFilter('tenure', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="freehold">Freehold</SelectItem>
                  <SelectItem value="leasehold">Leasehold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Walk to Station */}
            <div>
              <Label className="text-xs font-medium mb-1 block">Walk to Station</Label>
              <Select value={localFilters.walkToStation} onValueChange={value => updateLocalFilter('walkToStation', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="5">≤ 5 min</SelectItem>
                  <SelectItem value="10">≤ 10 min</SelectItem>
                  <SelectItem value="15">≤ 15 min</SelectItem>
                  <SelectItem value="20">≤ 20 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Bedrooms */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium mb-1 block">Min Bedrooms</Label>
                <Select value={localFilters.bedroomsMin || undefined} onValueChange={handleBedroomsMinChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="No min" />
                  </SelectTrigger>
                  <SelectContent>
                    {bedroomOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1 block">Max Bedrooms</Label>
                <Select value={localFilters.bedroomsMax || undefined} onValueChange={handleBedroomsMaxChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="No max" />
                  </SelectTrigger>
                  <SelectContent>
                    {bedroomOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Zone and Amenities */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium mb-1 block">Zone</Label>
                <Select 
                  value={localFilters.zones.length > 0 ? localFilters.zones[0] : undefined} 
                  onValueChange={value => updateLocalFilter('zones', value ? [value] : [])}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Zone 1</SelectItem>
                    <SelectItem value="2">Zone 2</SelectItem>
                    <SelectItem value="3">Zone 3</SelectItem>
                    <SelectItem value="4">Zone 4</SelectItem>
                    <SelectItem value="5">Zone 5</SelectItem>
                    <SelectItem value="6">Zone 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1 block">Amenities</Label>
                <div className="grid grid-cols-2 gap-1.5 h-[52px] overflow-y-auto pr-1 border border-border rounded-md p-2">
                  {amenitiesList.map(amenity => (
                    <div key={amenity} className="flex items-center space-x-1">
                      <Checkbox
                        id={`desktop-amenity-${amenity}`}
                        checked={localFilters.amenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                        className="h-2 w-2 min-h-0 min-w-0"
                      />
                      <Label htmlFor={`desktop-amenity-${amenity}`} className="text-xs cursor-pointer">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-sm text-muted-foreground" aria-live="polite">
              {resultsCount} {resultsCount === 1 ? 'property' : 'properties'} found
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="h-9"
                aria-label="Reset all filters"
              >
                Reset All
              </Button>
              <Button
                variant="premium"
                onClick={handleApply}
                className="h-9"
                aria-label="Apply filters"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;