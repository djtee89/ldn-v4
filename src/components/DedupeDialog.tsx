import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type Duplicate = {
  dev_id_a: string;
  dev_id_b: string;
  name_a: string;
  name_b: string;
  developer_a: string;
  developer_b: string;
  postcode_a: string;
  postcode_b: string;
  distance_m: number | null;
  match_reason: string;
  confidence: number;
};

type DedupeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DedupeDialog({ open, onOpenChange }: DedupeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [duplicates, setDuplicates] = useState<Duplicate[]>([]);
  const [merging, setMerging] = useState<string | null>(null);
  const { toast } = useToast();

  const findDuplicates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('dedupe-developments', {
        body: { action: 'find' }
      });

      if (error) throw error;

      setDuplicates(data.duplicates || []);
      
      if (data.duplicates.length === 0) {
        toast({
          title: "No Duplicates Found",
          description: "All developments are unique.",
        });
      }
    } catch (error) {
      console.error('Error finding duplicates:', error);
      toast({
        title: "Error",
        description: "Failed to find duplicates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const mergeDuplicates = async (keepId: string, removeId: string) => {
    setMerging(`${keepId}-${removeId}`);
    try {
      const { error } = await supabase.functions.invoke('dedupe-developments', {
        body: { 
          action: 'merge',
          keep_id: keepId,
          remove_id: removeId
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Developments merged successfully",
      });

      // Refresh duplicates list
      await findDuplicates();
    } catch (error) {
      console.error('Error merging duplicates:', error);
      toast({
        title: "Error",
        description: "Failed to merge developments",
        variant: "destructive",
      });
    } finally {
      setMerging(null);
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return <Badge variant="destructive">High Risk</Badge>;
    if (confidence >= 0.7) return <Badge className="bg-orange-500">Medium Risk</Badge>;
    return <Badge variant="outline">Low Risk</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Find Duplicate Developments</DialogTitle>
          <DialogDescription>
            Detect and merge duplicate development entries based on location, name, and developer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button 
            onClick={findDuplicates} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning for duplicates...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Scan for Duplicates
              </>
            )}
          </Button>

          {duplicates.length > 0 && (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {duplicates.map((dup, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Potential Duplicate</CardTitle>
                        {getConfidenceBadge(dup.confidence)}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {dup.match_reason}
                        {dup.distance_m && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {Math.round(dup.distance_m)}m apart
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="font-semibold text-sm text-muted-foreground">Development A</div>
                          <div>
                            <div className="font-medium">{dup.name_a}</div>
                            <div className="text-sm text-muted-foreground">{dup.developer_a}</div>
                            <div className="text-sm text-muted-foreground">{dup.postcode_a}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => mergeDuplicates(dup.dev_id_a, dup.dev_id_b)}
                            disabled={merging === `${dup.dev_id_a}-${dup.dev_id_b}`}
                            className="w-full"
                          >
                            {merging === `${dup.dev_id_a}-${dup.dev_id_b}` ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Merging...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Keep This
                              </>
                            )}
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="font-semibold text-sm text-muted-foreground">Development B</div>
                          <div>
                            <div className="font-medium">{dup.name_b}</div>
                            <div className="text-sm text-muted-foreground">{dup.developer_b}</div>
                            <div className="text-sm text-muted-foreground">{dup.postcode_b}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => mergeDuplicates(dup.dev_id_b, dup.dev_id_a)}
                            disabled={merging === `${dup.dev_id_b}-${dup.dev_id_a}`}
                            className="w-full"
                          >
                            {merging === `${dup.dev_id_b}-${dup.dev_id_a}` ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Merging...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Keep This
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}

          {!loading && duplicates.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No duplicates found. Click "Scan for Duplicates" to check for potential matches.
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
