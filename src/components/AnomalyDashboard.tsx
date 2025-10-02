import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, TrendingDown, Copy, AlertTriangle } from 'lucide-react';

interface Anomaly {
  id: string;
  dev_id: string;
  unit_id: string;
  anomaly_type: string;
  severity: string;
  details: any;
  detected_at: string;
  resolved: boolean;
}

export function AnomalyDashboard({ devId }: { devId: string }) {
  const queryClient = useQueryClient();

  const { data: anomalies } = useQuery<Anomaly[]>({
    queryKey: ['anomalies', devId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unit_anomalies')
        .select('*')
        .eq('dev_id', devId)
        .eq('resolved', false)
        .order('detected_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('unit_anomalies')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anomalies', devId] });
      toast.success('Anomaly resolved');
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'price_drop':
        return <TrendingDown className="h-4 w-4" />;
      case 'duplicate':
        return <Copy className="h-4 w-4" />;
      case 'psf_outlier':
        return <AlertCircle className="h-4 w-4" />;
      case 'missing_data':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatDetails = (type: string, details: any) => {
    switch (type) {
      case 'price_drop':
        return `£${details.old_price.toLocaleString()} → £${details.new_price.toLocaleString()} (-${details.drop_pct}%)`;
      case 'duplicate':
        return details.duplicate_with
          ? `Similar to ${details.duplicate_with} (${details.size_diff_pct}% size difference)`
          : `${details.count} units with code "${details.unit_number}"`;
      case 'psf_outlier':
        return `£${details.psf}/sqft (avg: £${details.avg_psf}, z-score: ${details.z_score})`;
      case 'missing_data':
        return `Missing ${details.field}${details.unit_number ? ` for ${details.unit_number}` : ''}`;
      default:
        return JSON.stringify(details);
    }
  };

  const critical = anomalies?.filter((a) => a.severity === 'error').length || 0;
  const warnings = anomalies?.filter((a) => a.severity === 'warning').length || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Quality Checks</CardTitle>
            <CardDescription>
              Anomalies detected after data processing
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              {critical} Critical
            </Badge>
            <Badge variant="default" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {warnings} Warnings
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!anomalies || anomalies.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p className="text-muted-foreground">No anomalies detected. All checks passed!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anomalies.map((anomaly) => (
                <TableRow key={anomaly.id}>
                  <TableCell>
                    <Badge variant={getSeverityColor(anomaly.severity) as any} className="gap-1">
                      {getIcon(anomaly.anomaly_type)}
                      {anomaly.anomaly_type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDetails(anomaly.anomaly_type, anomaly.details)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(anomaly.detected_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => resolveMutation.mutate(anomaly.id)}
                    >
                      Resolve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
