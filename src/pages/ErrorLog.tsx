import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle2, ExternalLink, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ErrorLog {
  id: string;
  occurred_at: string;
  error_type: string;
  error_message: string;
  context: any;
  file_path: string | null;
  resolved: boolean;
}

export default function ErrorLog() {
  const [showResolved, setShowResolved] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: errors, isLoading } = useQuery({
    queryKey: ['error-log', showResolved],
    queryFn: async () => {
      let query = supabase
        .from('error_log')
        .select('*')
        .order('occurred_at', { ascending: false });

      if (!showResolved) {
        query = query.eq('resolved', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ErrorLog[];
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('error_log')
        .update({ resolved: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['error-log'] });
      toast({ title: 'Error marked as resolved' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('error_log')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['error-log'] });
      toast({ title: 'Error log deleted' });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case 'CSV_PARSE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'VALIDATION':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'UPLOAD':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'PUBLISH':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Error Log</h1>
            <p className="text-muted-foreground">Track and resolve system errors</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={showResolved ? 'default' : 'outline'}
              onClick={() => setShowResolved(!showResolved)}
            >
              {showResolved ? 'Hide' : 'Show'} Resolved
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              Back to Admin
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              Loading errors...
            </CardContent>
          </Card>
        ) : !errors || errors.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium">No errors found</p>
              <p className="text-sm text-muted-foreground">
                {showResolved ? 'No resolved errors' : 'Everything is running smoothly'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {errors.map((error) => (
                <Card key={error.id} className={error.resolved ? 'opacity-60' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getErrorTypeColor(error.error_type)}>
                              {error.error_type}
                            </Badge>
                            {error.resolved && (
                              <Badge variant="outline" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Resolved
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{error.error_message}</CardTitle>
                          <CardDescription>
                            Occurred {formatDate(error.occurred_at)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!error.resolved && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resolveMutation.mutate(error.id)}
                            disabled={resolveMutation.isPending}
                          >
                            Mark Resolved
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(error.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {error.file_path && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">File:</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {error.file_path}
                        </code>
                      </div>
                    )}
                    {error.context && Object.keys(error.context).length > 0 && (
                      <details className="group">
                        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                          View details
                        </summary>
                        <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(error.context, null, 2)}
                        </pre>
                      </details>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
