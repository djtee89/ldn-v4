import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SlidersHorizontal, ChevronDown, X, MapPin, Home, Coins, Search } from 'lucide-react';
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
  onSearch?: () => void;
}

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

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, resultsCount, onSearch }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const isMobile = useIsMobile();
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

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
    if (localFilters.priceFrom && localFilters.priceTo) {
      const from = parseInt(localFilters.priceFrom);
      const to = parseInt(localFilters.priceTo);
      if (from > to) {
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
    
    if (isMobile) {
      setIsDrawerOpen(false);
    }
    
    if (onSearch) {
      onSearch();
    }
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
    
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  const handleBedroomsMinChange = (value: string) => {
    updateLocalFilter('bedroomsMin', value);
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
    if (localFilters.bedroomsMin && value) {
      const minVal = parseInt(localFilters.bedroomsMin);
      const maxVal = parseInt(value);
      if (minVal > maxVal) {
        updateLocalFilter('bedroomsMin', value);
      }
    }
  };

  const FilterControls = () => (
    <div className="space-y-3.5">
      <div>
        <Label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
          <Coins className="h-3.5 w-3.5" />
          Price Range
        </Label>
        <div className="grid grid-cols-2 gap-2.5">
          <Select value={localFilters.priceFrom || undefined} onValueChange={value => updateLocalFilter('priceFrom', value)}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="No min" />
            </SelectTrigger>
            <SelectContent className="max-h-[240px]">
              {priceSteps.map(step => (
                <SelectItem key={step.value} value={step.value}>{step.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={localFilters.priceTo || undefined} onValueChange={value => updateLocalFilter('priceTo', value)}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="No max" />
            </SelectTrigger>
            <SelectContent className="max-h-[240px]">
              {priceSteps.map(step => (
                <SelectItem key={step.value} value={step.value}>{step.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
          <Home className="h-3.5 w-3.5" />
          Bedrooms
        </Label>
        <div className="grid grid-cols-2 gap-2.5">
          <Select value={localFilters.bedroomsMin || undefined} onValueChange={handleBedroomsMinChange}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="No min" />
            </SelectTrigger>
            <SelectContent>
              {bedroomOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={localFilters.bedroomsMax || undefined} onValueChange={handleBedroomsMaxChange}>
            <SelectTrigger className="h-9 text-xs">
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

      <div>
        <Label className="text-xs font-semibold mb-2 block flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          Location
        </Label>
        <div className="grid grid-cols-2 gap-2.5">
          <Select 
            value={localFilters.zones.length > 0 ? localFilters.zones[0] : undefined} 
            onValueChange={value => updateLocalFilter('zones', value ? [value] : [])}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Any zone" />
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
          <Select value={localFilters.walkToStation} onValueChange={value => updateLocalFilter('walkToStation', value)}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Walk time" />
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

      <div>
        <Label className="text-xs font-semibold mb-2 block">Tenure</Label>
        <Select value={localFilters.tenure} onValueChange={value => updateLocalFilter('tenure', value)}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="freehold">Freehold</SelectItem>
            <SelectItem value="leasehold">Leasehold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-semibold mb-2 block">Amenities</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {amenitiesList.map(amenity => (
            <div key={amenity} className="flex items-center space-x-1.5 p-1.5 rounded-md hover:bg-muted transition-colors">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={localFilters.amenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <Label htmlFor={`amenity-${amenity}`} className="text-xs cursor-pointer flex-1">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getActiveFilterSummary = () => {
    const active = [];
    if (localFilters.zones.length > 0) {
      active.push(`Zone ${localFilters.zones[0]}`);
    }
    if (localFilters.priceFrom || localFilters.priceTo) {
      const from = localFilters.priceFrom ? priceSteps.find(s => s.value === localFilters.priceFrom)?.label : 'Any';
      const to = localFilters.priceTo ? priceSteps.find(s => s.value === localFilters.priceTo)?.label : 'Any';
      active.push(`${from} - ${to}`);
    }
    if (localFilters.bedroomsMin || localFilters.bedroomsMax) {
      const min = localFilters.bedroomsMin ? bedroomOptions.find(b => b.value === localFilters.bedroomsMin)?.label : 'Any';
      const max = localFilters.bedroomsMax ? bedroomOptions.find(b => b.value === localFilters.bedroomsMax)?.label : 'Any';
      active.push(`${min}${min !== max ? ` - ${max}` : ''} bed`);
    }
    return active;
  };

  const hasActiveFilters = getActiveFilterSummary().length > 0;

  if (isMobile) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-3">
          <div className="flex items-center gap-2">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  ref={drawerTriggerRef}
                  variant="outline"
                  size="sm"
                  className="rounded-full shadow-sm h-9 text-xs"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                      {getActiveFilterSummary().length}
                    </span>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[90vh] flex flex-col">
                <DrawerHeader className="border-b">
                  <DrawerTitle className="text-base font-bold">Filter Properties</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 py-5 overflow-y-auto flex-1">
                  <FilterControls />
                </div>
                <DrawerFooter className="flex flex-row gap-2.5 border-t p-3">
                  <Button variant="outline" size="sm" onClick={handleReset} className="flex-1" disabled={!hasActiveFilters}>
                    Reset
                  </Button>
                  <Button size="sm" onClick={handleApply} className="flex-1">
                    Show {resultsCount}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            
            <input
              type="text"
              placeholder="Search..."
              value={localFilters.keyword}
              onChange={(e) => updateLocalFilter('keyword', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApply();
                }
              }}
              className="flex-1 h-9 px-3 text-xs bg-background border border-input rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            
            <Button 
              size="sm" 
              onClick={handleApply}
              className="h-9 px-4 rounded-full font-medium text-xs"
            >
              <Search className="h-3.5 w-3.5 md:mr-1.5" />
              <span className="hidden md:inline">Search</span>
            </Button>
          </div>
          
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {getActiveFilterSummary().map((summary, idx) => (
                <div key={idx} className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">
                  {summary}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-lg border border-border p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <input
            type="text"
            placeholder="Filter by price, beds, zone… then hit Search"
            value={localFilters.keyword}
            onChange={(e) => updateLocalFilter('keyword', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleApply();
              }
            }}
            className="flex-1 h-10 px-4 text-sm bg-background border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full h-9 px-3 gap-1.5 hover:bg-accent transition-all text-xs font-medium"
                >
                  <Coins className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {(localFilters.priceFrom || localFilters.priceTo) 
                      ? `${priceSteps.find(s => s.value === localFilters.priceFrom)?.label || 'Any'} - ${priceSteps.find(s => s.value === localFilters.priceTo)?.label || 'Any'}`
                      : 'Price'}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Select value={localFilters.priceFrom || undefined} onValueChange={value => updateLocalFilter('priceFrom', value)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="No min" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[240px]">
                          {priceSteps.map(step => (
                            <SelectItem key={step.value} value={step.value}>{step.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={localFilters.priceTo || undefined} onValueChange={value => updateLocalFilter('priceTo', value)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="No max" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[240px]">
                          {priceSteps.map(step => (
                            <SelectItem key={step.value} value={step.value}>{step.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full h-9 px-3 gap-1.5 hover:bg-accent transition-all text-xs font-medium"
                >
                  <Home className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {(localFilters.bedroomsMin || localFilters.bedroomsMax)
                      ? `${bedroomOptions.find(b => b.value === localFilters.bedroomsMin)?.label || 'Any'} - ${bedroomOptions.find(b => b.value === localFilters.bedroomsMax)?.label || 'Any'}`
                      : 'Bedrooms'}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Bedrooms</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Select value={localFilters.bedroomsMin || undefined} onValueChange={handleBedroomsMinChange}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="No min" />
                        </SelectTrigger>
                        <SelectContent>
                          {bedroomOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={localFilters.bedroomsMax || undefined} onValueChange={handleBedroomsMaxChange}>
                        <SelectTrigger className="h-9 text-sm">
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
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full h-9 px-3 gap-1.5 hover:bg-accent transition-all text-xs font-medium"
                >
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {localFilters.zones.length > 0 ? `Zone ${localFilters.zones[0]}` : 'Location'}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Location</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Select 
                        value={localFilters.zones.length > 0 ? localFilters.zones[0] : undefined} 
                        onValueChange={value => updateLocalFilter('zones', value ? [value] : [])}
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Any zone" />
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
                      <Select value={localFilters.walkToStation} onValueChange={value => updateLocalFilter('walkToStation', value)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Walk time" />
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
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full h-9 px-3 gap-1.5 hover:bg-accent transition-all text-xs font-medium"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>More</span>
                  {(localFilters.tenure !== 'any' || localFilters.amenities.length > 0) && (
                    <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                      {(localFilters.tenure !== 'any' ? 1 : 0) + localFilters.amenities.length}
                    </span>
                  )}
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-4" align="start">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Tenure</Label>
                    <Select value={localFilters.tenure} onValueChange={value => updateLocalFilter('tenure', value)}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="freehold">Freehold</SelectItem>
                        <SelectItem value="leasehold">Leasehold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Amenities</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {amenitiesList.map(amenity => (
                        <div key={amenity} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
                          <Checkbox
                            id={`amenity-desktop-${amenity}`}
                            checked={localFilters.amenities.includes(amenity)}
                            onCheckedChange={() => toggleAmenity(amenity)}
                          />
                          <Label htmlFor={`amenity-desktop-${amenity}`} className="text-xs cursor-pointer flex-1">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleReset}
                className="rounded-full h-9 px-3 text-muted-foreground hover:text-foreground text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
            
            <Button 
              size="sm" 
              onClick={handleApply}
              className="h-9 px-5 rounded-full font-semibold text-xs shadow-md hover:shadow-lg transition-all"
            >
              <Search className="h-3.5 w-3.5 mr-1.5" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
