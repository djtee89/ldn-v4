import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface SearchExploreSectionProps {
  onFiltersChange?: (filters: any) => void;
}

const SearchExploreSection: React.FC<SearchExploreSectionProps> = ({ onFiltersChange }) => {
  return (
    <section className="bg-[hsl(var(--explore-section))] text-[hsl(var(--explore-section-foreground))] py-8 sm:py-12 mx-4 sm:mx-6 my-6 rounded-3xl">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Search & Explore</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Price Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Price</label>
            <Select>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Any price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any price</SelectItem>
                <SelectItem value="0-400k">Up to £400k</SelectItem>
                <SelectItem value="400k-600k">£400k - £600k</SelectItem>
                <SelectItem value="600k-800k">£600k - £800k</SelectItem>
                <SelectItem value="800k+">£800k+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Bedrooms</label>
            <Select>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Any bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any bedrooms</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="1">1 bedroom</SelectItem>
                <SelectItem value="2">2 bedrooms</SelectItem>
                <SelectItem value="3+">3+ bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Location</label>
            <Input 
              placeholder="e.g. Canary Wharf" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {/* Apply Button */}
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SearchExploreSection;
