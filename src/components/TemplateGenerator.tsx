import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface HeaderMapping {
  source_header: string;
  target_field: string;
}

export function TemplateGenerator({ developer }: { developer: string }) {
  const { data: mappings } = useQuery<HeaderMapping[]>({
    queryKey: ['header-mappings', developer],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('header_mappings')
        .select('source_header, target_field')
        .eq('developer', developer);
      if (error) throw error;
      return data || [];
    },
  });

  const generateTemplate = () => {
    if (!mappings || mappings.length === 0) {
      toast.error('No header mappings defined for this developer');
      return;
    }

    // Build header row using developer's column names
    const headers = mappings.map((m) => m.source_header);
    
    // Build example rows
    const exampleRows = [
      ['A101', '1', '450', '450000', 'Available'],
      ['A102', '2', '750', '650000', 'Under Offer'],
      ['B201', '1', '480', '475000', 'Available'],
    ];

    const csvContent = [
      headers.join(','),
      ...exampleRows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${developer.toLowerCase().replace(/\s+/g, '-')}-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Template for ${developer} downloaded`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Generator</CardTitle>
        <CardDescription>
          Download a CSV template with {developer}'s specific column headers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={generateTemplate} disabled={!mappings || mappings.length === 0}>
          <Download className="mr-2 h-4 w-4" /> Download {developer} Template
        </Button>
        {(!mappings || mappings.length === 0) && (
          <p className="text-sm text-muted-foreground mt-2">
            Define header mappings first to generate a template
          </p>
        )}
      </CardContent>
    </Card>
  );
}
