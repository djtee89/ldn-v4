import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  CheckCircle, 
  RotateCcw, 
  Star, 
  Image as ImageIcon,
  Download,
  Search 
} from 'lucide-react';

interface ChangeLogEntry {
  id: string;
  dev_id: string;
  change_type: string;
  changed_by: string | null;
  changed_at: string;
  details: any;
  notes: string | null;
}

export function ChangeDiary({ devId }: { devId: string }) {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: changes } = useQuery<ChangeLogEntry[]>({
    queryKey: ['change-log', devId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('change_log')
        .select('*')
        .eq('dev_id', devId)
        .order('changed_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'price_list_upload':
        return <Upload className="h-4 w-4" />;
      case 'publish':
        return <CheckCircle className="h-4 w-4" />;
      case 'rollback':
        return <RotateCcw className="h-4 w-4" />;
      case 'hottest_override':
        return <Star className="h-4 w-4" />;
      case 'image_update':
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'price_list_upload':
        return 'default';
      case 'publish':
        return 'default';
      case 'rollback':
        return 'destructive';
      case 'hottest_override':
        return 'default';
      case 'image_update':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDetails = (type: string, details: any) => {
    switch (type) {
      case 'price_list_upload':
        return `${details.rows_parsed || 0} units parsed`;
      case 'publish':
        return `${details.units_updated || 0} units updated`;
      case 'rollback':
        return `Restored to ${new Date(details.restored_to).toLocaleDateString()}`;
      case 'hottest_override':
        return `Set to ${details.unit_number}`;
      case 'image_update':
        return details.action || 'Updated images';
      default:
        return '';
    }
  };

  const exportCSV = () => {
    if (!changes || changes.length === 0) return;

    const headers = ['Date', 'Type', 'Details', 'Notes'];
    const rows = changes.map((c) => [
      new Date(c.changed_at).toLocaleString(),
      c.change_type.replace('_', ' '),
      formatDetails(c.change_type, c.details),
      c.notes || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `change-diary-${devId}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = changes?.filter((c) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      c.change_type.toLowerCase().includes(search) ||
      c.notes?.toLowerCase().includes(search) ||
      formatDetails(c.change_type, c.details).toLowerCase().includes(search)
    );
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Change Diary</CardTitle>
            <CardDescription>
              Complete timeline of all changes to this development
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search changes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          {!filtered || filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No changes recorded yet
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((change) => (
                <div
                  key={change.id}
                  className="border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Badge variant={getColor(change.change_type) as any} className="gap-1 mt-1">
                        {getIcon(change.change_type)}
                        {change.change_type.replace(/_/g, ' ')}
                      </Badge>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          {formatDetails(change.change_type, change.details)}
                        </p>
                        {change.notes && (
                          <p className="text-sm text-muted-foreground">{change.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(change.changed_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
