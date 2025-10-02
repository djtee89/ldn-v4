import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { History, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PriceList {
  id: string;
  uploaded_at: string;
  published_at: string | null;
  published_by: string | null;
  notes: string | null;
  is_active: boolean;
}

interface RollbackDialogProps {
  devId: string;
  onRollbackComplete: () => void;
}

export function RollbackDialog({ devId, onRollbackComplete }: RollbackDialogProps) {
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPriceLists = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('price_lists')
        .select('*')
        .eq('dev_id', devId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setPriceLists(data || []);
    } catch (error) {
      console.error('Error fetching price lists:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch price list history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async () => {
    if (!selectedListId) return;

    setLoading(true);
    try {
      // Call the publish function with the selected price list
      const { data, error } = await supabase.functions.invoke('publish', {
        body: { price_list_id: selectedListId },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Price list restored successfully',
      });

      onRollbackComplete();
      setSelectedListId(null);
    } catch (error) {
      console.error('Error rolling back:', error);
      toast({
        title: 'Error',
        description: 'Failed to restore price list',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" onClick={fetchPriceLists} className="gap-2">
          <History className="h-4 w-4" />
          Rollback
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Restore Previous Price List
          </AlertDialogTitle>
          <AlertDialogDescription>
            Select a previous price list snapshot to restore. This will publish the selected version and make it active.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading history...
            </div>
          ) : priceLists.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No price list history available
            </div>
          ) : (
            <div className="space-y-2">
              {priceLists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => setSelectedListId(list.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedListId === list.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          Uploaded {formatDate(list.uploaded_at)}
                        </span>
                        {list.is_active && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      {list.published_at && (
                        <p className="text-xs text-muted-foreground">
                          Published {formatDate(list.published_at)}
                        </p>
                      )}
                      {list.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {list.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRollback}
            disabled={!selectedListId || loading}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {loading ? 'Restoring...' : 'Restore Selected'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
