import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from '@/components/ui/drawer';
import { SlidersHorizontal, X } from 'lucide-react';
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
const priceSteps = [{
  value: '200000',
  label: '£200k'
}, {
  value: '250000',
  label: '£250k'
}, {
  value: '300000',
  label: '£300k'
}, {
  value: '350000',
  label: '£350k'
}, {
  value: '400000',
  label: '£400k'
}, {
  value: '450000',
  label: '£450k'
}, {
  value: '500000',
  label: '£500k'
}, {
  value: '550000',
  label: '£550k'
}, {
  value: '600000',
  label: '£600k'
}, {
  value: '650000',
  label: '£650k'
}, {
  value: '700000',
  label: '£700k'
}, {
  value: '750000',
  label: '£750k'
}, {
  value: '800000',
  label: '£800k'
}, {
  value: '850000',
  label: '£850k'
}, {
  value: '900000',
  label: '£900k'
}, {
  value: '950000',
  label: '£950k'
}, {
  value: '1000000',
  label: '£1m'
}, {
  value: '1250000',
  label: '£1.25m'
}, {
  value: '1500000',
  label: '£1.5m'
}, {
  value: '1750000',
  label: '£1.75m'
}, {
  value: '2000000',
  label: '£2m'
}, {
  value: '2250000',
  label: '£2.25m'
}, {
  value: '2500000',
  label: '£2.5m'
}, {
  value: '2750000',
  label: '£2.75m'
}, {
  value: '3000000',
  label: '£3m'
}, {
  value: '3500000',
  label: '£3.5m'
}, {
  value: '4000000',
  label: '£4m'
}, {
  value: '4500000',
  label: '£4.5m'
}, {
  value: '5000000',
  label: '£5m'
}, {
  value: '6000000',
  label: '£6m'
}, {
  value: '7000000',
  label: '£7m'
}, {
  value: '7500000',
  label: '£7.5m'
}, {
  value: '10000000',
  label: '£10m'
}, {
  value: '15000000',
  label: '£15m'
}];
const bedroomOptions = [{
  value: '0',
  label: 'Studio'
}, {
  value: '1',
  label: '1'
}, {
  value: '2',
  label: '2'
}, {
  value: '3',
  label: '3'
}, {
  value: '4',
  label: '4'
}, {
  value: '5',
  label: '5'
}, {
  value: '6',
  label: '6+'
}];
const amenitiesList = ['Gym', 'Pool', 'Concierge', '24/7 Security', 'Parking', 'EV charging', 'Bike storage', 'Storage locker', 'Balcony', 'Terrace', 'Garden', 'Air conditioning', 'Underfloor heating', 'Lift/Elevator', 'Accessible/Step-free', 'Co-working space', 'Cinema', 'Residents\' lounge', 'Spa/Sauna', 'Pet-friendly'];
const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  resultsCount
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };
  const toggleZone = (zone: string) => {
    const newZones = filters.zones.includes(zone) ? filters.zones.filter(z => z !== zone) : [...filters.zones, zone];
    updateFilter('zones', newZones);
  };
  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity) ? filters.amenities.filter(a => a !== amenity) : [...filters.amenities, amenity];
    updateFilter('amenities', newAmenities);
  };
  const resetFilters = () => {
    onFiltersChange({
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
    });
    setIsDrawerOpen(false);
  };
  const handleBedroomsMinChange = (value: string) => {
    updateFilter('bedroomsMin', value);
    // Ensure max is not less than min
    if (filters.bedroomsMax && value && parseInt(value) > parseInt(filters.bedroomsMax)) {
      updateFilter('bedroomsMax', value);
    }
  };
  const handleBedroomsMaxChange = (value: string) => {
    updateFilter('bedroomsMax', value);
    // Ensure min is not greater than max
    if (filters.bedroomsMin && value && parseInt(filters.bedroomsMin) > parseInt(value)) {
      updateFilter('bedroomsMin', value);
    }
  };
  const FilterControls = () => <div className="space-y-3">
      {/* Price Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-medium mb-1 block">Price From</Label>
          <Select value={filters.priceFrom || undefined} onValueChange={value => updateFilter('priceFrom', value)}>
            <SelectTrigger>
              <SelectValue placeholder="No min" />
            </SelectTrigger>
            <SelectContent>
              {priceSteps.map(step => <SelectItem key={step.value} value={step.value}>{step.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium mb-1 block">Price To</Label>
          <Select value={filters.priceTo || undefined} onValueChange={value => updateFilter('priceTo', value)}>
            <SelectTrigger>
              <SelectValue placeholder="No max" />
            </SelectTrigger>
            <SelectContent>
              {priceSteps.map(step => <SelectItem key={step.value} value={step.value}>{step.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tenure */}
      <div>
        <Label className="text-xs font-medium mb-1 block">Tenure</Label>
        <Select value={filters.tenure} onValueChange={value => updateFilter('tenure', value)}>
          <SelectTrigger>
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
          <Select value={filters.bedroomsMin || undefined} onValueChange={handleBedroomsMinChange}>
            <SelectTrigger>
              <SelectValue placeholder="No min" />
            </SelectTrigger>
            <SelectContent>
              {bedroomOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium mb-1 block">Max Bedrooms</Label>
          <Select value={filters.bedroomsMax || undefined} onValueChange={handleBedroomsMaxChange}>
            <SelectTrigger>
              <SelectValue placeholder="No max" />
            </SelectTrigger>
            <SelectContent>
              {bedroomOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Zones */}
      <div>
        <Label className="text-xs font-medium mb-1 block">London TfL Zones</Label>
        <div className="grid grid-cols-3 gap-2 max-h-24 overflow-y-auto pr-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(zone => <div key={zone} className="flex items-center space-x-1.5">
              <Checkbox id={`zone-${zone}`} checked={filters.zones.includes(zone.toString())} onCheckedChange={() => toggleZone(zone.toString())} />
              <Label htmlFor={`zone-${zone}`} className="text-xs cursor-pointer">
                Zone {zone}
              </Label>
            </div>)}
        </div>
      </div>

      {/* Walk to Station */}
      <div>
        <Label className="text-xs font-medium mb-1 block">Walk to Station</Label>
        <Select value={filters.walkToStation} onValueChange={value => updateFilter('walkToStation', value)}>
          <SelectTrigger>
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
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-2">
          {amenitiesList.map(amenity => <div key={amenity} className="flex items-center space-x-1.5">
              <Checkbox id={`amenity-${amenity}`} checked={filters.amenities.includes(amenity)} onCheckedChange={() => toggleAmenity(amenity)} />
              <Label htmlFor={`amenity-${amenity}`} className="text-xs cursor-pointer">
                {amenity}
              </Label>
            </div>)}
        </div>
      </div>

      {/* Completion */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="completed-now" className="text-xs">Completed (ready now)</Label>
          <Switch id="completed-now" checked={filters.completedNow} onCheckedChange={checked => updateFilter('completedNow', checked)} />
        </div>
        <div>
          <Label className="text-xs font-medium mb-1 block">Completion Year</Label>
          <Select value={filters.completionYear} onValueChange={value => updateFilter('completionYear', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2027">2027</SelectItem>
              <SelectItem value="2028">2028+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>;

  // Mobile view with drawer
  if (isMobile) {
    return <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 h-[36px]">
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
                  <Button variant="outline" onClick={resetFilters} className="flex-1 h-[36px]">
                    Reset
                  </Button>
                  <Button variant="premium" onClick={() => setIsDrawerOpen(false)} className="flex-1 h-[36px]">
                    Apply ({resultsCount})
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <div className="text-sm text-muted-foreground">
              {resultsCount} properties
            </div>
          </div>
        </div>
      </div>;
  }

  // Desktop view
  return <div className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3">
            {/* Price From/To */}
            <div>
              <Label className="text-xs font-medium mb-1 block">Price From</Label>
              <Select value={filters.priceFrom || undefined} onValueChange={value => updateFilter('priceFrom', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="No min" />
                </SelectTrigger>
                <SelectContent>
                  {priceSteps.map(step => <SelectItem key={step.value} value={step.value}>{step.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium mb-1 block">Price To</Label>
              <Select value={filters.priceTo || undefined} onValueChange={value => updateFilter('priceTo', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="No max" />
                </SelectTrigger>
                <SelectContent>
                  {priceSteps.map(step => <SelectItem key={step.value} value={step.value}>{step.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Tenure */}
            <div>
              <Label className="text-xs font-medium mb-1 block">Tenure</Label>
              <Select value={filters.tenure} onValueChange={value => updateFilter('tenure', value)}>
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
              <Select value={filters.walkToStation} onValueChange={value => updateFilter('walkToStation', value)}>
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
                <Select value={filters.bedroomsMin || undefined} onValueChange={handleBedroomsMinChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="No min" />
                  </SelectTrigger>
                  <SelectContent>
                    {bedroomOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1 block">Max Bedrooms</Label>
                <Select value={filters.bedroomsMax || undefined} onValueChange={handleBedroomsMaxChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="No max" />
                  </SelectTrigger>
                  <SelectContent>
                    {bedroomOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Zone and Amenities */}
            <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium mb-1 block">Zone</Label>
              <Select value={filters.zones[0] || undefined} onValueChange={value => updateFilter('zones', value ? [value] : [])}>
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
                <div className="grid grid-cols-2 gap-1.5 h-9 overflow-y-auto pr-1 border border-border rounded-md p-2">
                  {['Gym', 'Pool', 'Concierge', '24/7 Security', 'Parking', 'Balcony'].map(amenity => <div key={amenity} className="flex items-center space-x-1">
                      <Checkbox id={`desktop-amenity-${amenity}`} checked={filters.amenities.includes(amenity)} onCheckedChange={() => toggleAmenity(amenity)} className="h-2 w-2 min-h-0 min-w-0" />
                      <Label htmlFor={`desktop-amenity-${amenity}`} className="text-xs cursor-pointer">
                        {amenity}
                      </Label>
                    </div>)}
                </div>
              </div>
            </div>
          </div>

          {/* Zones */}

          {/* Amenities */}
          

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              {resultsCount} properties found
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetFilters} className="h-9">
                Reset All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default FilterBar;