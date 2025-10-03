import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/Chip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronUp, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  distance: number;
  walkTime: number;
  brand?: string;
}

interface Category {
  name: string;
  label: string;
  icon: string;
  default_visible: boolean;
  display_order: number;
  radius_meters: number;
}

interface NearbyTabProps {
  developmentId: string;
  lat: number;
  lng: number;
  onCategorySelect?: (category: string, places: NearbyPlace[]) => void;
}

export const NearbyTab: React.FC<NearbyTabProps> = ({ 
  developmentId, 
  lat, 
  lng,
  onCategorySelect 
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [places, setPlaces] = useState<Record<string, NearbyPlace[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [showMore, setShowMore] = useState(false);
  const [lifestyleHighlights, setLifestyleHighlights] = useState<Record<string, NearbyPlace>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase
        .from('nearby_categories')
        .select('*')
        .order('display_order');

      if (error) {
        console.error('Error loading categories:', error);
        return;
      }

      setCategories(data || []);
      
      // Load lifestyle highlights (closest in each default category)
      const defaultCategories = (data || []).filter(c => c.default_visible).slice(0, 4);
      for (const cat of defaultCategories) {
        fetchNearby(cat.name, true);
      }
    };

    loadCategories();
  }, [developmentId, lat, lng]);

  const fetchNearby = async (categoryName: string, isHighlight: boolean = false) => {
    if (places[categoryName] && !isHighlight) return; // Already loaded

    setLoading(prev => ({ ...prev, [categoryName]: true }));

    try {
      const { data, error } = await supabase.functions.invoke('fetch-nearby', {
        body: {
          dev_id: developmentId,
          category: categoryName,
          lat,
          lng,
        },
      });

      if (error) throw error;

      const results = data?.results || [];
      setPlaces(prev => ({ ...prev, [categoryName]: results }));

      // Store highlight (closest one)
      if (isHighlight && results.length > 0) {
        setLifestyleHighlights(prev => ({ ...prev, [categoryName]: results[0] }));
      }

      // Notify parent if category is selected
      if (selectedCategory === categoryName && onCategorySelect) {
        onCategorySelect(categoryName, results);
      }
    } catch (err) {
      console.error(`Error fetching ${categoryName}:`, err);
      toast({
        title: 'Error',
        description: `Failed to load ${categoryName} data`,
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, [categoryName]: false }));
    }
  };

  const handleCategoryClick = async (categoryName: string) => {
    const newCategory = selectedCategory === categoryName ? null : categoryName;
    setSelectedCategory(newCategory);

    if (newCategory) {
      // Fetch data if not already loaded
      if (!places[newCategory]) {
        await fetchNearby(newCategory);
      }

      // Notify parent
      if (onCategorySelect) {
        onCategorySelect(newCategory, places[newCategory] || []);
      }
    } else {
      // Clear selection
      if (onCategorySelect) {
        onCategorySelect('', []);
      }
    }
  };

  const handleSeeAll = (categoryName: string) => {
    navigate(`/map?lifestyle=${categoryName}`);
  };

  const defaultCategories = categories.filter(c => c.default_visible);
  const moreCategories = categories.filter(c => !c.default_visible);
  const top3Places = selectedCategory ? (places[selectedCategory] || []).slice(0, 3) : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Lifestyle Highlights Strip */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(lifestyleHighlights).map(([catName, place]) => {
          const category = categories.find(c => c.name === catName);
          if (!category) return null;
          
          return (
            <Chip key={catName} variant="secondary" className="text-xs">
              {category.icon} {category.label} {place.walkTime} min
            </Chip>
          );
        })}
      </div>

      {/* Category Chips - Default */}
      <div>
        <div className="flex flex-wrap gap-2">
          {defaultCategories.map((cat) => (
            <Button
              key={cat.name}
              variant={selectedCategory === cat.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryClick(cat.name)}
              disabled={loading[cat.name]}
              className="text-xs"
            >
              {loading[cat.name] ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <span className="mr-1">{cat.icon}</span>
              )}
              {cat.label}
            </Button>
          ))}
        </div>

        {/* More Categories (Expandable) */}
        {moreCategories.length > 0 && (
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMore(!showMore)}
              className="text-xs text-muted-foreground"
            >
              {showMore ? (
                <>
                  Less <ChevronUp className="ml-1 h-3 w-3" />
                </>
              ) : (
                <>
                  More <ChevronDown className="ml-1 h-3 w-3" />
                </>
              )}
            </Button>
            
            {showMore && (
              <div className="flex flex-wrap gap-2 mt-2">
                {moreCategories.map((cat) => (
                  <Button
                    key={cat.name}
                    variant={selectedCategory === cat.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryClick(cat.name)}
                    disabled={loading[cat.name]}
                    className="text-xs"
                  >
                    {loading[cat.name] ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <span className="mr-1">{cat.icon}</span>
                    )}
                    {cat.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results List */}
      {selectedCategory && (
        <div className="border border-border rounded-lg">
          <ScrollArea className="h-[300px]">
            <div className="p-4 space-y-3">
              {loading[selectedCategory] ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : top3Places.length > 0 ? (
                <>
                  {top3Places.map((place) => (
                    <div key={place.id} className="flex items-start justify-between pb-3 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">{place.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {place.walkTime} min walk
                          {place.brand && ` • ${place.brand}`}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {places[selectedCategory]?.length > 3 && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handleSeeAll(selectedCategory)}
                      className="w-full text-xs"
                    >
                      See all {places[selectedCategory].length} results
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No {categories.find(c => c.name === selectedCategory)?.label.toLowerCase()} within{' '}
                    {categories.find(c => c.name === selectedCategory)?.radius_meters}m
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      // Could implement radius bump here
                      toast({
                        title: 'Try expanding search',
                        description: 'Consider searching a larger area',
                      });
                    }}
                    className="text-xs mt-2"
                  >
                    Try 1 km radius?
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {!selectedCategory && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Select a category to see nearby places
        </div>
      )}
    </div>
  );
};
