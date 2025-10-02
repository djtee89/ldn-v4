import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SearchFiltersBarProps {
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: FilterState) => void;
  searchValue: string;
  activeFilters: FilterState;
}

export interface FilterState {
  noImages: boolean;
  noPriceList: boolean;
  missingStations: boolean;
  missingSchools: boolean;
}

export function SearchFiltersBar({ 
  onSearchChange, 
  onFiltersChange, 
  searchValue,
  activeFilters 
}: SearchFiltersBarProps) {
  const [search, setSearch] = useState(searchValue);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const toggleFilter = (filter: keyof FilterState) => {
    const newFilters = { ...activeFilters, [filter]: !activeFilters[filter] };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({
      noImages: false,
      noPriceList: false,
      missingStations: false,
      missingSchools: false,
    });
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, postcode, or developer..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by issues</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={activeFilters.noImages}
            onCheckedChange={() => toggleFilter('noImages')}
          >
            No images
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={activeFilters.noPriceList}
            onCheckedChange={() => toggleFilter('noPriceList')}
          >
            No price list
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={activeFilters.missingStations}
            onCheckedChange={() => toggleFilter('missingStations')}
          >
            Missing stations
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={activeFilters.missingSchools}
            onCheckedChange={() => toggleFilter('missingSchools')}
          >
            Missing schools
          </DropdownMenuCheckboxItem>
          {activeFilterCount > 0 && (
            <>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="w-full justify-start gap-2"
              >
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
