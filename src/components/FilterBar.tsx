import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';

export interface FilterState {
  priceFrom: string;
  priceTo: string;
  bedrooms: string;
  zone: string;
  walkToStation: string;
  keyword: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultsCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, resultsCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      priceFrom: '',
      priceTo: '',
      bedrooms: 'any',
      zone: 'any',
      walkToStation: 'any',
      keyword: ''
    });
  };

  return (
    <div className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          <div className="text-sm text-muted-foreground">
            {resultsCount} properties found
          </div>
        </div>

        {/* Filter Controls */}
        <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
            {/* Price Range */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Price From
                </label>
                <Input
                  placeholder="£500k"
                  value={filters.priceFrom}
                  onChange={(e) => updateFilter('priceFrom', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Price To
                </label>
                <Input
                  placeholder="£2m"
                  value={filters.priceTo}
                  onChange={(e) => updateFilter('priceTo', e.target.value)}
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Bedrooms
              </label>
              <Select value={filters.bedrooms} onValueChange={(value) => updateFilter('bedrooms', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1 bed</SelectItem>
                  <SelectItem value="2">2 bed</SelectItem>
                  <SelectItem value="3">3 bed</SelectItem>
                  <SelectItem value="4+">4+ bed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Zone */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Zone
              </label>
              <Select value={filters.zone} onValueChange={(value) => updateFilter('zone', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
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
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Walk to Station
              </label>
              <Select value={filters.walkToStation} onValueChange={(value) => updateFilter('walkToStation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="5">5 mins</SelectItem>
                  <SelectItem value="10">10 mins</SelectItem>
                  <SelectItem value="15">15 mins</SelectItem>
                  <SelectItem value="20">20 mins</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="premium" className="flex-1">
                Apply
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>

          {/* Keyword Search */}
          <div className="mt-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by development name, area, or developer..."
                className="pl-10"
                value={filters.keyword}
                onChange={(e) => updateFilter('keyword', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results Counter - Desktop */}
        <div className="hidden lg:block mt-4 text-sm text-muted-foreground">
          {resultsCount} properties found
        </div>
      </div>
    </div>
  );
};

export default FilterBar;