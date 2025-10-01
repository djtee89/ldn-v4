import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, MessageSquare, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Unit {
  id: string;
  unit_number: string;
  beds: number;
  price: number;
  size_sqft: number;
  aspect?: string;
  floor?: number;
  view_park?: boolean;
  view_river?: boolean;
  has_balcony?: boolean;
}

interface AskResponse {
  answer: string;
  sources: string[];
  units: Unit[];
}

export const KrpAskBox: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAsk = async () => {
    if (!query.trim()) {
      toast({
        title: 'Please enter a question',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('krp-ask', {
        body: { query, devId: 'krp' },
      });

      if (error) throw error;

      setResult(data as AskResponse);
    } catch (error) {
      console.error('Error asking question:', error);
      toast({
        title: 'Failed to get answer',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-neutral-900">Ask about this scheme</h3>
      </div>
      
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., Any 2-beds under £1.2m facing the park?"
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={handleAsk} disabled={loading} size="sm">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask'}
        </Button>
      </div>

      {result && (
        <div className="mt-4 space-y-3">
          {/* Answer */}
          <div className="p-3 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-800 leading-relaxed">{result.answer}</p>
          </div>

          {/* Sources */}
          {result.sources.length > 0 && (
            <div className="text-xs text-neutral-500 flex items-center gap-2">
              <ExternalLink className="w-3 h-3" />
              <span>Sources: {result.sources.join(' • ')}</span>
            </div>
          )}

          {/* Matching Units */}
          {result.units && result.units.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-neutral-600">
                {result.units.length} matching {result.units.length === 1 ? 'unit' : 'units'} found:
              </p>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {result.units.map((unit) => (
                  <div
                    key={unit.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 text-sm hover:shadow-sm transition-shadow"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-neutral-900">
                        Unit {unit.unit_number} • {unit.beds} bed
                      </div>
                      <div className="text-xs text-neutral-600 space-x-2">
                        <span>{unit.size_sqft.toLocaleString()} sq ft</span>
                        {unit.aspect && <span>• {unit.aspect}</span>}
                        {unit.floor !== null && unit.floor !== undefined && (
                          <span>• Floor {unit.floor}</span>
                        )}
                      </div>
                      <div className="flex gap-2 text-xs">
                        {unit.view_park && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                            Park view
                          </span>
                        )}
                        {unit.view_river && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                            River view
                          </span>
                        )}
                        {unit.has_balcony && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                            Balcony
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        £{unit.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No units found message */}
          {result.units && result.units.length === 0 && result.answer.includes('unit') && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                No units match your exact criteria. Try adjusting your requirements.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KrpAskBox;